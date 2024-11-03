package eu.zavadil.ocr.core.probe.fragment;

import eu.zavadil.ocr.core.parser.FragmentParser;
import eu.zavadil.ocr.core.parser.fragment.img.ImageFileWrapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.io.*;
import java.nio.file.Files;
import java.nio.file.Path;

@Component
public class ProbeFragmentsRunner {

	@Value("${eu.zavadil.ocr.home}")
	String homeDir;

	@Autowired
	ProbeFragments probeFragments;

	@Autowired
	FragmentParser fragmentParser;

	public ProbeFragmentResult runProbe(ProbeFragment probeFragment) {
		Path tmpPath = Path.of(this.homeDir, "tmp", probeFragment.getPath());

		if (!Files.exists(tmpPath)) {
			try {
				Files.createDirectories(tmpPath.getParent());
				File targetFile = tmpPath.toFile();
				OutputStream outStream = new FileOutputStream(targetFile);
				InputStream inputStream = probeFragment.getImageStream();
				inputStream.transferTo(outStream);
				inputStream.close();
				outStream.close();
			} catch (IOException e) {
				throw new RuntimeException("Error when writing tmp file", e);
			}
		}

		return new ProbeFragmentResult(
			probeFragment,
			this.fragmentParser.process(ImageFileWrapper.of(tmpPath), probeFragment.getTemplate())
		);
	}

	public ProbeFragmentResults runProbes() {
		ProbeFragmentResults probeResults = new ProbeFragmentResults();
		this.probeFragments.forEach(pf -> probeResults.add(this.runProbe(pf)));
		return probeResults;
	}

}
