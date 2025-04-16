package eu.zavadil.ocr.service;

import eu.zavadil.ocr.data.document.DocumentStub;
import eu.zavadil.ocr.data.document.DocumentStubRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DocumentService {

	@Autowired
	DocumentStubRepository documentStubRepository;

	@Autowired
	ImageService imageService;

	public DocumentStub getById(int id) {
		return this.documentStubRepository.findById(id).orElse(null);
	}

	public DocumentStub save(DocumentStub document) {
		return this.documentStubRepository.save(document);
	}

	public void deletePages(int id) {
		List<DocumentStub> pages = this.loadPages(id);
		for (DocumentStub page : pages) {
			this.delete(page);
		}
	}

	public void delete(DocumentStub d) {
		if (d == null) return;
		this.deletePages(d.getId());
		this.imageService.delete(d.getImagePath());
		this.documentStubRepository.delete(d);
	}

	public void deleteById(int id) {
		DocumentStub d = this.getById(id);
		if (d == null) return;
		this.delete(d);
	}

	public List<DocumentStub> loadPages(int id) {
		return this.documentStubRepository.findAllByParentDocumentId(id);
	}

}
