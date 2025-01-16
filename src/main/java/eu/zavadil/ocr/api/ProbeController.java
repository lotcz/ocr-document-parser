package eu.zavadil.ocr.api;

import eu.zavadil.ocr.probe.document.ProbeDocumentResult;
import eu.zavadil.ocr.probe.document.ProbeDocumentRunner;
import eu.zavadil.ocr.probe.fragment.ProbeFragmentResults;
import eu.zavadil.ocr.probe.fragment.ProbeFragmentsRunner;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("${api.base-url}/probe")
@Tag(name = "Probes")
@Slf4j
public class ProbeController {

	@Autowired
	ProbeFragmentsRunner probeFragmentsRunner;

	@Autowired
	ProbeDocumentRunner probeDocumentRunner;

	@GetMapping("fragments")
	@Operation(summary = "Run probe on embedded test images.")
	public ProbeFragmentResults runFragmentProbes() {
		log.info("Probing fragments...");
		return this.probeFragmentsRunner.runProbes();
	}

	@GetMapping("document")
	@Operation(summary = "Run probe on embedded document image.")
	public ProbeDocumentResult runDocumentProbe() {
		log.info("Probing document...");
		return this.probeDocumentRunner.runProbe();
	}

}
