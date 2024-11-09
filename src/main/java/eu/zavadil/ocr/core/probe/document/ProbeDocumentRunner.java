package eu.zavadil.ocr.core.probe.document;

import eu.zavadil.ocr.core.parser.DocumentParser;
import eu.zavadil.ocr.core.parser.fragment.img.ImageFileWrapper;
import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.io.*;
import java.nio.file.Path;

@Component
@Slf4j
public class ProbeDocumentRunner {

	@Value("${eu.zavadil.ocr.home}")
	String homeDir;

	@Autowired
	ProbeDocumentFactory probeDocumentFactory;

	@Autowired
	DocumentParser documentParser;

	@PostConstruct
	public void init() {
		log.info("RUNNING DOCUMENT PROBE");
		log.info("\n\n" + this.runProbe().toString());
	}

	public ProbeDocumentResult runProbe() {
		ProbeDocument probeDocument = this.probeDocumentFactory.createProbeDocument();
		Path tmpPath = Path.of(this.homeDir, "tmp", probeDocument.getPath());
		ImageFileWrapper file = ImageFileWrapper.of(tmpPath);

		if (!file.exists()) {
			try {
				file.createDirectories();
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

		return new ProbeDocumentResult(
			probeDocument,
			this.documentParser.process(ImageFileWrapper.of(tmpPath), probeDocument.getDocumentTemplate())
		);
	}

}
