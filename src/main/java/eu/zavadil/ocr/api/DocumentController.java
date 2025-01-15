package eu.zavadil.ocr.api;

import eu.zavadil.ocr.api.exceptions.ResourceNotFoundException;
import eu.zavadil.ocr.data.document.Document;
import eu.zavadil.ocr.data.document.DocumentRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("${api.base-url}/documents")
@Tag(name = "Documents")
@Slf4j
public class DocumentController {

	@Autowired
	DocumentRepository documentRepository;

	@PostMapping("")
	@Operation(summary = "Insert new document.")
	public Document insertDocument(@RequestBody Document document) {
		document.setId(null);
		return this.documentRepository.save(document);
	}

	@GetMapping("/{id}")
	@Operation(summary = "Load a single document.")
	public Document loadDocument(@PathVariable int id) {
		return this.documentRepository.findById(id)
			.orElseThrow(() -> new ResourceNotFoundException("Document", String.valueOf(id)));
	}

	@PutMapping("/{id}")
	@Operation(summary = "Update a document.")
	public Document updateDocument(@PathVariable int id, @RequestBody Document document) {
		document.setId(id);
		return this.documentRepository.save(document);
	}

}
