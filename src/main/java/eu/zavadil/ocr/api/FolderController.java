package eu.zavadil.ocr.api;

import eu.zavadil.ocr.api.exceptions.ResourceNotFoundException;
import eu.zavadil.ocr.data.document.DocumentStub;
import eu.zavadil.ocr.data.folder.Folder;
import eu.zavadil.ocr.data.folder.FolderRepository;
import eu.zavadil.ocr.data.folder.FolderStub;
import eu.zavadil.ocr.data.folder.FolderStubRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("${api.base-url}/folders")
@Tag(name = "Folders")
@Slf4j
public class FolderController {

	@Autowired
	FolderRepository folderRepository;

	@Autowired
	FolderStubRepository folderStubRepository;

	@GetMapping("")
	@Operation(summary = "Load paged root folders.")
	public JsonPage<FolderStub> rootFolders(
		@RequestParam(defaultValue = "0") int page,
		@RequestParam(defaultValue = "10") int size
	) {
		return JsonPage.of(
			this.folderStubRepository.loadChildFolders(null, PageRequest.of(page, size))
		);
	}

	@PostMapping("")
	@Operation(summary = "Insert new folder.")
	public Folder insertFolder(@RequestBody Folder folder) {
		folder.setId(null);
		return this.folderRepository.save(folder);
	}

	@GetMapping("/{id}")
	@Operation(summary = "Load a single folder.")
	public Folder loadFolder(
		@PathVariable int id
	) {
		return this.folderRepository.findById(id)
			.orElseThrow(() -> new ResourceNotFoundException("Folder", String.valueOf(id)));
	}

	@PutMapping("/{id}")
	@Operation(summary = "Update a folder.")
	public Folder updateFolder(@RequestBody Folder folder) {
		return this.folderRepository.save(folder);
	}

	@GetMapping("{id}/children")
	@Operation(summary = "Load child folders.")
	public JsonPage<FolderStub> pagedSubFolders(
		@PathVariable int id,
		@RequestParam(defaultValue = "0") int page,
		@RequestParam(defaultValue = "10") int size
	) {
		return JsonPage.of(
			this.folderStubRepository.loadChildFolders(id, PageRequest.of(page, size))
		);
	}

	@GetMapping("{id}/documents")
	@Operation(summary = "Load child documents.")
	public JsonPage<DocumentStub> pagedSubDocuments(
		@PathVariable int id,
		@RequestParam(defaultValue = "0") int page,
		@RequestParam(defaultValue = "10") int size
	) {
		return JsonPage.of(
			this.folderRepository.loadChildDocuments(id, PageRequest.of(page, size))
		);
	}
}
