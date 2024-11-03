package eu.zavadil.ocr.core.probe.fragment;

import eu.zavadil.ocr.core.parser.FragmentParser;
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
public class ProbeFragmentsRunner {

	@Value("${eu.zavadil.ocr.home}")
	String homeDir;

	@Autowired
	ProbeFragments probeFragments;

	@Autowired
	FragmentParser fragmentParser;

	@PostConstruct
	public void init() {
		log.info("RUNNING FRAGMENTS PROBE");
		log.info("\n\n" + this.runProbes().toString());
	}

	public ProbeFragmentResult runProbe(ProbeFragment probeFragment) {
		Path tmpPath = Path.of(this.homeDir, "tmp", probeFragment.getPath());
		ImageFileWrapper file = ImageFileWrapper.of(tmpPath);

		if (!file.exists()) {
			try {
				file.createDirectories();
				File targetFile = file.asFile();
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
			this.fragmentParser.process(file, probeFragment.getTemplate())
		);
	}

	public ProbeFragmentResults runProbes() {
		ProbeFragmentResults probeResults = new ProbeFragmentResults();
		this.probeFragments.forEach(pf -> probeResults.add(this.runProbe(pf)));
		return probeResults;
	}

}
