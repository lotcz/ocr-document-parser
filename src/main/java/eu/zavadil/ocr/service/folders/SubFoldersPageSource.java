package eu.zavadil.ocr.service.folders;

import eu.zavadil.java.spring.common.paging.PageSource;
import eu.zavadil.ocr.data.parsed.folder.FolderStub;
import eu.zavadil.ocr.service.FolderService;
import org.springframework.data.domain.Page;

public class SubFoldersPageSource extends FolderPageSourceBase implements PageSource<FolderStub> {

	public SubFoldersPageSource(FolderService folderService, Integer folderId) {
		super(folderService, folderId);
	}

	@Override
	public Page<FolderStub> loadPage(int pageNumber, int pageSize) {
		return this.folderService.subFolders(this.folderId, pageNumber, pageSize);
	}
}
