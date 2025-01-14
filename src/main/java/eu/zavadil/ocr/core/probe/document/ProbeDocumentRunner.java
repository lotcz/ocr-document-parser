package eu.zavadil.ocr.core.probe.document;

import eu.zavadil.ocr.core.parser.DocumentParser;
import eu.zavadil.ocr.data.document.Document;
import eu.zavadil.ocr.storage.FileStorage;
import eu.zavadil.ocr.storage.StorageFile;
import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.io.*;

@Component
@Slf4j
public class ProbeDocumentRunner {

	@Autowired
	ProbeDocumentFactory probeDocumentFactory;

	@Autowired
	DocumentParser documentParser;

	@Autowired
	FileStorage fileStorage;

	@PostConstruct
	public void init() {
		log.info("RUNNING DOCUMENT PROBE");
		log.info("\n\n" + this.runProbe().toString());
	}

	public ProbeDocumentResult runProbe() {
		ProbeDocument probeDocument = this.probeDocumentFactory.createProbeDocument();
		StorageFile file = this.fileStorage.getFile(probeDocument.getPath());

		if (!file.exists()) {
			try {
				File targetFile = file.asFile();
				OutputStream outStream = new FileOutputStream(targetFile);
				InputStream inputStream = probeDocument.getImageStream();
				inputStream.transferTo(outStream);
				inputStream.close();
				outStream.close();
			} catch (IOException e) {
				throw new RuntimeException("Error when writing tmp file", e);
			}
		}

		Document document = new Document();
		document.setDocumentTemplate(probeDocument.getDocumentTemplate());
		document.setImagePath(probeDocument.getPath());

		return new ProbeDocumentResult(probeDocument, this.documentParser.parse(document));
	}

}
