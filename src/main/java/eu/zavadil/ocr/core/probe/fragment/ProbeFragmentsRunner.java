package eu.zavadil.ocr.core.probe.fragment;

import eu.zavadil.ocr.core.parser.FragmentParser;
import eu.zavadil.ocr.core.storage.FileStorage;
import eu.zavadil.ocr.core.storage.StorageFile;
import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.io.*;

@Component
@Slf4j
public class ProbeFragmentsRunner {

	@Autowired
	ProbeFragments probeFragments;

	@Autowired
	FragmentParser fragmentParser;

	@Autowired
	FileStorage fileStorage;

	@PostConstruct
	public void init() {
		log.info("RUNNING FRAGMENTS PROBE");
		log.info("\n\n" + this.runProbes().toString());
	}

	public ProbeFragmentResult runProbe(ProbeFragment probeFragment) {
		StorageFile file = this.fileStorage.getFile(probeFragment.getPath());

		if (!file.exists()) {
			try {
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
