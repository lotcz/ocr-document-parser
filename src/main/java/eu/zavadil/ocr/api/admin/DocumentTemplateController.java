package eu.zavadil.ocr.api.admin;

import eu.zavadil.java.spring.common.paging.JsonPage;
import eu.zavadil.java.spring.common.paging.JsonPageImpl;
import eu.zavadil.java.spring.common.paging.PagingUtils;
import eu.zavadil.ocr.api.exceptions.BadRequestException;
import eu.zavadil.ocr.api.exceptions.ResourceNotFoundException;
import eu.zavadil.ocr.data.template.documentTemplate.DocumentTemplateStubWithPages;
import eu.zavadil.ocr.data.template.pageTemplate.PageTemplateStubWithFragments;
import eu.zavadil.ocr.service.DocumentTemplateService;
import eu.zavadil.ocr.service.ImageService;
import eu.zavadil.ocr.storage.ImageFile;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("${api.base-url}/admin/document-templates")
@Tag(name = "Document Templates")
@Slf4j
public class DocumentTemplateController {

	@Autowired
	ImageService imageService;

	@Autowired
	DocumentTemplateService documentTemplateService;

	@GetMapping("all")
	@Operation(summary = "Load all document templates.")
	public List<DocumentTemplateStubWithPages> allDocumentTemplates() {
		return this.documentTemplateService.getAllStubs();
	}

	@GetMapping("")
	@Operation(summary = "Load paged document templates.")
	public JsonPage<DocumentTemplateStubWithPages> pagedDocumentTemplates(
		@RequestParam(defaultValue = "0") int page,
		@RequestParam(defaultValue = "10") int size,
		@RequestParam(defaultValue = "") String search,
		@RequestParam(defaultValue = "") String sorting
	) {
		return JsonPageImpl.of(
			this.documentTemplateService.getAllStubsPaged(PagingUtils.of(page, size, sorting))
		);
	}

	@PostMapping("")
	@Operation(summary = "Create new document template.")
	public DocumentTemplateStubWithPages insertTemplate(@RequestBody DocumentTemplateStubWithPages documentTemplate) {
		documentTemplate.setId(null);
		return this.documentTemplateService.save(documentTemplate);
	}

	@GetMapping("/{id}")
	@Operation(summary = "Load a single document template.")
	public DocumentTemplateStubWithPages loadDocumentTemplate(@PathVariable int id) {
		DocumentTemplateStubWithPages d = this.documentTemplateService.getStubById(id);
		if (d == null) throw new ResourceNotFoundException("Document Template", id);
		return d;
	}

	@PutMapping("{id}")
	@Operation(summary = "Update document template.")
	public DocumentTemplateStubWithPages updateTemplate(
		@PathVariable int id,
		@RequestBody DocumentTemplateStubWithPages documentTemplate
	) {
		documentTemplate.setId(id);
		return this.documentTemplateService.save(documentTemplate);
	}

	@DeleteMapping("{id}")
	@Operation(summary = "Delete document template.")
	public void deleteTemplate(@PathVariable int id) {
		this.documentTemplateService.deleteById(id);
	}

	@PostMapping("{id}/preview-img")
	@Operation(summary = "Upload preview image.")
	public DocumentTemplateStubWithPages uploadPreviewImage(
		@PathVariable int id,
		@RequestParam("file") MultipartFile file
	) {
		DocumentTemplateStubWithPages dt = this.documentTemplateService.getStubById(id);
		if (dt == null) throw new ResourceNotFoundException("Document Template", id);

		ImageFile oldPreview = this.imageService.getImage(dt.getPreviewImg());
		ImageFile newPreview = this.imageService.upload(this.imageService.getDirectory(dt), file);
		if (newPreview == null || !newPreview.exists()) {
			throw new BadRequestException("No images could be uploaded!");
		}
		dt.setPreviewImg(newPreview.toString());

		List<ImageFile> pageImages = this.imageService.extractPages(newPreview);
		for (int i = 0, max = pageImages.size(); i < max; i++) {
			ImageFile pageImage = pageImages.get(i);
			int pi = i;
			PageTemplateStubWithFragments page = dt.getPages().stream().filter(p -> p.getPageNumber() == pi).findFirst().orElse(null);
			if (page == null) {
				page = new PageTemplateStubWithFragments();
				page.setDocumentTemplateId(dt.getId());
				page.setPageNumber(pi);
				dt.getPages().add(page);
			} else {
				this.imageService.delete(page.getPreviewImg());
			}
			page.setPreviewImg(pageImage.toString());
		}

		dt = this.documentTemplateService.save(dt);

		if (oldPreview.exists() && !oldPreview.equals(newPreview)) {
			this.imageService.delete(oldPreview);
		}
		return dt;
	}

}
