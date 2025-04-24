package eu.zavadil.ocr.probe;

import eu.zavadil.ocr.data.parsed.document.DocumentStubWithPages;
import eu.zavadil.ocr.data.parsed.folder.FolderStub;
import eu.zavadil.ocr.service.DocumentService;
import eu.zavadil.ocr.service.ImageService;
import eu.zavadil.ocr.storage.ImageFile;
import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.io.*;

@Component
@Slf4j
public class ProbeDocumentFactory {

	@Autowired
	ProbeFoldersFactory foldersFactory;

	@Autowired
	ImageService imageService;

	@Autowired
	DocumentService documentService;

	private InputStream getImageStream(String path) {
		InputStream is = ProbeDocumentFactory.class.getResourceAsStream(path);
		if (is == null)
			throw new RuntimeException(String.format("Error when opening resource file %s", path));
		return is;
	}

	private void createDocument(String path, FolderStub folder) {
		ImageFile file = this.imageService.getImage(path);

		if (!file.exists()) {
			try {
				file.createDirectories();
				File targetFile = file.asFile();
				OutputStream outStream = new FileOutputStream(targetFile);
				InputStream inputStream = this.getImageStream(path);
				inputStream.transferTo(outStream);
				inputStream.close();
				outStream.close();
			} catch (IOException e) {
				throw new RuntimeException("Error when writing tmp file", e);
			}
		}

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
		FolderStub documentFolder = this.foldersFactory.getDocumentFolder();
		this.createDocument("/examples/java-ocr-1.png", documentFolder);

		FolderStub simpleFolder = this.foldersFactory.getSimplesFolder();
		this.createDocument("/examples/java-ocr-1.png", simpleFolder);
		this.createDocument("/examples/java-ocr-2.png", simpleFolder);
		this.createDocument("/examples/java-ocr-3.png", simpleFolder);
		this.createDocument("/examples/java-ocr-4.png", simpleFolder);
	}

}
