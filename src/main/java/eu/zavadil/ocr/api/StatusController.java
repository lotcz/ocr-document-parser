package eu.zavadil.ocr.api;

import eu.zavadil.java.oauth.common.payload.ServerOAuthInfoPayload;
import eu.zavadil.ocr.stats.OkarinaStats;
import eu.zavadil.ocr.stats.StatsService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("${api.base-url}/status")
@Tag(name = "Status")
@Slf4j
public class StatusController {

	@Value("${app.version}")
	String version;

	@Value("${spring.application.name}")
	String appName;

	@Value("${eu.zavadil.ocr.oauth-url}")
	String oauthUrl;

	@Autowired
	StatsService statsService;

	@GetMapping("version")
	@Operation(summary = "App version.")
	public String version() {
		return this.version;
	}

	@GetMapping("stats")
	@Operation(summary = "App stats.")
	public OkarinaStats stats() {
		return this.statsService.getStats();
	}

	@GetMapping("/oauth/info")
	@Operation(summary = "Get server oauth info.")
	public ServerOAuthInfoPayload info() {
		return new ServerOAuthInfoPayload(
			this.oauthUrl,
			this.appName,
			this.version()
		);
	}

}
