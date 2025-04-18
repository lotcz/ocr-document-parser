package eu.zavadil.ocr.service;

import eu.zavadil.ocr.data.document.DocumentStub;
import eu.zavadil.ocr.data.document.DocumentStubRepository;
import eu.zavadil.ocr.data.fragment.FragmentStub;
import eu.zavadil.ocr.data.fragment.FragmentStubRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DocumentService {

	@Autowired
	DocumentStubRepository documentStubRepository;

	@Autowired
	FragmentStubRepository fragmentStubRepository;

	@Autowired
	ImageService imageService;

	public DocumentStub getById(int id) {
		return this.documentStubRepository.findById(id).orElse(null);
	}

	public DocumentStub save(DocumentStub document) {
		return this.documentStubRepository.save(document);
	}

	public void deleteFragment(FragmentStub fragment) {
		this.imageService.delete(fragment.getImagePath());
		this.fragmentStubRepository.delete(fragment);
	}

	public void deleteFragments(int documentId) {
		List<FragmentStub> fragments = this.loadFragments(documentId);
		for (FragmentStub fragment : fragments) {
			this.deleteFragment(fragment);
		}
	}

	public void deletePages(int documentId) {
		List<DocumentStub> pages = this.loadPages(documentId);
		for (DocumentStub page : pages) {
			this.delete(page);
		}
	}

	public void delete(DocumentStub d) {
		if (d == null) return;
		this.deletePages(d.getId());
		this.deleteFragments(d.getId());
		this.imageService.delete(d.getImagePath());
		this.documentStubRepository.delete(d);
	}

	public void deleteById(int documentId) {
		DocumentStub d = this.getById(documentId);
		if (d == null) return;
		this.delete(d);
	}

	public List<DocumentStub> loadPages(int documentId) {
		return this.documentStubRepository.findAllByParentDocumentId(documentId);
	}

	public List<FragmentStub> loadFragments(int documentId) {
		return this.fragmentStubRepository.findAllByDocumentId(documentId);
	}

	public List<FragmentStub> saveFragments(int documentId, List<FragmentStub> fragments) {
		for (FragmentStub f : fragments) {
			f.setDocumentId(documentId);
		}
		return this.fragmentStubRepository.saveAll(fragments);
	}

}
