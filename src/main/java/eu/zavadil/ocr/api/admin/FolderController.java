package eu.zavadil.ocr.api.admin;

import eu.zavadil.java.spring.common.paging.JsonPage;
import eu.zavadil.java.spring.common.paging.JsonPageImpl;
import eu.zavadil.ocr.api.exceptions.ResourceNotFoundException;
import eu.zavadil.ocr.data.document.DocumentStub;
import eu.zavadil.ocr.data.document.DocumentStubWithFragments;
import eu.zavadil.ocr.data.document.DocumentStubWithFragmentsRepository;
import eu.zavadil.ocr.data.folder.*;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("${api.base-url}/admin/folders")
@Tag(name = "Folders")
@Slf4j
public class FolderController {

	@Autowired
	FolderRepository folderRepository;

	@Autowired
	FolderStubRepository folderStubRepository;

	@Autowired
	FolderChainCache folderChainService;

	@Autowired
	DocumentStubWithFragmentsRepository documentStubWithFragmentsRepository;

	@GetMapping("")
	@Operation(summary = "Load paged root folders.")
	public JsonPage<FolderStub> rootFolders(
		@RequestParam(defaultValue = "0") int page,
		@RequestParam(defaultValue = "10") int size
	) {
		return JsonPageImpl.of(
			this.folderStubRepository.loadChildFolders(null, PageRequest.of(page, size))
		);
	}

	@PostMapping("")
	@Operation(summary = "Insert new folder.")
	public FolderStub insertFolder(@RequestBody FolderStub folder) {
		folder.setId(null);
		return this.folderStubRepository.save(folder);
	}

	@GetMapping("/{id}")
	@Operation(summary = "Load a single folder.")
	public FolderStub loadFolder(
		@PathVariable int id
	) {
		return this.folderStubRepository.findById(id)
			.orElseThrow(() -> new ResourceNotFoundException("Folder", String.valueOf(id)));
	}

	@PutMapping("/{id}")
	@Operation(summary = "Update a folder.")
	public FolderStub updateFolder(@RequestBody FolderStub folder) {
		FolderStub result = this.folderStubRepository.save(folder);
		this.folderChainService.reset();
		return result;
	}

	@GetMapping("{id}/children")
	@Operation(summary = "Load child folders.")
	public JsonPage<FolderStub> pagedSubFolders(
		@PathVariable int id,
		@RequestParam(defaultValue = "0") int page,
		@RequestParam(defaultValue = "10") int size
	) {
		return JsonPageImpl.of(
			this.folderStubRepository.loadChildFolders(id, PageRequest.of(page, size, Sort.by("name")))
		);
	}

	@GetMapping("{id}/documents")
	@Operation(summary = "Load child documents.")
	public JsonPage<DocumentStub> pagedSubDocuments(
		@PathVariable int id,
		@RequestParam(defaultValue = "0") int page,
		@RequestParam(defaultValue = "10") int size
	) {
		return JsonPageImpl.of(
			this.folderRepository.loadChildDocuments(id, PageRequest.of(page, size, Sort.by("createdOn")))
		);
	}

	@GetMapping("{id}/documents/with-fragments")
	@Operation(summary = "Load child documents with fragments.")
	public JsonPage<DocumentStubWithFragments> pagedSubDocumentsWithFragments(
		@PathVariable int id,
		@RequestParam(defaultValue = "0") int page,
		@RequestParam(defaultValue = "10") int size
	) {
		return JsonPageImpl.of(
			this.folderRepository.loadChildDocumentsWithFragments(
				id,
				PageRequest.of(page, size, Sort.by("createdOn"))
			)
		);
	}

	@GetMapping("{id}/chain")
	@Operation(summary = "Load folder chain.")
	public FolderChain folderChain(@PathVariable int id) {
		FolderChain result = this.folderChainService.get(id);
		if (result == null) {
			throw new ResourceNotFoundException("Folder chain", id);
		}
		return result;
	}

}
