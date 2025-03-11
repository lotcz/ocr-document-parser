package eu.zavadil.ocr.service;

import eu.zavadil.ocr.data.document.DocumentStub;
import eu.zavadil.ocr.data.documentTemplate.DocumentTemplate;
import eu.zavadil.ocr.data.documentTemplate.DocumentTemplateCache;
import eu.zavadil.ocr.data.documentTemplate.DocumentTemplateStub;
import eu.zavadil.ocr.data.documentTemplate.DocumentTemplateStubRepository;
import eu.zavadil.ocr.data.folder.FolderChain;
import eu.zavadil.ocr.data.folder.FolderChainCache;
import eu.zavadil.ocr.data.fragmentTemplate.FragmentTemplateStub;
import eu.zavadil.ocr.data.fragmentTemplate.FragmentTemplateStubRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;

@Service
public class DocumentTemplateService {

	@Autowired
	DocumentTemplateCache documentTemplateCache;

	@Autowired
	DocumentTemplateStubRepository documentTemplateStubRepository;

	@Autowired
	FragmentTemplateStubRepository fragmentTemplateStubRepository;

	@Autowired
	FolderChainCache folderChainService;

	public DocumentTemplate getForFolder(FolderChain f) {
		if (f.getDocumentTemplateId() != null) {
			return this.documentTemplateCache.get(f.getDocumentTemplateId());
		}
		if (f.getParent() != null) {
			return this.getForFolder(f.getParent());
		}
		return null;
	}

	public DocumentTemplate getForDocument(DocumentStub d) {
		if (d.getDocumentTemplateId() != null) {
			return this.documentTemplateCache.get(d.getDocumentTemplateId());
		}
		FolderChain f = this.folderChainService.get(d.getFolderId());
		return this.getForFolder(f);
	}

	public DocumentTemplateStub save(DocumentTemplateStub documentTemplate) {
		DocumentTemplateStub result = this.documentTemplateStubRepository.save(documentTemplate);
		this.documentTemplateCache.reset(result.getId());
		return result;
	}

	public void deleteById(int id) {
		this.documentTemplateStubRepository.deleteById(id);
		this.documentTemplateCache.reset(id);
	}

	public List<FragmentTemplateStub> loadFragments(int id) {
		return this.fragmentTemplateStubRepository.findAllByDocumentTemplateId(id);
	}

	public List<FragmentTemplateStub> saveDocumentTemplateFragments(
		int documentTemplateId,
		List<FragmentTemplateStub> fragments
	) {
		this.fragmentTemplateStubRepository.deleteNotIn(
			documentTemplateId,
			fragments.stream().map(FragmentTemplateStub::getId).filter(Objects::nonNull).toList()
		);
		for (FragmentTemplateStub template : fragments) {
			template.setDocumentTemplateId(documentTemplateId);
		}
		List<FragmentTemplateStub> result = this.fragmentTemplateStubRepository.saveAll(fragments);
		this.documentTemplateCache.reset(documentTemplateId);
		return result;
	}

}
