package eu.zavadil.ocr.api.admin;

import eu.zavadil.java.spring.common.paging.JsonPage;
import eu.zavadil.java.spring.common.paging.JsonPageImpl;
import eu.zavadil.ocr.api.exceptions.ResourceNotFoundException;
import eu.zavadil.ocr.data.parsed.document.DocumentState;
import eu.zavadil.ocr.data.parsed.document.DocumentStubRepository;
import eu.zavadil.ocr.data.parsed.document.DocumentStubWithPages;
import eu.zavadil.ocr.data.parsed.document.DocumentStubWithPagesRepository;
import eu.zavadil.ocr.data.parsed.folder.FolderChain;
import eu.zavadil.ocr.data.parsed.folder.FolderStub;
import eu.zavadil.ocr.service.FolderService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("${api.base-url}/admin/folders")
@Tag(name = "Folders")
@Slf4j
public class FolderController {

	@Autowired
	FolderService folderService;

	@Autowired
	DocumentStubWithPagesRepository documentStubWithFragmentsRepository;

	@Autowired
	DocumentStubRepository documentStubRepository;

	@GetMapping("")
	@Operation(summary = "Load paged root folders.")
	public JsonPage<FolderStub> rootFolders(
		@RequestParam(defaultValue = "0") int page,
		@RequestParam(defaultValue = "10") int size
	) {
		return JsonPageImpl.of(this.folderService.subFolders(null, page, size));
	}

	@PostMapping("")
	@Operation(summary = "Insert new folder.")
	public FolderStub insertFolder(@RequestBody FolderStub folder) {
		folder.setId(null);
		return this.folderService.save(folder);
	}

	@GetMapping("/{id}")
	@Operation(summary = "Load a single folder.")
	public FolderStub loadFolder(@PathVariable int id) {
		FolderStub result = this.folderService.getStubById(id);
		if (result == null) throw new ResourceNotFoundException("Folder", String.valueOf(id));
		return result;
	}

	@PutMapping("/{id}")
	@Operation(summary = "Update a folder.")
	public FolderStub updateFolder(@PathVariable int id, @RequestBody FolderStub folder) {
		folder.setId(id);
		return this.folderService.save(folder);
	}

	@DeleteMapping("/{id}")
	@Operation(summary = "Delete a folder.")
	public void deleteFolder(@PathVariable int id) {
		this.folderService.deleteById(id);
	}

	@GetMapping("{id}/children")
	@Operation(summary = "Load child folders.")
	public JsonPage<FolderStub> pagedSubFolders(
		@PathVariable int id,
		@RequestParam(defaultValue = "0") int page,
		@RequestParam(defaultValue = "10") int size
	) {
		return JsonPageImpl.of(this.folderService.subFolders(id, page, size, Sort.by("name")));
	}

	@GetMapping("{id}/documents")
	@Operation(summary = "Load child documents.")
	public JsonPage<DocumentStubWithPages> pagedSubDocuments(
		@PathVariable int id,
		@RequestParam(defaultValue = "0") int page,
		@RequestParam(defaultValue = "10") int size
	) {
		return JsonPageImpl.of(this.folderService.subDocuments(id, page, size, Sort.by("createdOn")));
	}

	@PutMapping("/{id}/documents/set-state")
	@Operation(summary = "Update state of all documents in folder.")
	public void updateFolderDocumentsState(@PathVariable int id, @RequestParam DocumentState state) {
		this.documentStubRepository.updateDocumentsState(id, state);
	}

	@GetMapping("{id}/chain")
	@Operation(summary = "Load folder chain.")
	public FolderChain folderChain(@PathVariable int id) {
		FolderChain result = this.folderService.getChainById(id);
		if (result == null) throw new ResourceNotFoundException("Folder chain", id);
		return result;
	}

}
