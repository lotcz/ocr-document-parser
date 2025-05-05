package eu.zavadil.ocr.probe;

import eu.zavadil.ocr.data.parsed.document.DocumentStubWithPages;
import eu.zavadil.ocr.data.parsed.folder.FolderChain;
import eu.zavadil.ocr.service.DocumentService;
import eu.zavadil.ocr.storage.ImageFile;
import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
@Slf4j
public class ProbeDocumentFactory {

	@Autowired
	ProbeFoldersFactory foldersFactory;

	@Autowired
	ProbeImageFactory probeImageFactory;

	@Autowired
	DocumentService documentService;

	private void createDocument(String path, FolderChain folder) {
		ImageFile file = this.probeImageFactory.createProbeDocImage(path, folder);

		DocumentStubWithPages existingDocument = this.documentService.findFirstByFolderIdAndImagePath(folder.getId(), file.toString());
		if (existingDocument == null) {
			DocumentStubWithPages document = new DocumentStubWithPages();
			document.setFolderId(folder.getId());
			document.setImagePath(file.toString());
			document.setDocumentTemplateId(folder.getDocumentTemplateId());
			this.documentService.save(document);
		}
	}

	@PostConstruct
	public void createProbeDocuments() {
		FolderChain documentFolder = this.foldersFactory.getDocumentFolder();
		this.createDocument("/examples/java-ocr-1.png", documentFolder);

		FolderChain simpleFolder = this.foldersFactory.getSimplesFolder();
		this.createDocument("/examples/java-ocr-1.png", simpleFolder);
		this.createDocument("/examples/java-ocr-2.png", simpleFolder);
		this.createDocument("/examples/java-ocr-3.png", simpleFolder);
		this.createDocument("/examples/java-ocr-4.png", simpleFolder);
	}

}
