package eu.zavadil.ocr.service;

import eu.zavadil.java.spring.common.entity.EntityBase;
import eu.zavadil.java.spring.common.exceptions.ResourceNotFoundException;
import eu.zavadil.ocr.data.parsed.document.DocumentStubWithPages;
import eu.zavadil.ocr.data.parsed.document.DocumentStubWithPagesRepository;
import eu.zavadil.ocr.data.parsed.fragment.FragmentStub;
import eu.zavadil.ocr.data.parsed.fragment.FragmentStubRepository;
import eu.zavadil.ocr.data.parsed.page.PageStubWithFragments;
import eu.zavadil.ocr.data.parsed.page.PageStubWithFragmentsRepository;
import lombok.NonNull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@Service
public class DocumentService {

	@Autowired
	DocumentStubWithPagesRepository documentStubWithPagesRepository;

	@Autowired
	PageStubWithFragmentsRepository pageStubWithFragmentsRepository;

	@Autowired
	FragmentStubRepository fragmentStubRepository;

	@Autowired
	ImageService imageService;

	public DocumentStubWithPages getById(int id) {
		return this.documentStubWithPagesRepository.findById(id).orElse(null);
	}

	public void deleteFragment(@NonNull FragmentStub f) {
		this.imageService.delete(f.getImagePath());
		this.fragmentStubRepository.delete(f);
	}

	public void deletePage(@NonNull PageStubWithFragments p) {
		for (FragmentStub f : p.getFragments()) {
			this.deleteFragment(f);
		}
		this.imageService.delete(p.getImagePath());
		this.pageStubWithFragmentsRepository.delete(p);
	}

	public DocumentStubWithPages deletePages(@NonNull DocumentStubWithPages d) {
		for (PageStubWithFragments p : d.getPages()) {
			this.deletePage(p);
		}
		d.setPages(new ArrayList<>());
		d.setPageCount(0);
		return d;
	}

	public void delete(@NonNull DocumentStubWithPages d) {
		for (PageStubWithFragments p : d.getPages()) {
			this.deletePage(p);
		}
		this.imageService.delete(d.getImagePath());
		this.documentStubWithPagesRepository.delete(d);
	}

	public void deleteById(int documentId) {
		DocumentStubWithPages d = this.getById(documentId);
		if (d == null) throw new ResourceNotFoundException("Document", documentId);
		this.delete(d);
	}

	@Transactional
	public DocumentStubWithPages save(DocumentStubWithPages document) {
		if (document.getId() != null) {
			List<PageStubWithFragments> extraPages = this.pageStubWithFragmentsRepository.loadExtra(
				document.getId(),
				document.getPages().stream().map(EntityBase::getId).filter(Objects::nonNull).toList()
			);
			for (PageStubWithFragments p : extraPages) {
				this.deletePage(p);
			}
			List<FragmentStub> extraFragments = this.fragmentStubRepository.loadExtra(
				document.getId(),
				document.getPages().stream()
					.flatMap((p) -> p.getFragments().stream())
					.map(EntityBase::getId)
					.filter(Objects::nonNull)
					.toList()
			);
			for (FragmentStub f : extraFragments) {
				this.deleteFragment(f);
			}
			document.setPageCount(document.getPages().size());
		}
		this.documentStubWithPagesRepository.save(document);
		document.getPages().forEach(
			(p) -> {
				p.setDocumentId(document.getId());
				this.pageStubWithFragmentsRepository.save(p);
				p.getFragments().forEach(
					(f) -> {
						f.setPageId(p.getId());
						this.fragmentStubRepository.save(f);
					}
				);
			}
		);
		return document;
	}

	public DocumentStubWithPages findFirstByFolderIdAndImagePath(int folderId, String imagePath) {
		return this.documentStubWithPagesRepository.findFirstByFolderIdAndImagePath(folderId, imagePath).orElse(null);
	}

}
