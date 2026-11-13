<#
.SYNOPSIS
    Automated launcher for the OctoByte Platform.
    1. Starts the backend (Spring Boot gateway on port 8080).
    2. Opens a Cloudflare tunnel for the backend.
    3. Updates frontend/.env with the backend tunnel API URL.
    4. Starts the frontend (Vite on port 5173).
    5. Opens a Cloudflare tunnel for the frontend.
    6. Displays the public frontend link and keeps all processes running.
    Use -Test switch for automated verification.
#>

param(
    [switch]$Test
)

$ErrorActionPreference = "Stop"
$ProjectRoot = $PSScriptRoot
$LogDir = Join-Path $ProjectRoot ".logs"

if (-not (Test-Path $LogDir)) {
    New-Item -ItemType Directory -Path $LogDir -Force | Out-Null
}

$BackendOutLog = Join-Path $LogDir "backend.log"
$BackendErrLog = Join-Path $LogDir "backend-error.log"

$BackendTunnelOutLog = Join-Path $LogDir "backend-tunnel.log"
$BackendTunnelErrLog = Join-Path $LogDir "backend-tunnel-error.log"

$FrontendOutLog = Join-Path $LogDir "frontend.log"
$FrontendErrLog = Join-Path $LogDir "frontend-error.log"

$FrontendTunnelOutLog = Join-Path $LogDir "frontend-tunnel.log"
$FrontendTunnelErrLog = Join-Path $LogDir "frontend-tunnel-error.log"

$AllLogs = @(
    $BackendOutLog, $BackendErrLog,
    $BackendTunnelOutLog, $BackendTunnelErrLog,
    $FrontendOutLog, $FrontendErrLog,
    $FrontendTunnelOutLog, $FrontendTunnelErrLog
)

# Clean old log files
foreach ($log in $AllLogs) {
    if (Test-Path $log) { Remove-Item $log -Force -ErrorAction SilentlyContinue }
}

$StartedProcesses = [System.Collections.Generic.List[System.Diagnostics.Process]]::new()

function Stop-PortListener {
    param([int]$Port)
    try {
        $netstat = netstat -ano | Select-String ":$Port\s+.*LISTENING\s+(\d+)"
        $killed = @{}
        foreach ($match in $netstat) {
            if ($match.Line -match ":$Port\s+.*LISTENING\s+(\d+)") {
                $pidToKill = $matches[1]
                if ($pidToKill -and $pidToKill -ne "0" -and $pidToKill -ne "$PID" -and -not $killed.ContainsKey($pidToKill)) {
                    $killed[$pidToKill] = $true
                    Write-Host "[Cleanup] Port $Port is occupied by PID $pidToKill. Terminating..." -ForegroundColor Yellow
                    Start-Process -FilePath "taskkill" -ArgumentList "/PID", $pidToKill, "/T", "/F" -NoNewWindow -Wait -ErrorAction SilentlyContinue | Out-Null
                }
            }
        }
        if ($killed.Count -gt 0) {
            Start-Sleep -Seconds 1
        }
    } catch {}
}

function Stop-LingeringProcesses {
    Stop-PortListener -Port 8080
    Stop-PortListener -Port 5173
    Get-Process -Name "cloudflared" -ErrorAction SilentlyContinue | ForEach-Object {
        try {
            Write-Host "[Cleanup] Terminating previous cloudflared process (PID $($_.Id))..." -ForegroundColor Yellow
            Start-Process -FilePath "taskkill" -ArgumentList "/PID", $_.Id, "/T", "/F" -NoNewWindow -Wait -ErrorAction SilentlyContinue | Out-Null
        } catch {}
    }
}

function Stop-AllProcesses {
    Write-Host "`n[Stopping] Terminating background processes and tunnels..." -ForegroundColor Yellow
    foreach ($proc in $StartedProcesses) {
        if ($proc -and -not $proc.HasExited) {
            try {
                Start-Process -FilePath "taskkill" -ArgumentList "/PID", $proc.Id, "/T", "/F" -NoNewWindow -Wait -ErrorAction SilentlyContinue | Out-Null
            } catch {
                try { $proc.Kill() } catch {}
            }
        }
    }
    Write-Host "[Stopped] All services and tunnels have been shut down." -ForegroundColor Green
}

function Wait-ForTunnelUrl {
    param(
        [string[]]$LogFiles,
        [string]$Name,
        [System.Diagnostics.Process]$Process = $null,
        [int]$TimeoutSeconds = 60
    )
    $startTime = [System.DateTime]::UtcNow
    $pattern = 'https://[a-zA-Z0-9-]+\.trycloudflare\.com'
    Write-Host "[Tunnel] Waiting for $Name Cloudflare tunnel URL..." -ForegroundColor Cyan

    $tunnelUrl = $null

    while (([System.DateTime]::UtcNow - $startTime).TotalSeconds -lt $TimeoutSeconds) {
        if ($Process -and $Process.HasExited) {
            throw "$Name tunnel process terminated unexpectedly with exit code $($Process.ExitCode)."
        }

        foreach ($file in $LogFiles) {
            if (Test-Path $file) {
                $lines = Get-Content $file -ErrorAction SilentlyContinue
                if (-not $tunnelUrl) {
                    foreach ($line in $lines) {
                        if ($line -match $pattern) {
                            $tunnelUrl = $matches[0].Trim()
                            break
                        }
                    }
                }
                if ($tunnelUrl) {
                    # Confirm tunnel has registered connection with Cloudflare edge
                    $hasRegistered = $lines | Select-String -Pattern "Registered tunnel connection"
                    if ($hasRegistered) {
                        Write-Host "[Tunnel] $Name tunnel ready and connected: $tunnelUrl" -ForegroundColor Green
                        return $tunnelUrl
                    }
                }
            }
        }
        Start-Sleep -Milliseconds 800
    }

    if ($tunnelUrl) {
        Write-Host "[Tunnel] $Name tunnel URL obtained: $tunnelUrl" -ForegroundColor Green
        return $tunnelUrl
    }
    throw "Timed out waiting for $Name Cloudflare tunnel URL. Check logs: $($LogFiles -join ', ')"
}

function Wait-ForHttp {
    param(
        [string]$Url,
        [string]$Name,
        [System.Diagnostics.Process]$Process = $null,
        [int]$TimeoutSeconds = 120
    )
    $startTime = [System.DateTime]::UtcNow
    Write-Host "[Health] Waiting for $Name to become healthy at $Url..." -ForegroundColor Cyan

    # Build candidate URLs: prioritize 127.0.0.1, but include [::1] and original URL to support both IPv4 and IPv6
    $probeUrls = [System.Collections.Generic.List[string]]::new()
    if ($Url -match "localhost") {
        $probeUrls.Add(($Url -replace "localhost", "127.0.0.1"))
        $probeUrls.Add(($Url -replace "localhost", "[::1]"))
    } elseif ($Url -match "127\.0\.0\.1") {
        $probeUrls.Add($Url)
        $probeUrls.Add(($Url -replace "127\.0\.0\.1", "[::1]"))
    } else {
        $probeUrls.Add($Url)
    }

    while (([System.DateTime]::UtcNow - $startTime).TotalSeconds -lt $TimeoutSeconds) {
        if ($Process -and $Process.HasExited) {
            throw "$Name process exited unexpectedly with exit code $($Process.ExitCode)."
        }

        foreach ($pUrl in $probeUrls) {
            try {
                $res = Invoke-WebRequest -Uri $pUrl -Method Get -TimeoutSec 1 -UseBasicParsing -ErrorAction Stop
                if ($res.StatusCode -ge 200 -and $res.StatusCode -lt 400) {
                    Write-Host "[Health] $Name is live (HTTP $($res.StatusCode))!" -ForegroundColor Green
                    return
                }
            } catch {
                if ($_.Exception.Response) {
                    $code = [int]$_.Exception.Response.StatusCode
                    if ($code -ge 200 -and $code -lt 400) {
                        Write-Host "[Health] $Name is live (HTTP $code)!" -ForegroundColor Green
                        return
                    }
                }
            }
        }
        Start-Sleep -Seconds 1
    }
    throw "Timed out waiting for $Name at $Url"
}

try {
    # 0. Check dependencies & cleanup previous runs
    if (-not (Get-Command cloudflared -ErrorAction SilentlyContinue)) {
        throw "cloudflared CLI was not found in PATH. Please install it first."
    }

    Write-Host "==========================================================" -ForegroundColor Magenta
    Write-Host "      OctoByte Platform - Automated Run and Tunnel" -ForegroundColor Magenta
    Write-Host "==========================================================" -ForegroundColor Magenta

    Stop-LingeringProcesses

    # 1. Start Backend (Spring Boot Gateway on 8080)
    Write-Host "`n[1/5] Starting Backend (Spring Boot Gateway on port 8080)..." -ForegroundColor Yellow
    $gatewayDir = Join-Path $ProjectRoot "gateway"
    $mvnwCmd = Join-Path $gatewayDir "mvnw.cmd"

    $backendProc = Start-Process -FilePath $mvnwCmd `
        -ArgumentList "spring-boot:run" `
        -WorkingDirectory $gatewayDir `
        -RedirectStandardOutput $BackendOutLog `
        -RedirectStandardError $BackendErrLog `
        -PassThru
    $StartedProcesses.Add($backendProc)

    Wait-ForHttp -Url "http://127.0.0.1:8080/api/health" -Name "Backend Gateway" -Process $backendProc -TimeoutSeconds 120

    # 2. Start Backend Cloudflare Tunnel
    Write-Host "`n[2/5] Creating Cloudflare tunnel for Backend (port 8080)..." -ForegroundColor Yellow
    $backendTunnelProc = Start-Process -FilePath "cloudflared" `
        -ArgumentList "tunnel", "--url", "http://127.0.0.1:8080" `
        -RedirectStandardOutput $BackendTunnelOutLog `
        -RedirectStandardError $BackendTunnelErrLog `
        -PassThru
    $StartedProcesses.Add($backendTunnelProc)

    $backendTunnelUrl = Wait-ForTunnelUrl -LogFiles @($BackendTunnelErrLog, $BackendTunnelOutLog) -Name "Backend" -Process $backendTunnelProc

    # 3. Update frontend/.env with Backend Tunnel URL
    Write-Host "`n[3/5] Updating frontend/.env with backend tunnel API URL..." -ForegroundColor Yellow
    $frontendEnvFile = Join-Path $ProjectRoot "frontend\.env"
    $apiBaseUrl = "$backendTunnelUrl/api"
    $envContent = "VITE_API_BASE_URL=$apiBaseUrl"
    Set-Content -Path $frontendEnvFile -Value $envContent -Force
    Write-Host "[Config] Updated $frontendEnvFile -> $envContent" -ForegroundColor Green

    # 4. Start Frontend (Vite on port 5173)
    Write-Host "`n[4/5] Starting Frontend (Vite dev server on port 5173)..." -ForegroundColor Yellow
    $frontendDir = Join-Path $ProjectRoot "frontend"

    $frontendProc = Start-Process -FilePath "npm.cmd" `
        -ArgumentList "run", "dev", "--", "--host", "0.0.0.0" `
        -WorkingDirectory $frontendDir `
        -RedirectStandardOutput $FrontendOutLog `
        -RedirectStandardError $FrontendErrLog `
        -PassThru
    $StartedProcesses.Add($frontendProc)

    Wait-ForHttp -Url "http://127.0.0.1:5173" -Name "Frontend (Vite)" -Process $frontendProc -TimeoutSeconds 45

    # 5. Start Frontend Cloudflare Tunnel
    Write-Host "`n[5/5] Creating Cloudflare tunnel for Frontend (port 5173)..." -ForegroundColor Yellow
    $frontendTunnelProc = Start-Process -FilePath "cloudflared" `
        -ArgumentList "tunnel", "--url", "http://127.0.0.1:5173" `
        -RedirectStandardOutput $FrontendTunnelOutLog `
        -RedirectStandardError $FrontendTunnelErrLog `
        -PassThru
    $StartedProcesses.Add($frontendTunnelProc)

    $frontendTunnelUrl = Wait-ForTunnelUrl -LogFiles @($FrontendTunnelErrLog, $FrontendTunnelOutLog) -Name "Frontend" -Process $frontendTunnelProc

    # 6. Print Summary Banner
    Write-Host "`n"
    Write-Host "============================================================================" -ForegroundColor Green
    Write-Host "                      OCTOBYTE PLATFORM IS LIVE!                            " -ForegroundColor Green
    Write-Host "============================================================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "  [FRONTEND PUBLIC URL] : $frontendTunnelUrl" -ForegroundColor Yellow
    Write-Host "   Frontend Local       : http://localhost:5173 (or http://127.0.0.1:5173)" -ForegroundColor Gray
    Write-Host ""
    Write-Host "  [BACKEND PUBLIC URL]  : $backendTunnelUrl" -ForegroundColor Cyan
    Write-Host "   Backend Local        : http://localhost:8080 (or http://127.0.0.1:8080)" -ForegroundColor Gray
    Write-Host "   Backend API Target   : $apiBaseUrl" -ForegroundColor Gray
    Write-Host ""
    Write-Host "============================================================================" -ForegroundColor Green
    Write-Host " Logs saved in: $LogDir" -ForegroundColor DarkGray
    Write-Host " Press [Ctrl+C] to stop all services and tunnels." -ForegroundColor White
    Write-Host "============================================================================" -ForegroundColor Green

    if ($Test) {
        Write-Host "`n[Test Mode] Verifying public tunnel endpoints (allowing DNS propagation)..." -ForegroundColor Cyan
        Start-Sleep -Seconds 5

        $backendOk = $false
        for ($i = 1; $i -le 15; $i++) {
            try {
                Clear-DnsClientCache -ErrorAction SilentlyContinue
                $backendCheck = Invoke-WebRequest -Uri "$backendTunnelUrl/api/health" -Method Get -TimeoutSec 10 -UseBasicParsing -ErrorAction Stop
                if ($backendCheck.StatusCode -eq 200) {
                    Write-Host "[Test Mode] Backend public tunnel response: $($backendCheck.StatusCode) - $($backendCheck.Content.Trim())" -ForegroundColor Green
                    $backendOk = $true
                    break
                }
            } catch {
                Write-Host "[Test Mode] Backend probe attempt $i waiting for DNS..." -ForegroundColor DarkGray
                Start-Sleep -Seconds 3
            }
        }
        if (-not $backendOk) { throw "Backend public tunnel failed verification." }

        $frontendOk = $false
        for ($i = 1; $i -le 15; $i++) {
            try {
                Clear-DnsClientCache -ErrorAction SilentlyContinue
                $frontendCheck = Invoke-WebRequest -Uri "$frontendTunnelUrl" -Method Get -TimeoutSec 10 -UseBasicParsing -ErrorAction Stop
                if ($frontendCheck.StatusCode -ge 200 -and $frontendCheck.StatusCode -lt 400) {
                    Write-Host "[Test Mode] Frontend public tunnel response: $($frontendCheck.StatusCode)" -ForegroundColor Green
                    $frontendOk = $true
                    break
                }
            } catch {
                Write-Host "[Test Mode] Frontend probe attempt $($i): $($_.Exception.Message)" -ForegroundColor DarkGray
                Start-Sleep -Seconds 3
            }
        }
        if (-not $frontendOk) { throw "Frontend public tunnel failed verification." }

        Write-Host "`n[Test Mode] ALL CHECKS PASSED SUCCESSFULLY!" -ForegroundColor Green
        return
    }

    # Keep script alive while child processes run
    while ($true) {
        if ($backendProc.HasExited) { throw "Backend process terminated unexpectedly. Check $BackendErrLog" }
        if ($frontendProc.HasExited) { throw "Frontend process terminated unexpectedly. Check $FrontendErrLog" }
        Start-Sleep -Seconds 2
    }
}
catch {
    Write-Host "`n[Error] $($_.Exception.Message)" -ForegroundColor Red
}
finally {
    Stop-AllProcesses
}
