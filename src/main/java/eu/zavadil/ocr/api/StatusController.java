package eu.zavadil.ocr.api;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.extern.slf4j.Slf4j;
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

	@GetMapping("version")
	@Operation(summary = "App version.")
	public String version() {
		return this.version;
	}

}
