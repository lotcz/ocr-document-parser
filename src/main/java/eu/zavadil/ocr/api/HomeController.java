package eu.zavadil.ocr.api;

import eu.zavadil.ocr.api.exceptions.ResourceNotFoundException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import java.io.InputStream;

@RestController
@Slf4j
public class HomeController {

	@RequestMapping(value = {"/templates/**", "/documents/**"})
	public @ResponseBody ResponseEntity<InputStreamResource> allButApi() {
		InputStream is = HomeController.class.getResourceAsStream("/public/index.html");
		if (is == null) throw new ResourceNotFoundException("index.html");
		return ResponseEntity.ok()
			.contentType(MediaType.TEXT_HTML)
			.body(new InputStreamResource(is));
	}

}
