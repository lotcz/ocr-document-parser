package eu.zavadil.ocr.config.security;

import eu.zavadil.java.oauth.common.token.JwtAccessToken;
import eu.zavadil.java.oauth.common.token.PermissionLevel;
import eu.zavadil.java.oauth.common.util.PermissionUtil;
import eu.zavadil.java.util.StringUtils;
import eu.zavadil.ocr.api.exceptions.BadRequestException;
import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import java.util.List;
import java.util.stream.Collectors;

public class OAuthAccessTokenAuthentication extends AbstractAuthenticationToken {

	private final JwtAccessToken token;

	public static SimpleGrantedAuthority extractAuthority(String scope) {
		String privilege = PermissionUtil.extractPrivilege(scope);
		if (!StringUtils.safeEquals(privilege, "*"))
			throw new BadRequestException("Only '*' privilege is allowed in Okarina!");
		PermissionLevel level = PermissionUtil.extractPermissionLevel(scope);
		return new SimpleGrantedAuthority("ROLE_" + level.name().toUpperCase());
	}

	public static List<GrantedAuthority> extractAuthorities(JwtAccessToken token) {
		return token.getScopes().stream()
			.map(OAuthAccessTokenAuthentication::extractAuthority)
			.collect(Collectors.toList());
	}

	public OAuthAccessTokenAuthentication(JwtAccessToken token) {
		super(OAuthAccessTokenAuthentication.extractAuthorities(token));
		this.token = token;
		this.setAuthenticated(true);
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
