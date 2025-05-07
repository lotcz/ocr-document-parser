package eu.zavadil.ocr.service;

import eu.zavadil.java.spring.common.exceptions.ResourceNotFoundException;
import eu.zavadil.java.spring.common.paging.PageSource;
import eu.zavadil.ocr.data.parsed.document.DocumentStubWithPages;
import eu.zavadil.ocr.data.parsed.document.DocumentStubWithPagesRepository;
import eu.zavadil.ocr.data.parsed.folder.*;
import eu.zavadil.ocr.service.folders.SubDocumentsPageSource;
import eu.zavadil.ocr.service.folders.SubFoldersPageSource;
import lombok.NonNull;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.Iterator;

@Service
public class FolderService {

	@Autowired
	DocumentService documentService;

	@Autowired
	FolderChainCache folderChainCache;

	@Autowired
	FolderChainRepository folderChainRepository;

	@Autowired
	FolderStubRepository folderStubRepository;

	@Autowired
	DocumentStubWithPagesRepository documentStubWithPagesRepository;

	public FolderChain getChainById(int id) {
		return this.folderChainCache.get(id);
	}

	public FolderStub getStubById(int id) {
		return this.folderStubRepository.findById(id).orElse(null);
	}

	public Page<FolderStub> subFolders(Integer folderId, PageRequest pr) {
		return this.folderStubRepository.loadChildFolders(folderId, pr);
	}

	public Page<FolderStub> subFolders(Integer folderId, int page, int size) {
		return this.subFolders(folderId, PageRequest.of(page, size));
	}

	public Page<FolderStub> subFolders(Integer folderId, int page, int size, Sort sort) {
		return this.subFolders(folderId, PageRequest.of(page, size, sort));
	}

	public PageSource<FolderStub> subFoldersPageSource(Integer folderId) {
		return new SubFoldersPageSource(this, folderId);
	}

	public Page<DocumentStubWithPages> subDocuments(int folderId, PageRequest pr) {
		return this.documentStubWithPagesRepository.loadFolderDocuments(folderId, pr);
	}

	public Page<DocumentStubWithPages> subDocuments(int folderId, int page, int size, Sort sort) {
		return this.subDocuments(folderId, PageRequest.of(page, size, sort));
	}

	public Page<DocumentStubWithPages> subDocuments(int folderId, int page, int size) {
		return this.subDocuments(folderId, PageRequest.of(page, size));
	}

	public PageSource<DocumentStubWithPages> subDocumentsPageSource(Integer folderId) {
		return new SubDocumentsPageSource(this, folderId);
	}

	public void delete(@NonNull FolderStub f) {
		Iterator<FolderStub> subFoldersIterator = this.subFoldersPageSource(f.getId()).iterator();
		subFoldersIterator.forEachRemaining(this::delete);
		Iterator<DocumentStubWithPages> subDocumentsIterator = this.subDocumentsPageSource(f.getId()).iterator();
		subDocumentsIterator.forEachRemaining((d) -> this.documentService.delete(d));
		this.folderStubRepository.delete(f);
	}

	public void deleteById(int folderId) {
		FolderStub d = this.getStubById(folderId);
		if (d == null) throw new ResourceNotFoundException("Folder", folderId);
		this.delete(d);
	}

	public FolderStub save(FolderStub folder) {
		FolderStub result = this.folderStubRepository.save(folder);
		this.folderChainCache.reset(folder.getId());
		return result;
	}

}
