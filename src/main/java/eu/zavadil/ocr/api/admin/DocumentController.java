package eu.zavadil.ocr.api.admin;

import eu.zavadil.ocr.api.exceptions.BadRequestException;
import eu.zavadil.ocr.api.exceptions.ResourceNotFoundException;
import eu.zavadil.ocr.data.document.DocumentState;
import eu.zavadil.ocr.data.document.DocumentStub;
import eu.zavadil.ocr.data.document.DocumentStubRepository;
import eu.zavadil.ocr.data.documentTemplate.DocumentTemplate;
import eu.zavadil.ocr.data.folder.FolderChain;
import eu.zavadil.ocr.data.folder.FolderChainCache;
import eu.zavadil.ocr.data.fragment.FragmentStub;
import eu.zavadil.ocr.data.fragment.FragmentStubRepository;
import eu.zavadil.ocr.service.DocumentTemplateService;
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

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("${api.base-url}/admin/documents")
@Tag(name = "Documents")
@Slf4j
public class DocumentController {

	@Autowired
	ImageService imageService;

	@Autowired
	FolderChainCache folderChainService;

	@Autowired
	DocumentTemplateService documentTemplateService;

	@Autowired
	DocumentStubRepository documentStubRepository;

	@Autowired
	FragmentStubRepository fragmentStubRepository;

	@PostMapping("")
	@Operation(summary = "Insert new document.")
	public DocumentStub insertDocument(@RequestBody DocumentStub document) {
		document.setId(null);
		return this.documentStubRepository.save(document);
	}

	@GetMapping("{id}")
	@Operation(summary = "Load a single document.")
	public DocumentStub loadDocument(@PathVariable int id) {
		return this.documentStubRepository.findById(id)
			.orElseThrow(() -> new ResourceNotFoundException("Document", String.valueOf(id)));
	}

	@PutMapping("{id}")
	@Operation(summary = "Update a document.")
	public DocumentStub updateDocument(@PathVariable int id, @RequestBody DocumentStub document) {
		document.setId(id);
		return this.documentStubRepository.save(document);
	}

	@DeleteMapping("{id}")
	@Operation(summary = "Delete a document.")
	public void deleteDocument(@PathVariable int id) {
		this.documentStubRepository.deleteById(id);
	}

	@GetMapping("{id}/fragments")
	@Operation(summary = "Load document fragments.")
	public List<FragmentStub> loadDocumentFragments(@PathVariable int id) {
		return this.fragmentStubRepository.findAllByDocumentId(id);
	}

	@PostMapping("{id}/upload-image")
	@Operation(summary = "Upload document image.")
	public String uploadDocumentImage(
		@PathVariable int id,
		@RequestParam("file") MultipartFile file
	) {
		DocumentStub d = this.documentStubRepository.findById(id)
			.orElseThrow(
				() -> new ResourceNotFoundException("Document", String.valueOf(id))
			);
		FolderChain f = this.folderChainService.get(d.getFolderId());

		//UPLOAD
		List<ImageFile> uploaded = this.imageService.upload(f, file);
		if (uploaded.isEmpty()) {
			throw new BadRequestException("No images could be decoded!");
		}
		ImageFile oldImg = this.imageService.getImage(d.getImagePath());
		ImageFile newImg = uploaded.get(0);
		if (uploaded.size() > 1) {
			log.info("Uploaded PDF document has {} pages. Using only the first one! To create document for each page, use /documents/upload-image/{folderId} endpoint.", uploaded.size());
			for (int i = 1; i < uploaded.size(); i++) {
				uploaded.get(i).delete();
			}
		}

		// MOVE
		StorageDirectory uploadDir = newImg.getParentDirectory().createSubdirectory(
			String.format("%d-%s", d.getId(), newImg.getBaseName())
		);
		StorageFile uploadFile = uploadDir.getFile(newImg.getFileName());
		newImg.moveTo(uploadFile, true);

		//SAVE
		d.setImagePath(uploadFile.toString());
		d.setState(DocumentState.Waiting);
		this.documentStubRepository.save(d);

		//REMOVE OLD IMAGE
		if (oldImg.exists() && !uploadFile.equals(newImg)) {
			this.imageService.delete(oldImg);
		}

		return uploadFile.toString();
	}

	@PostMapping("upload-image/{folderId}")
	@Operation(summary = "Upload image file and create a new document(s).")
	public List<DocumentStub> uploadFile(
		@PathVariable int folderId,
		@RequestParam("file") MultipartFile file
	) {
		FolderChain f = this.folderChainService.get(folderId);
		if (f == null) {
			throw new ResourceNotFoundException("Folder", folderId);
		}
		List<ImageFile> uploaded = this.imageService.upload(f, file);
		if (uploaded.isEmpty()) {
			throw new BadRequestException("No images could be decoded!");
		}
		log.info("Uploaded PDF document has {} pages.", uploaded.size());
		List<DocumentStub> result = new ArrayList<>(uploaded.size());
		DocumentTemplate documentTemplate = this.documentTemplateService.getForFolder(f);
		if (documentTemplate == null) {
			throw new BadRequestException("No template could be determined!");
		}
		uploaded.forEach(
			(ImageFile img) -> {
				DocumentStub d = new DocumentStub();
				d.setFolderId(f.getId());
				d.setDocumentTemplateId(documentTemplate.getId());
				d.setImagePath(img.toString());
				result.add(this.documentStubRepository.save(d));
			}
		);
		return result;
	}
}
