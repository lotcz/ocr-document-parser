package eu.zavadil.ocr.core.probe;

import eu.zavadil.ocr.core.parser.FragmentParser;
import eu.zavadil.ocr.core.parser.img.ImageFileWrapper;
import eu.zavadil.ocr.core.settings.GlobalSettings;
import eu.zavadil.ocr.core.settings.ProcessingSettings;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.io.*;
import java.nio.file.Files;
import java.nio.file.Path;

@Component
public class ProbeRunner {

	@Value("${eu.zavadil.ocr.home}")
	String homeDir;

	@Autowired
	ProbeFiles probeFiles;

	@Autowired
	FragmentParser fragmentParser;

	@Autowired
	GlobalSettings globalSettings;

	public ProbeResult runProbe(ProbeFile probeFile, ProcessingSettings settings) {
		Path tmpPath = Path.of(this.homeDir, "tmp", probeFile.getPath());

		if (!Files.exists(tmpPath)) {
			try {
				Files.createDirectories(tmpPath.getParent());
				File targetFile = tmpPath.toFile();
				OutputStream outStream = new FileOutputStream(targetFile);
				InputStream inputStream = probeFile.getImageStream();
				inputStream.transferTo(outStream);
				inputStream.close();
				outStream.close();
			} catch (IOException e) {
				throw new RuntimeException("Error when writing tmp file", e);
			}
		}

		ProcessingSettings fileSettings = settings.addChild();
		fileSettings.setLanguage(probeFile.getLanguage());
		return new ProbeResult(
			probeFile,
			this.fragmentParser.process(ImageFileWrapper.of(tmpPath), fileSettings)
		);
	}

	public ProbeResults runProbes() {
		ProbeResults probeResults = new ProbeResults();
		ProcessingSettings probeSettings = this.globalSettings.addChild();
		this.probeFiles.forEach(pf -> probeResults.add(this.runProbe(pf, probeSettings)));
		return probeResults;
	}

}
