package eu.zavadil.ocr.config;

import lombok.Getter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.access.intercept.AuthorizationFilter;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

	@Value("${api.base-url}")
	@Getter
	private String apiBaseUrl;

	@Autowired
	AuthenticationFilter authenticationFilter;

	/**
	 * Allow all cross-origin requests.
	 *
	 * @return
	 */
	@Bean
	public WebMvcConfigurer corsConfigurer() {
		return new WebMvcConfigurer() {
			@Override
			public void addCorsMappings(CorsRegistry registry) {
				registry
					.addMapping("/**")
					.allowedOrigins("http://localhost:3000")
					.allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS");
			}
		};
	}

	/**
	 * Everything under /api/admin must be protected, everything else is permitted
	 *
	 * @param http
	 * @return
	 * @throws Exception
	 */
	@Bean
	public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
		http
			.cors(c -> {
			})
			.csrf(c -> {
				c.disable();
			})
			.securityMatcher(
				String.format("/%s/**", this.apiBaseUrl)
			)
			.addFilterBefore(this.authenticationFilter, AuthorizationFilter.class)
			.authorizeHttpRequests(
				(auth) ->
					auth
						.requestMatchers(
							String.format("/%s/admin/**", this.apiBaseUrl)
						)
						.authenticated()
						.requestMatchers("/**")
						.permitAll()
			);
		return http.build();
	}

}
