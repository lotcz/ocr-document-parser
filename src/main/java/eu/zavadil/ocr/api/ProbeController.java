package eu.zavadil.ocr.api;

import eu.zavadil.ocr.core.probe.ProbeResults;
import eu.zavadil.ocr.core.probe.ProbeRunner;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("${api.base-url}")
@Tag(name = "Asynchronous Callbacks")
@Slf4j
public class ProbeController {

	@Autowired
	ProbeRunner probeRunner;

	@GetMapping("/probe")
	@Operation(summary = "Run probe on embedded test images.")
	public String runAllProbes() {
		log.info("Probing...");
		ProbeResults results = this.probeRunner.runProbes();
		return results.toString();
	}

}
