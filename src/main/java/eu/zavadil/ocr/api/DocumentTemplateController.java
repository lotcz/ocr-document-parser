package eu.zavadil.ocr.api;

import eu.zavadil.ocr.api.exceptions.ResourceNotFoundException;
import eu.zavadil.ocr.data.template.DocumentTemplate;
import eu.zavadil.ocr.data.template.DocumentTemplateRepository;
import eu.zavadil.ocr.data.template.DocumentTemplateStub;
import eu.zavadil.ocr.data.template.DocumentTemplateStubRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("${api.base-url}/document-templates")
@Tag(name = "Document Templates")
@Slf4j
public class DocumentTemplateController {

	@Autowired
	DocumentTemplateRepository documentTemplateRepository;

	@Autowired
	DocumentTemplateStubRepository documentTemplateStubRepository;

	@GetMapping("")
	@Operation(summary = "Load paged document templates.")
	public JsonPage<DocumentTemplateStub> pagedDocumentTemplates(
		@RequestParam(defaultValue = "0") int page,
		@RequestParam(defaultValue = "10") int size
	) {
		return JsonPage.of(
			this.documentTemplateStubRepository.findAll(PageRequest.of(page, size))
		);
	}

	@GetMapping("/{id}")
	@Operation(summary = "Load a single document template.")
	public DocumentTemplate loadDocumentTemplate(
		@PathVariable int id
	) {
		return this.documentTemplateRepository.findById(id)
			.orElseThrow(() -> new ResourceNotFoundException("Document Template", String.valueOf(id)));
	}

}
