package com.aiupskillingplatform.services.auth;

import com.aiupskillingplatform.entities.User;
import com.aiupskillingplatform.enums.Role;
import com.aiupskillingplatform.enums.UserStatus;
import com.aiupskillingplatform.repositories.UserRepository;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.OAuth2Error;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.util.List;
import java.util.Map;

@Service
public class GitHubOAuth2UserService extends DefaultOAuth2UserService {

    private final UserRepository userRepository;
    private final RestClient restClient;

    public GitHubOAuth2UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
        this.restClient = RestClient.create();
    }

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest)
            throws OAuth2AuthenticationException {

        OAuth2User githubUser = super.loadUser(userRequest);

        Map<String, Object> attributes = githubUser.getAttributes();

        Object githubIdValue = attributes.get("id");
        String githubUsername = (String) attributes.get("login");

        if (githubIdValue == null || githubUsername == null) {
            throw new OAuth2AuthenticationException(
                    new OAuth2Error("invalid_github_profile"),
                    "GitHub profile is missing required information."
            );
        }

        String githubId = String.valueOf(githubIdValue);

        String email = fetchVerifiedEmail(userRequest);

        User user = userRepository.findByGithubId(githubId)
                .orElseGet(() -> createUser(
                        githubId,
                        githubUsername,
                        email,
                        attributes
                ));

        if (user.getStatus() != UserStatus.ACTIVE) {
            throw new OAuth2AuthenticationException(
                    new OAuth2Error("account_not_active"),
                    "This account is not active."
            );
        }

        return githubUser;
    }

    private String fetchVerifiedEmail(OAuth2UserRequest userRequest) {

        List<Map<String, Object>> emails = restClient.get()
                .uri("https://api.github.com/user/emails")
                .headers(headers -> headers.setBearerAuth(
                        userRequest.getAccessToken().getTokenValue()
                ))
                .retrieve()
                .body(new ParameterizedTypeReference<>() {});

        if (emails != null) {
            for (Map<String, Object> emailData : emails) {
                if (Boolean.TRUE.equals(emailData.get("primary"))
                        && Boolean.TRUE.equals(emailData.get("verified"))) {

                    return ((String) emailData.get("email")).toLowerCase();
                }
            }
        }

        throw new OAuth2AuthenticationException(
                new OAuth2Error("verified_email_not_found"),
                "A primary verified GitHub email is required."
        );
    }

    private User createUser(
            String githubId,
            String githubUsername,
            String email,
            Map<String, Object> attributes
    ) {

        if (userRepository.existsByEmail(email)) {
            throw new OAuth2AuthenticationException(
                    new OAuth2Error("email_already_registered"),
                    "An account with this email already exists. Please log in using your existing account."
            );
        }

        User user = new User();

        user.setGithubId(githubId);
        user.setEmail(email);
        user.setPasswordHash(null);

        String fullName = (String) attributes.get("name");
        user.setFullName(
                fullName != null && !fullName.isBlank()
                        ? fullName
                        : githubUsername
        );

        if (!userRepository.existsByUsername(githubUsername)) {
            user.setUsername(githubUsername);
        }

        user.setProfilePictureUrl((String) attributes.get("avatar_url"));
        user.setEmailVerified(true);
        user.setRole(Role.USER);
        user.setStatus(UserStatus.ACTIVE);

        return userRepository.save(user);
    }
}