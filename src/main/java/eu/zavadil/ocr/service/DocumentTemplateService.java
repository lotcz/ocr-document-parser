package eu.zavadil.ocr.service;

import eu.zavadil.java.spring.common.entity.EntityBase;
import eu.zavadil.java.spring.common.exceptions.BadRequestException;
import eu.zavadil.java.spring.common.exceptions.ResourceNotFoundException;
import eu.zavadil.ocr.data.document.DocumentStub;
import eu.zavadil.ocr.data.documentTemplate.*;
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
	DocumentTemplatePageRepository documentTemplatePageRepository;

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

	public DocumentTemplate getForDocument(DocumentStub d) {
		if (d.getDocumentTemplateId() != 0) {
			return this.getById(d.getDocumentTemplateId());
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
		DocumentTemplate dt = this.getById(id);
		this.imageService.delete(dt.getPreviewImg());
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

	public List<DocumentTemplatePage> loadPages(int documentTemplateId) {
		DocumentTemplate dt = this.getById(documentTemplateId);
		return dt == null ? List.of() : dt.getPages();
	}

	public List<DocumentTemplatePage> saveDocumentTemplatePages(
		int parentTemplateId,
		List<DocumentTemplatePage> pages
	) {
		DocumentTemplate parent = this.getById(parentTemplateId);
		if (parent == null) {
			throw new ResourceNotFoundException("DocumentTemplate", parentTemplateId);
		}
		boolean hasPages = !pages.isEmpty();
		if (parent.isMulti() != hasPages) {
			if (hasPages) {
				throw new BadRequestException("You are saving pages for template that is not multi-page!");
			} else {
				throw new BadRequestException("Multi-page template must have at least a single page!");
			}
		}

		this.documentTemplatePageRepository.deleteNotIn(
			parentTemplateId,
			pages.stream().map(EntityBase::getId).filter(Objects::nonNull).toList()
		);
		for (DocumentTemplatePage page : pages) {
			page.setParentDocumentTemplateId(parentTemplateId);
		}
		List<DocumentTemplatePage> result = this.documentTemplatePageRepository.saveAll(pages);

		this.documentTemplateCache.reset(parentTemplateId);
		return result;
	}

}
