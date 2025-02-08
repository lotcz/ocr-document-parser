package eu.zavadil.ocr.api;

import eu.zavadil.ocr.api.exceptions.BadRequestException;
import eu.zavadil.ocr.api.exceptions.ResourceNotFoundException;
import eu.zavadil.ocr.data.EntityBase;
import eu.zavadil.ocr.data.documentTemplate.DocumentTemplateRepository;
import eu.zavadil.ocr.data.documentTemplate.DocumentTemplateStub;
import eu.zavadil.ocr.data.documentTemplate.DocumentTemplateStubRepository;
import eu.zavadil.ocr.data.fragmentTemplate.FragmentTemplateStub;
import eu.zavadil.ocr.data.fragmentTemplate.FragmentTemplateStubRepository;
import eu.zavadil.ocr.service.DocumentTemplateService;
import eu.zavadil.ocr.service.ImageService;
import eu.zavadil.ocr.storage.ImageFile;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Objects;

@RestController
@RequestMapping("${api.base-url}/document-templates")
@Tag(name = "Document Templates")
@Slf4j
public class DocumentTemplateController {

	@Autowired
	ImageService imageService;

	@Autowired
	DocumentTemplateService documentTemplateService;

	@Autowired
	DocumentTemplateRepository documentTemplateRepository;

	@Autowired
	DocumentTemplateStubRepository documentTemplateStubRepository;

	@Autowired
	FragmentTemplateStubRepository fragmentTemplateStubRepository;

	@GetMapping("")
	@Operation(summary = "Load paged document templates.")
	public JsonPage<DocumentTemplateStub> pagedDocumentTemplates(
		@RequestParam(defaultValue = "0") int page,
		@RequestParam(defaultValue = "10") int size,
		@RequestParam(defaultValue = "") String search,
		@RequestParam(defaultValue = "") String sorting
	) {
		return JsonPage.of(
			this.documentTemplateStubRepository.findAll(PagingUtils.of(page, size, sorting))
		);
	}

	@PostMapping("")
	@Operation(summary = "Create new document template.")
	public DocumentTemplateStub insertTemplate(@RequestBody DocumentTemplateStub documentTemplate) {
		documentTemplate.setId(null);
		return this.documentTemplateStubRepository.save(documentTemplate);
	}

	@GetMapping("/{id}")
	@Operation(summary = "Load a single document template.")
	public DocumentTemplateStub loadDocumentTemplate(@PathVariable int id) {
		return this.documentTemplateStubRepository.findById(id)
			.orElseThrow(() -> new ResourceNotFoundException("Document Template", String.valueOf(id)));
	}

	@PutMapping("{id}")
	@Operation(summary = "Update document template.")
	public DocumentTemplateStub updateTemplate(
		@PathVariable int id,
		@RequestBody DocumentTemplateStub documentTemplate
	) {
		documentTemplate.setId(id);
		DocumentTemplateStub result = this.documentTemplateStubRepository.save(documentTemplate);
		this.documentTemplateService.reset(result.getId());
		return result;
	}

	@DeleteMapping("{id}")
	@Operation(summary = "Delete document template.")
	public void deleteTemplate(@PathVariable int id) {
		this.documentTemplateRepository.deleteById(id);
		this.documentTemplateService.reset(id);
	}

	@PostMapping("{id}/preview-img")
	@Operation(summary = "Upload preview image.")
	public String uploadPreviewImage(
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
		return newPreview.toString();
	}

	@GetMapping("/{id}/fragments")
	@Operation(summary = "Load fragment templates from document template.")
	public List<FragmentTemplateStub> loadDocumentTemplateFragments(@PathVariable int id) {
		return this.fragmentTemplateStubRepository.findAllByDocumentTemplateId(id);
	}

	@Transactional
	@PutMapping("/{id}/fragments")
	@Operation(summary = "Save fragment templates under document template. All other will be deleted.")
	public List<FragmentTemplateStub> saveDocumentTemplateFragments(@PathVariable int id, @RequestBody List<FragmentTemplateStub> templates) {
		this.fragmentTemplateStubRepository.deleteNotIn(id, templates.stream().map(EntityBase::getId).filter(Objects::nonNull).toList());
		for (FragmentTemplateStub template : templates) {
			template.setDocumentTemplateId(id);
		}
		List<FragmentTemplateStub> result = this.fragmentTemplateStubRepository.saveAll(templates);
		this.documentTemplateService.reset(id);
		return result;
	}

}
