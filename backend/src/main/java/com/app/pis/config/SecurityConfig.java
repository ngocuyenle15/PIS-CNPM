package com.app.pis.config;

import com.app.pis.dto.ApiResponse;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(AbstractHttpConfigurer::disable)
            .cors(cors -> {})
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .exceptionHandling(exceptions -> exceptions
                .authenticationEntryPoint((request, response, authException) -> {
                    response.setStatus(HttpStatus.UNAUTHORIZED.value());
                    response.setContentType(MediaType.APPLICATION_JSON_VALUE);
                    response.setCharacterEncoding("UTF-8");
                    ApiResponse<Void> apiResponse = ApiResponse.error(
                            HttpStatus.UNAUTHORIZED.value(), 
                            "Yêu cầu đăng nhập hoặc token không hợp lệ: " + authException.getMessage()
                    );
                    new ObjectMapper().writeValue(response.getOutputStream(), apiResponse);
                })
                .accessDeniedHandler((request, response, accessDeniedException) -> {
                    response.setStatus(HttpStatus.FORBIDDEN.value());
                    response.setContentType(MediaType.APPLICATION_JSON_VALUE);
                    response.setCharacterEncoding("UTF-8");
                    ApiResponse<Void> apiResponse = ApiResponse.error(
                            HttpStatus.FORBIDDEN.value(), 
                            "Bạn không có quyền truy cập tài nguyên này (Yêu cầu quyền Admin)"
                    );
                    new ObjectMapper().writeValue(response.getOutputStream(), apiResponse);
                })
            )
            .authorizeHttpRequests(authorize -> authorize
                .requestMatchers("/api/auth/login/", "/api/auth/refresh/", "/api/auth/forgot-password/", "/api/auth/change-password/").permitAll()
                .requestMatchers("/api/auth/admin/reset-password/").hasRole("Admin")
                .requestMatchers("/api/auth/logout/", "/api/auth/me/").authenticated()
                .requestMatchers("/api/employees/**", "/api/accounts/**").hasRole("Admin")
                .requestMatchers(HttpMethod.GET, "/api/units/**", "/api/catalogs/**", "/api/origins/**", "/api/medicines/**", "/api/suppliers/**").authenticated()
                .requestMatchers(HttpMethod.POST, "/api/units/**", "/api/catalogs/**", "/api/origins/**", "/api/medicines/**", "/api/suppliers/**").hasAnyRole("Admin", "Product_manager")
                .requestMatchers(HttpMethod.PATCH, "/api/units/**", "/api/catalogs/**", "/api/origins/**", "/api/medicines/**", "/api/suppliers/**").hasAnyRole("Admin", "Product_manager")
                .requestMatchers(HttpMethod.DELETE, "/api/units/**", "/api/catalogs/**", "/api/origins/**", "/api/medicines/**", "/api/suppliers/**").hasAnyRole("Admin", "Product_manager")
                .requestMatchers(HttpMethod.GET, "/api/customers/**").authenticated()
                .requestMatchers(HttpMethod.POST, "/api/customers/**").hasAnyRole("Admin", "Sales")
                .requestMatchers(HttpMethod.PATCH, "/api/customers/**").hasAnyRole("Admin", "Sales")
                .requestMatchers(HttpMethod.DELETE, "/api/customers/**").hasRole("Admin")
                .requestMatchers(HttpMethod.GET, "/api/goods-receipts/**", "/api/goods-issues/**", "/api/stock-audits/**", "/api/inventory/**").authenticated()
                .requestMatchers(HttpMethod.POST, "/api/goods-receipts/**", "/api/goods-issues/**", "/api/stock-audits/**", "/api/inventory/**").hasAnyRole("Admin", "Product_manager")
                .requestMatchers(HttpMethod.PATCH, "/api/goods-receipts/**", "/api/goods-issues/**", "/api/stock-audits/**", "/api/inventory/**").hasAnyRole("Admin", "Product_manager")
                .requestMatchers(HttpMethod.DELETE, "/api/goods-receipts/**", "/api/goods-issues/**", "/api/stock-audits/**", "/api/inventory/**").hasAnyRole("Admin", "Product_manager")
                .requestMatchers(HttpMethod.GET, "/api/invoices/**").authenticated()
                .requestMatchers(HttpMethod.POST, "/api/invoices/**").hasAnyRole("Admin", "Sales")
                .requestMatchers(HttpMethod.PATCH, "/api/invoices/**").hasRole("Admin")
                .requestMatchers(HttpMethod.DELETE, "/api/invoices/**").hasRole("Admin")
                .anyRequest().authenticated()
            )
            .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}
