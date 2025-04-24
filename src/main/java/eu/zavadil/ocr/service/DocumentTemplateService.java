package eu.zavadil.ocr.service;

import eu.zavadil.java.spring.common.entity.EntityBase;
import eu.zavadil.java.spring.common.exceptions.ResourceNotFoundException;
import eu.zavadil.ocr.data.parsed.document.DocumentStubBase;
import eu.zavadil.ocr.data.parsed.folder.FolderChain;
import eu.zavadil.ocr.data.parsed.folder.FolderChainCache;
import eu.zavadil.ocr.data.template.documentTemplate.DocumentTemplate;
import eu.zavadil.ocr.data.template.documentTemplate.DocumentTemplateCache;
import eu.zavadil.ocr.data.template.documentTemplate.DocumentTemplateStubWithPages;
import eu.zavadil.ocr.data.template.documentTemplate.DocumentTemplateStubWithPagesRepository;
import eu.zavadil.ocr.data.template.fragmentTemplate.FragmentTemplateStub;
import eu.zavadil.ocr.data.template.fragmentTemplate.FragmentTemplateStubRepository;
import eu.zavadil.ocr.data.template.pageTemplate.PageTemplateStub;
import eu.zavadil.ocr.data.template.pageTemplate.PageTemplateStubRepository;
import eu.zavadil.ocr.data.template.pageTemplate.PageTemplateStubWithFragments;
import eu.zavadil.ocr.data.template.pageTemplate.PageTemplateStubWithFragmentsRepository;
import lombok.NonNull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class DocumentTemplateService {

	@Autowired
	DocumentTemplateCache documentTemplateCache;

	@Autowired
	DocumentTemplateStubWithPagesRepository documentTemplateStubWithPagesRepository;

	@Autowired
	PageTemplateStubRepository pageTemplateStubRepository;

	@Autowired
	PageTemplateStubWithFragmentsRepository pageTemplateStubWithFragmentsRepository;

	@Autowired
	FragmentTemplateStubRepository fragmentTemplateStubRepository;

	@Autowired
	FolderChainCache folderChainService;

	@Autowired
	ImageService imageService;

	public DocumentTemplate getById(int id) {
		return this.documentTemplateCache.get(id);
	}

	public DocumentTemplate getForFolder(FolderChain f) {
		if (f.getDocumentTemplateId() != null) {
			return this.getById(f.getDocumentTemplateId());
		}
		if (f.getParent() != null) {
			return this.getForFolder(f.getParent());
		}
		return null;
	}

	public DocumentTemplate getForDocument(DocumentStubBase d) {
		if (d.getDocumentTemplateId() != null) {
			return this.getById(d.getDocumentTemplateId());
		}
		FolderChain f = this.folderChainService.get(d.getFolderId());
		return this.getForFolder(f);
	}

	public void delete(@NonNull DocumentTemplateStubWithPages documentTemplate) {
		for (PageTemplateStubWithFragments page : documentTemplate.getPages()) {
			this.imageService.delete(page.getPreviewImg());
		}
		this.documentTemplateStubWithPagesRepository.delete(documentTemplate);
		this.documentTemplateCache.reset(documentTemplate.getId());
	}

	public void deleteById(int id) {
		DocumentTemplateStubWithPages doc = this.getStubById(id);
		if (doc == null) throw new ResourceNotFoundException("DocumentTemplate", id);
		this.delete(doc);
	}

	public List<DocumentTemplateStubWithPages> getAllStubs() {
		return this.documentTemplateStubWithPagesRepository.findAll();
	}

	public Page<DocumentTemplateStubWithPages> getAllStubsPaged(PageRequest pr) {
		return this.documentTemplateStubWithPagesRepository.findAll(pr);
	}

	public DocumentTemplateStubWithPages getStubById(int id) {
		return this.documentTemplateStubWithPagesRepository.findById(id).orElse(null);
	}

	@Transactional
	public DocumentTemplateStubWithPages save(DocumentTemplateStubWithPages documentTemplate) {
		List<PageTemplateStubWithFragments> pages = documentTemplate.getPages().stream().toList();
		if (documentTemplate.getId() != null) {
			List<PageTemplateStub> extra = this.pageTemplateStubRepository.loadExtraPages(
				documentTemplate.getId(),
				pages.stream().map(EntityBase::getId).toList()
			);
			for (PageTemplateStub page : extra) {
				this.imageService.delete(page.getPreviewImg());
				this.pageTemplateStubRepository.delete(page);
			}
			List<Integer> fragmentIds = pages.stream()
				.flatMap((p) -> p.getFragments().stream())
				.map(EntityBase::getId)
				.toList();
			this.fragmentTemplateStubRepository.deleteExtra(documentTemplate.getId(), fragmentIds);
		}

		DocumentTemplateStubWithPages saved = this.documentTemplateStubWithPagesRepository.save(documentTemplate);
		pages.forEach(
			(p) -> {
				List<FragmentTemplateStub> fragments = p.getFragments().stream().toList();
				p.setDocumentTemplateId(documentTemplate.getId());
				this.pageTemplateStubWithFragmentsRepository.save(p);
				fragments.forEach(
					(f) -> {
						f.setPageTemplateId(p.getId());
						this.fragmentTemplateStubRepository.save(f);
					}
				);
				p.setFragments(fragments);
			}
		);
		saved.setPages(pages);
		this.documentTemplateCache.reset(saved.getId());
		return saved;
	}

}
