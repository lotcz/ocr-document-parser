package eu.zavadil.ocr.api;

import eu.zavadil.ocr.api.exceptions.ResourceNotFoundException;
import eu.zavadil.ocr.data.document.DocumentStub;
import eu.zavadil.ocr.data.document.DocumentStubRepository;
import eu.zavadil.ocr.data.fragment.FragmentStub;
import eu.zavadil.ocr.data.fragment.FragmentStubRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("${api.base-url}/documents")
@Tag(name = "Documents")
@Slf4j
public class DocumentController {

	@Autowired
	DocumentStubRepository documentStubRepository;

	@Autowired
	FragmentStubRepository fragmentStubRepository;

	@GetMapping("/{id}")
	@Operation(summary = "Load a single document.")
	public DocumentStub loadDocument(@PathVariable int id) {
		return this.documentStubRepository.findById(id)
			.orElseThrow(() -> new ResourceNotFoundException("Document", String.valueOf(id)));
	}

	@PostMapping("")
	@Operation(summary = "Insert new document.")
	public DocumentStub insertDocument(@RequestBody DocumentStub document) {
		document.setId(null);
		return this.documentStubRepository.save(document);
	}

	@PutMapping("/{id}")
	@Operation(summary = "Update a document.")
	public DocumentStub updateDocument(@PathVariable int id, @RequestBody DocumentStub document) {
		document.setId(id);
		return this.documentStubRepository.save(document);
	}

	@DeleteMapping("/{id}")
	@Operation(summary = "Delete a document.")
	public void deleteDocument(@PathVariable int id) {
		this.documentStubRepository.deleteById(id);
	}

	@GetMapping("/{id}/fragments")
	@Operation(summary = "Load document fragments.")
	public List<FragmentStub> loadDocumentFragments(@PathVariable int id) {
		return this.fragmentStubRepository.findAllByDocumentId(id);
	}
}
