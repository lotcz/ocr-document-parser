package eu.zavadil.ocr.api;

import eu.zavadil.ocr.data.template.DocumentTemplate;
import eu.zavadil.ocr.data.template.DocumentTemplateRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("${api.base-url}/document-templates")
@Tag(name = "Document Templates")
@Slf4j
public class DocumentTemplateController {

	@Autowired
	DocumentTemplateRepository documentTemplateRepository;

	@GetMapping("")
	@Operation(summary = "Load paged document templates.")
	public Page<DocumentTemplate> pagedDocumentTemplates(
		@RequestParam(defaultValue = "0") int page,
		@RequestParam(defaultValue = "10") int size
	) {
		return this.documentTemplateRepository.findAll(PageRequest.of(page, size));
	}

	@GetMapping("/{id}")
	@Operation(summary = "Load a single document template.")
	public DocumentTemplate loadDocumentTemplate(
		@PathVariable int id
	) {
		return this.documentTemplateRepository.findById(id).orElseThrow();
	}

}
