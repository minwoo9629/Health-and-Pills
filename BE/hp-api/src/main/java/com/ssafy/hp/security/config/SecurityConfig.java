package com.ssafy.hp.security.config;

import com.ssafy.hp.security.filter.JwtAuthenticationFilter;
import com.ssafy.hp.security.handler.*;
import com.ssafy.hp.security.service.*;
import com.ssafy.hp.user.service.*;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.builders.WebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@Configuration
@RequiredArgsConstructor
public class SecurityConfig extends WebSecurityConfigurerAdapter {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;
    private final CustomAccessDeniedHandler accessDeniedHandler;
    private final CustomAuthenticationEntryPoint authenticationEntryPoint;
    private final OAuth2UserService oAuth2UserService;
    private final OAuthAuthenticationSuccessHandler oAuthAuthenticationSuccessHandler;

    @Override
    public void configure(WebSecurity web) throws Exception {
        web.ignoring().antMatchers(
                "/h2-console/**", "/docs/**");
    }

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http
                .httpBasic().disable()
                .cors().configurationSource(corsConfigurationSource())
                .and()
                .csrf().disable()
                .sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                .and()
                .authorizeRequests()
                .antMatchers("/ws-stomp/**", "/api/port", "/actuator/health", "/oauth2/**").permitAll()
                .antMatchers(HttpMethod.POST, "/api/users", "/api/users/login").permitAll()
                .anyRequest().hasAnyRole("USER", "ADMIN")
                .and()
                .exceptionHandling()
                .authenticationEntryPoint(authenticationEntryPoint)
                .accessDeniedHandler(accessDeniedHandler)
                .and()
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class)
                // OAuth 로그인 설정
                .oauth2Login()
                .userInfoEndpoint()
                .userService(oAuth2UserService)
                .and()
                .successHandler(oAuthAuthenticationSuccessHandler)
                .failureHandler(
                        (request, response, exception) -> {
                            System.out.println("fail");
                        }
                );
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();

        configuration.addAllowedOriginPattern("*");
        configuration.addAllowedHeader("*");
        configuration.addAllowedMethod("*");
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}