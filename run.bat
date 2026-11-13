@echo off
setlocal
cd /d "%~dp0"
title OctoByte Platform Runner

echo Starting OctoByte Platform via PowerShell...
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0run.ps1"
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo Script exited with error code %ERRORLEVEL%.
    pause
)

