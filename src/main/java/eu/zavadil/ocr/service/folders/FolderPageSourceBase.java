package eu.zavadil.ocr.service.folders;

public class FolderPageSourceBase {

	protected final FolderService folderService;

	protected final Integer folderId;

	public FolderPageSourceBase(FolderService folderService, Integer folderId) {
		this.folderService = folderService;
		this.folderId = folderId;
	}

}
