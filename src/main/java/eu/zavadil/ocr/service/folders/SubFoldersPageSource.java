package eu.zavadil.ocr.service.folders;

import eu.zavadil.java.ocr.common.parsed.folder.FolderStub;
import eu.zavadil.java.spring.common.paging.PageSource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;

public class SubFoldersPageSource extends FolderPageSourceBase implements PageSource<FolderStub> {

	public SubFoldersPageSource(FolderService folderService, Integer folderId) {
		super(folderService, folderId);
	}

	@Override
	public Page<FolderStub> loadPage(PageRequest pr) {
		return this.folderService.subFolders(this.folderId, pr);
	}
}
