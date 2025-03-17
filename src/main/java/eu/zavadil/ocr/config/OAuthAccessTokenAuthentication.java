package eu.zavadil.ocr.config;

import eu.zavadil.java.oauth.common.token.JwtAccessToken;
import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.security.core.authority.AuthorityUtils;

public class OAuthAccessTokenAuthentication extends AbstractAuthenticationToken {

	private final JwtAccessToken token;

	public OAuthAccessTokenAuthentication(JwtAccessToken token) {
		super(AuthorityUtils.NO_AUTHORITIES);
		this.token = token;
		setAuthenticated(true);
	}

	@Override
	public Object getCredentials() {
		return null;
	}

	@Override
	public Object getPrincipal() {
		return this.token;
	}
}
