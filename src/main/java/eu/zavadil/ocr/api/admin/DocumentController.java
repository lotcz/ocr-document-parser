package eu.zavadil.ocr.api.admin;

import eu.zavadil.ocr.api.exceptions.BadRequestException;
import eu.zavadil.ocr.api.exceptions.ResourceNotFoundException;
import eu.zavadil.ocr.data.parsed.document.DocumentState;
import eu.zavadil.ocr.data.parsed.document.DocumentStubWithPages;
import eu.zavadil.ocr.data.parsed.folder.FolderChain;
import eu.zavadil.ocr.data.parsed.folder.FolderChainCache;
import eu.zavadil.ocr.service.DocumentService;
import eu.zavadil.ocr.service.ImageService;
import eu.zavadil.ocr.storage.ImageFile;
import eu.zavadil.ocr.storage.StorageDirectory;
import eu.zavadil.ocr.storage.StorageFile;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("${api.base-url}/admin/documents")
@Tag(name = "Documents")
@Slf4j
public class DocumentController {

	@Autowired
	ImageService imageService;

	@Autowired
	DocumentService documentService;

	@Autowired
	FolderChainCache folderChainService;

	@PostMapping("")
	@Operation(summary = "Insert new document.")
	public DocumentStubWithPages insertDocument(@RequestBody DocumentStubWithPages document) {
		document.setId(null);
		return this.documentService.save(document);
	}

	@GetMapping("{id}")
	@Operation(summary = "Load a single document.")
	public DocumentStubWithPages loadDocument(@PathVariable int id) {
		DocumentStubWithPages d = this.documentService.getById(id);
		if (d == null) throw new ResourceNotFoundException("Document", id);
		return d;
	}

	@PutMapping("{id}")
	@Operation(summary = "Update a document.")
	public DocumentStubWithPages updateDocument(@PathVariable int id, @RequestBody DocumentStubWithPages document) {
		document.setId(id);
		return this.documentService.save(document);
	}

	@DeleteMapping("{id}")
	@Operation(summary = "Delete a document.")
	public void deleteDocument(@PathVariable int id) {
		this.documentService.deleteById(id);
	}

	@PostMapping("{id}/upload-image")
	@Operation(summary = "Upload document image.")
	public DocumentStubWithPages uploadDocumentImage(
		@PathVariable int id,
		@RequestParam("file") MultipartFile file
	) {
		DocumentStubWithPages d = this.documentService.getById(id);
		if (d == null) throw new ResourceNotFoundException("Document", String.valueOf(id));

		FolderChain f = this.folderChainService.get(d.getFolderId());

		//UPLOAD
		ImageFile uploaded = this.imageService.upload(f, file);
		if (uploaded == null || !uploaded.exists()) {
			throw new BadRequestException("No images could be decoded!");
		}

		StorageDirectory uploadDir = this.imageService.getDirectory(f).createSubdirectory(d.getId().toString());
		StorageFile newImg = uploaded.moveTo(uploadDir);
		ImageFile oldImg = this.imageService.getImage(d.getImagePath());

		d.setImagePath(newImg.toString());
		d.setState(DocumentState.Waiting);
		d = this.documentService.deletePages(d);
		d = this.documentService.save(d);
		this.imageService.delete(oldImg);

		return d;
	}

	@PostMapping("upload-image/{folderId}")
	@Operation(summary = "Upload image file and create a new document(s).")
	public DocumentStubWithPages uploadFile(
		@PathVariable int folderId,
		@RequestParam("file") MultipartFile file
	) {
		FolderChain f = this.folderChainService.get(folderId);
		if (f == null) throw new ResourceNotFoundException("Folder", folderId);

		ImageFile uploaded = this.imageService.upload(f, file);
		if (uploaded == null || !uploaded.exists()) {
			throw new BadRequestException("No images could be decoded!");
		}

		DocumentStubWithPages document = new DocumentStubWithPages();
		document.setState(DocumentState.Waiting);
		document.setFolderId(f.getId());
		document.setImagePath(uploaded.toString());
		this.documentService.save(document);
		return document;
	}
}
