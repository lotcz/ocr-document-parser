package eu.zavadil.ocr.core.probe.document;

import eu.zavadil.ocr.core.parser.DocumentParser;
import eu.zavadil.ocr.core.parser.fragment.img.ImageFileWrapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.io.*;
import java.nio.file.Files;
import java.nio.file.Path;

@Component
public class ProbeDocumentRunner {

	@Value("${eu.zavadil.ocr.home}")
	String homeDir;

	@Autowired
	ProbeDocument probeDocument;

	@Autowired
	DocumentParser documentParser;

	public ProbeDocumentResult runProbe() {
		Path tmpPath = Path.of(this.homeDir, "tmp", this.probeDocument.getPath());

		if (!Files.exists(tmpPath)) {
			try {
				Files.createDirectories(tmpPath.getParent());
				File targetFile = tmpPath.toFile();
				OutputStream outStream = new FileOutputStream(targetFile);
				InputStream inputStream = this.probeDocument.getImageStream();
				inputStream.transferTo(outStream);
				inputStream.close();
				outStream.close();
			} catch (IOException e) {
				throw new RuntimeException("Error when writing tmp file", e);
			}
		}

		return new ProbeDocumentResult(
			this.probeDocument,
			this.documentParser.process(ImageFileWrapper.of(tmpPath), this.probeDocument.getDocumentTemplate())
		);
	}

}
