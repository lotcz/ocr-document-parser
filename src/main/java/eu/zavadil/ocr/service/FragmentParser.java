package eu.zavadil.ocr.service;

import eu.zavadil.java.util.StringUtils;
import eu.zavadil.ocr.data.fragment.FragmentStub;
import eu.zavadil.ocr.data.fragmentTemplate.FragmentTemplate;
import eu.zavadil.ocr.storage.StorageFile;
import lombok.extern.slf4j.Slf4j;
import org.bytedeco.opencv.opencv_core.Mat;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
@Slf4j
public class FragmentParser {

	@Autowired
	ImageService imageService;

	@Autowired
	OpenCvWrapper openCv;

	@Autowired
	TesseractWrapper tesseract;

	public FragmentStub process(FragmentStub fragment, FragmentTemplate template) {
		StorageFile fragmentImage = this.imageService.getImage(fragment.getImagePath());

		try (Mat raw = this.openCv.load(fragmentImage)) {
			Mat scaled = this.openCv.resize(raw, 1.5);
			Mat inverted = this.openCv.invert(scaled);
			Mat baw = this.openCv.blackAndWhite(inverted, true);
			StorageFile processed = fragmentImage.getNext();
			this.openCv.save(processed, baw);

			String rawText = this.tesseract.process(processed, template);
			String processedText = this.postProcessText(rawText);
			fragment.setText(processedText);
		}

		return fragment;
	}

	public String postProcessText(String raw) {
		return StringUtils.safeTrim(StringUtils.stripNewLines(raw));
	}

}
