package eu.zavadil.ocr.api;

import eu.zavadil.ocr.api.exceptions.BadRequestException;
import eu.zavadil.ocr.api.exceptions.ResourceNotFoundException;
import eu.zavadil.ocr.data.documentTemplate.DocumentTemplate;
import eu.zavadil.ocr.data.documentTemplate.DocumentTemplateRepository;
import eu.zavadil.ocr.data.documentTemplate.DocumentTemplateStub;
import eu.zavadil.ocr.data.documentTemplate.DocumentTemplateStubRepository;
import eu.zavadil.ocr.service.ImageService;
import eu.zavadil.ocr.storage.ImageFile;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("${api.base-url}/document-templates")
@Tag(name = "Document Templates")
@Slf4j
public class DocumentTemplateController {

	@Autowired
	ImageService imageService;

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

	@PostMapping("")
	@Operation(summary = "Create new document template.")
	public DocumentTemplate insertTemplate(@RequestBody DocumentTemplate documentTemplate) {
		documentTemplate.setId(null);
		return this.documentTemplateRepository.save(documentTemplate);
	}

	@GetMapping("/{id}")
	@Operation(summary = "Load a single document template.")
	public DocumentTemplate loadDocumentTemplate(@PathVariable int id) {
		return this.documentTemplateRepository.findById(id)
			.orElseThrow(() -> new ResourceNotFoundException("Document Template", String.valueOf(id)));
	}

	@PutMapping("{id}")
	@Operation(summary = "Update document template.")
	public DocumentTemplate updateTemplate(
		@PathVariable int id,
		@RequestBody DocumentTemplate documentTemplate
	) {
		documentTemplate.setId(id);
		return this.documentTemplateRepository.save(documentTemplate);
	}

	@DeleteMapping("{id}")
	@Operation(summary = "Delete document template.")
	public void deleteTemplate(@PathVariable int id) {
		this.documentTemplateRepository.deleteById(id);
	}

	@PostMapping("{id}/preview-img")
	@Operation(summary = "Upload preview image.")
	public void uploadPreviewImage(
		@PathVariable int id,
		@RequestParam("file") MultipartFile file
	) {
		DocumentTemplateStub dt = this.documentTemplateStubRepository.findById(id)
			.orElseThrow(
				() -> new ResourceNotFoundException("Document Template", String.valueOf(id))
			);
		ImageFile oldPreview = this.imageService.getImage(dt.getPreviewImg());
		List<ImageFile> uploaded = this.imageService.upload(String.format("templates/%d", id), file);
		if (uploaded.isEmpty()) {
			throw new BadRequestException("No images could be decoded!");
		}
		ImageFile newPreview = uploaded.get(0);
		if (uploaded.size() > 1) {
			log.info("Uploaded PDF document has {} pages. Using the first one as preview.", uploaded.size());
			for (int i = 1; i < uploaded.size(); i++) {
				uploaded.get(i).delete();
			}
		}
		dt.setPreviewImg(newPreview.toString());
		this.documentTemplateStubRepository.save(dt);
		if (oldPreview.exists() && !oldPreview.equals(newPreview)) {
			this.imageService.delete(oldPreview);
		}
	}


}
