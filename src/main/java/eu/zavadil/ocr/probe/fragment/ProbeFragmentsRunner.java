package eu.zavadil.ocr.probe.fragment;

import eu.zavadil.ocr.data.fragment.Fragment;
import eu.zavadil.ocr.service.FragmentParser;
import eu.zavadil.ocr.storage.FileStorage;
import eu.zavadil.ocr.storage.StorageFile;
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

		Fragment fragment = new Fragment();
		fragment.setFragmentTemplate(probeFragment.getTemplate());
		fragment.setImagePath(probeFragment.getPath());

		return new ProbeFragmentResult(probeFragment, this.fragmentParser.process(fragment));
	}

	public ProbeFragmentResults runProbes() {
		ProbeFragmentResults probeResults = new ProbeFragmentResults();
		this.probeFragments.forEach(pf -> probeResults.add(this.runProbe(pf)));
		return probeResults;
	}

}
