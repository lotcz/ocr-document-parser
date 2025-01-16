package eu.zavadil.ocr.service.parser;

import eu.zavadil.java.util.StringUtils;
import eu.zavadil.ocr.data.document.Fragment;
import eu.zavadil.ocr.service.ImageService;
import eu.zavadil.ocr.service.OpenCvWrapper;
import eu.zavadil.ocr.service.TesseractWrapper;
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

	public Fragment process(Fragment fragment) {
		StorageFile fragmentImage = this.imageService.getFile(fragment.getImagePath());

		try (Mat raw = this.openCv.load(fragmentImage)) {
			Mat scaled = this.openCv.upscale(raw, 1.5);
			Mat inverted = this.openCv.invert(scaled);
			Mat baw = this.openCv.blackAndWhite(inverted, true);
			StorageFile processed = fragmentImage.createNext();
			this.openCv.save(processed, baw);

			String rawText = this.tesseract.process(processed, fragment.getFragmentTemplate());
			String processedText = this.postProcessText(rawText);
			fragment.setText(processedText);
		}

		return fragment;
	}

	public String postProcessText(String raw) {
		return StringUtils.safeTrim(StringUtils.stripNewLines(raw));
	}

}
