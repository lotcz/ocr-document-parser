package eu.zavadil.ocr.api;

import eu.zavadil.ocr.core.probe.document.ProbeDocumentResult;
import eu.zavadil.ocr.core.probe.document.ProbeDocumentRunner;
import eu.zavadil.ocr.core.probe.fragment.ProbeFragmentResults;
import eu.zavadil.ocr.core.probe.fragment.ProbeFragmentsRunner;
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
	ProbeFragmentsRunner probeFragmentsRunner;

	@Autowired
	ProbeDocumentRunner probeDocumentRunner;

	@GetMapping("/probe/fragments")
	@Operation(summary = "Run probe on embedded test images.")
	public String runFragmentProbes() {
		log.info("Probing fragments...");
		ProbeFragmentResults results = this.probeFragmentsRunner.runProbes();
		return results.toString();
	}

	@GetMapping("/probe/document")
	@Operation(summary = "Run probe on embedded document image.")
	public String runDocumentProbe() {
		log.info("Probing document...");
		ProbeDocumentResult result = this.probeDocumentRunner.runProbe();
		return result.toString();
	}

}
