
package com.aiupskillingplatform.services.auth;

import com.aiupskillingplatform.entities.User;
import com.aiupskillingplatform.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

import java.io.IOException;
import java.time.Instant;
import java.util.UUID;

@Component
public class GitHubOAuth2SuccessHandler implements AuthenticationSuccessHandler {

    private final JwtService jwtService;
    private final UserRepository userRepository;
    private final String frontendRedirectUri;

    public GitHubOAuth2SuccessHandler(
            JwtService jwtService,
            UserRepository userRepository,
            @Value("${app.oauth2.redirect-uri:http://localhost:5173/oauth2/callback}")
            String frontendRedirectUri
    ) {
        this.jwtService = jwtService;
        this.userRepository = userRepository;
        this.frontendRedirectUri = frontendRedirectUri;
    }

    @Override
    public void onAuthenticationSuccess(
            HttpServletRequest request,
            HttpServletResponse response,
            Authentication authentication
    ) throws IOException, ServletException {

        OAuth2User oauth2User = (OAuth2User) authentication.getPrincipal();

        Object githubIdValue = oauth2User.getAttribute("id");
        String githubId = String.valueOf(githubIdValue);

        com.aiupskillingplatform.entities.User appUser =
                userRepository.findByGithubId(githubId)
                        .orElseThrow(() -> new IllegalStateException(
                                "GitHub user account not found."
                        ));

        UserDetails userDetails = org.springframework.security.core.userdetails.User
                .withUsername(appUser.getEmail())
                .password("")
                .roles(appUser.getRole().name())
                .build();

        String accessToken = jwtService.generateAccessToken(userDetails);

        String exchangeCode = UUID.randomUUID().toString();

        HttpSession session = request.getSession(true);

        session.setAttribute("GITHUB_OAUTH2_EXCHANGE_CODE", exchangeCode);
        session.setAttribute("GITHUB_OAUTH2_ACCESS_TOKEN", accessToken);
        session.setAttribute(
                "GITHUB_OAUTH2_EXCHANGE_EXPIRY",
                Instant.now().plusSeconds(120).toEpochMilli()
        );

        String redirectUrl = frontendRedirectUri
                + (frontendRedirectUri.contains("?") ? "&" : "?")
                + "code=" + exchangeCode;

        response.sendRedirect(redirectUrl);
    }
}
