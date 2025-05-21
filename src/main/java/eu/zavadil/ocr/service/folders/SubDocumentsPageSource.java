package eu.zavadil.ocr.service.folders;

import eu.zavadil.java.ocr.common.parsed.document.DocumentStubWithPages;
import eu.zavadil.java.spring.common.paging.PageSource;
import eu.zavadil.ocr.service.FolderService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;

public class SubDocumentsPageSource extends FolderPageSourceBase implements PageSource<DocumentStubWithPages> {

	public SubDocumentsPageSource(FolderService folderService, Integer folderId) {
		super(folderService, folderId);
	}

	@Override
	public Page<DocumentStubWithPages> loadPage(PageRequest pr) {
		return this.folderService.subDocuments(this.folderId, pr);
	}
}
