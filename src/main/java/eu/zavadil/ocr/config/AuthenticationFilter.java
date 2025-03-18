package eu.zavadil.ocr.config;

import eu.zavadil.java.oauth.common.JwtEncoder;
import eu.zavadil.java.oauth.common.token.JwtAccessToken;
import eu.zavadil.java.util.StringUtils;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.ServletRequest;
import jakarta.servlet.ServletResponse;
import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.GenericFilterBean;

import java.io.IOException;

@Component
@Slf4j
public class AuthenticationFilter extends GenericFilterBean {

	@Value("${api.auth-header-name}")
	private String authHeaderName;

	@Value("${oauth.self-name}")
	private String selfName;

	@Value("${eu.zavadil.ocr.oauth-url}")
	String oAuthUrl;

	@Autowired
	JwtEncoder jwtEncoder;

	public Authentication getAuthentication(HttpServletRequest request) {
		String header = request.getHeader(this.authHeaderName);
		if (StringUtils.isBlank(header) || !StringUtils.safeStartsWith(header, "Bearer ")) {
			log.trace("Header does not contain Authorize with Bearer!");
			return new NoAuthentication();
		}
		try {
			String tokenRaw = StringUtils.safeSubstr(header, 7, header.length() - 7);
			JwtAccessToken token = jwtEncoder.verifyAndDecodeToken(tokenRaw, JwtAccessToken.class);
			if (!StringUtils.safeEquals(this.selfName, token.getAudience())) {
				log.trace("Audience mismatch! Required: {}, Provided: {}", this.selfName, token.getAudience());
				throw new RuntimeException("Invalid audience!");
			}
			if (!StringUtils.safeEquals(this.oAuthUrl, token.getIssuer())) {
				log.trace("Issuer mismatch! Required: {}, Provided: {}", this.oAuthUrl, token.getIssuer());
				throw new RuntimeException("Invalid issuer!");
			}
			if (!token.getScopes().contains("admin:*")) {
				throw new RuntimeException("Token does not contain required privilege!");
			}
			return new OAuthAccessTokenAuthentication(token);
		} catch (Exception e) {
			log.warn("Authentication failed", e);
			return new NoAuthentication();
		}
	}

	@Override
	public void doFilter(ServletRequest request, ServletResponse response, FilterChain filterChain)
		throws IOException, ServletException {

		Authentication authentication = this.getAuthentication((HttpServletRequest) request);
		SecurityContextHolder.getContext().setAuthentication(authentication);

		filterChain.doFilter(request, response);
	}
}
