package eu.zavadil.ocr.service;

import eu.zavadil.ocr.data.document.DocumentStub;
import eu.zavadil.ocr.data.documentTemplate.DocumentTemplate;
import eu.zavadil.ocr.data.documentTemplate.DocumentTemplateRepository;
import eu.zavadil.ocr.data.folder.FolderChain;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class DocumentTemplateService extends BasicEntityCache<DocumentTemplate> {

	private FolderChainService folderChainService;

	@Autowired
	public DocumentTemplateService(
		DocumentTemplateRepository documentTemplateRepository,
		FolderChainService folderChainService
	) {
		super(documentTemplateRepository);
		this.folderChainService = folderChainService;
	}

	public DocumentTemplate getForFolder(FolderChain f) {
		if (f.getDocumentTemplateId() != null) {
			return this.get(f.getDocumentTemplateId());
		}
		if (f.getParent() != null) {
			return this.getForFolder(f.getParent());
		}
		return null;
	}

	public DocumentTemplate getForDocument(DocumentStub d) {
		if (d.getDocumentTemplateId() != null) {
			return this.get(d.getDocumentTemplateId());
		}
		FolderChain f = this.folderChainService.get(d.getFolderId());
		return this.getForFolder(f);
	}

}
