
package com.aiupskillingplatform.controllers.auth;

import com.aiupskillingplatform.dto.auth.AuthResponse;
import com.aiupskillingplatform.dto.auth.LoginRequest;
import com.aiupskillingplatform.dto.auth.RegisterRequest;
import com.aiupskillingplatform.dto.auth.UserResponse;
import com.aiupskillingplatform.entities.User;
import com.aiupskillingplatform.repositories.UserRepository;
import com.aiupskillingplatform.services.auth.AuthService;
import com.aiupskillingplatform.services.auth.JwtService;

import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import org.springframework.web.server.ResponseStatusException;

import java.time.Instant;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;
    private final JwtService jwtService;
    private final UserRepository userRepository;

    public AuthController(
            AuthService authService,
            JwtService jwtService,
            UserRepository userRepository
    ) {
        this.authService = authService;
        this.jwtService = jwtService;
        this.userRepository = userRepository;
    }

    @PostMapping("/register")
    public ResponseEntity<UserResponse> register(
            @Valid @RequestBody RegisterRequest request
    ) {
        UserResponse response = authService.register(request);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(
            @Valid @RequestBody LoginRequest request
    ) {
        AuthResponse response = authService.login(request);

        return ResponseEntity.ok(response);
    }

    @PostMapping("/oauth2/exchange")
    public ResponseEntity<AuthResponse> exchangeGitHubCode(
            @RequestBody Map<String, String> request,
            HttpSession session
    ) {
        String code = request.get("code");

        String storedCode = (String) session.getAttribute(
                "GITHUB_OAUTH2_EXCHANGE_CODE"
        );

        String accessToken = (String) session.getAttribute(
                "GITHUB_OAUTH2_ACCESS_TOKEN"
        );

        Long expiry = (Long) session.getAttribute(
                "GITHUB_OAUTH2_EXCHANGE_EXPIRY"
        );

        if (code == null || storedCode == null
                || !storedCode.equals(code)) {
            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED,
                    "Invalid authorization code"
            );
        }

        if (expiry == null || Instant.now().toEpochMilli() > expiry) {
            session.removeAttribute("GITHUB_OAUTH2_EXCHANGE_CODE");
            session.removeAttribute("GITHUB_OAUTH2_ACCESS_TOKEN");
            session.removeAttribute("GITHUB_OAUTH2_EXCHANGE_EXPIRY");

            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED,
                    "Authorization code has expired"
            );
        }

        if (accessToken == null) {
            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED,
                    "Authorization session is invalid"
            );
        }

        session.removeAttribute("GITHUB_OAUTH2_EXCHANGE_CODE");
        session.removeAttribute("GITHUB_OAUTH2_ACCESS_TOKEN");
        session.removeAttribute("GITHUB_OAUTH2_EXCHANGE_EXPIRY");

        String email = jwtService.extractUsername(accessToken);

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.UNAUTHORIZED,
                        "User account not found"
                ));

        UserResponse userResponse = new UserResponse(
                user.getId(),
                user.getEmail(),
                user.getFullName(),
                user.getUsername(),
                user.getRole()
        );

        AuthResponse response = new AuthResponse(
                accessToken,
                "Bearer",
                userResponse
        );

        return ResponseEntity.ok(response);
    }
}
