package eu.zavadil.ocr.api.admin;

import eu.zavadil.ocr.api.exceptions.BadRequestException;
import eu.zavadil.ocr.api.exceptions.ResourceNotFoundException;
import eu.zavadil.ocr.data.document.DocumentState;
import eu.zavadil.ocr.data.document.DocumentStub;
import eu.zavadil.ocr.data.document.DocumentStubRepository;
import eu.zavadil.ocr.data.documentTemplate.DocumentTemplate;
import eu.zavadil.ocr.data.documentTemplate.DocumentTemplatePage;
import eu.zavadil.ocr.data.folder.FolderChain;
import eu.zavadil.ocr.data.folder.FolderChainCache;
import eu.zavadil.ocr.data.fragment.FragmentStub;
import eu.zavadil.ocr.data.fragment.FragmentStubRepository;
import eu.zavadil.ocr.service.DocumentService;
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
	DocumentService documentService;

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
		this.documentService.deleteById(id);
	}

	@GetMapping("{id}/fragments")
	@Operation(summary = "Load document fragments.")
	public List<FragmentStub> loadDocumentFragments(@PathVariable int id) {
		return this.fragmentStubRepository.findAllByDocumentId(id);
	}

	@GetMapping("{id}/pages")
	@Operation(summary = "Load document pages.")
	public List<DocumentStub> loadDocumentPages(@PathVariable int id) {
		return this.documentService.loadPages(id);
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

		DocumentTemplate documentTemplate = this.documentTemplateService.getForDocument(d);
		if (documentTemplate == null) {
			throw new BadRequestException("No template could be determined!");
		}

		//UPLOAD
		List<ImageFile> uploaded = this.imageService.upload(f, file);
		if (uploaded.isEmpty()) {
			throw new BadRequestException("No images could be decoded!");
		}
		ImageFile oldImg = this.imageService.getImage(d.getImagePath());

		List<DocumentTemplatePage> pages = null;

		if (documentTemplate.isMulti()) {
			d.setMulti(true);
			pages = documentTemplate.getPages();
			if (pages.size() != uploaded.size()) {
				for (int i = 0; i < uploaded.size(); i++) {
					uploaded.get(i).delete();
				}
				throw new BadRequestException(
					String.format(
						"Template has %d pages, but uploaded document has %d pages!",
						pages.size(),
						uploaded.size()
					)
				);
			}
		} else {
			d.setMulti(false);
			if (uploaded.size() > 1) {
				log.info("Uploaded PDF document has {} pages. Using only the first one! To create document for each page, use /documents/upload-image/{folderId} endpoint.", uploaded.size());
				for (int i = 1; i < uploaded.size(); i++) {
					uploaded.get(i).delete();
				}
			}
		}

		ImageFile newImg = uploaded.get(0);

		// MOVE and SAVE
		StorageDirectory uploadDir = newImg.getParentDirectory().createSubdirectory(
			String.format("%d-%s", d.getId(), newImg.getBaseName())
		);

		if (pages != null) {
			this.documentService.deletePages(d.getId());
			for (int i = 0, max = pages.size(); i < max; i++) {
				newImg = uploaded.get(i);
				StorageFile uploadFile = uploadDir.getUnusedFile(newImg.getFileName());
				newImg.moveTo(uploadFile, true);
				DocumentStub pd = new DocumentStub();
				pd.setFolderId(f.getId());
				pd.setImagePath(uploadFile.toString());
				pd.setParentDocumentId(d.getId());
				pd.setDocumentTemplateId(pages.get(i).getDocumentTemplateId());
				this.documentService.save(pd);
			}

			//REMOVE OLD IMAGE
			if (oldImg.exists()) {
				this.imageService.delete(oldImg);
				d.setImagePath(null);
			}

		} else {
			StorageFile uploadFile = uploadDir.getFile(newImg.getFileName());
			newImg.moveTo(uploadFile, true);
			d.setImagePath(uploadFile.toString());

			//REMOVE OLD IMAGE
			if (oldImg.exists() && !uploadFile.equals(newImg)) {
				this.imageService.delete(oldImg);
			}
		}

		d.setState(DocumentState.Waiting);
		this.documentService.save(d);
		return d.getImagePath();
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

		DocumentTemplate documentTemplate = this.documentTemplateService.getForFolder(f);
		if (documentTemplate == null) {
			throw new BadRequestException("No template could be determined!");
		}

		List<ImageFile> uploaded = this.imageService.upload(f, file);
		if (uploaded.isEmpty()) {
			throw new BadRequestException("No images could be decoded!");
		}

		List<DocumentStub> result = new ArrayList<>(uploaded.size());

		DocumentStub parentDocument = null;
		List<DocumentTemplatePage> pages = null;

		if (documentTemplate.isMulti()) {
			pages = documentTemplate.getPages();
			if (pages.size() != uploaded.size()) {
				for (int i = 0; i < uploaded.size(); i++) {
					uploaded.get(i).delete();
				}
				throw new BadRequestException(
					String.format(
						"Template has %d pages, but uploaded document has %d pages!",
						pages.size(),
						uploaded.size()
					)
				);
			}
			parentDocument = new DocumentStub();
			parentDocument.setMulti(true);
			parentDocument.setFolderId(f.getId());
			parentDocument.setDocumentTemplateId(documentTemplate.getId());
			result.add(this.documentStubRepository.save(parentDocument));
		}

		for (int i = 0, max = uploaded.size(); i < max; i++) {
			DocumentStub d = new DocumentStub();
			d.setMulti(false);
			d.setFolderId(f.getId());
			d.setImagePath(uploaded.get(i).toString());
			if (parentDocument != null && pages != null) {
				d.setParentDocumentId(parentDocument.getId());
				d.setDocumentTemplateId(pages.get(i).getDocumentTemplateId());
				this.documentStubRepository.save(d);
			} else {
				d.setDocumentTemplateId(documentTemplate.getId());
				result.add(this.documentStubRepository.save(d));
			}
		}

		return result;
	}
}
