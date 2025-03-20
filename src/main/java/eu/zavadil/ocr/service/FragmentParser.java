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

			try (Mat inverted = this.openCv.invert(raw)) {
				fragmentImage = fragmentImage.getNext();
				this.openCv.save(fragmentImage, inverted);

				try (Mat scaled = this.openCv.resize(raw, 2)) {
					fragmentImage = fragmentImage.getNext();
					this.openCv.save(fragmentImage, scaled);

					try (Mat baw = this.openCv.threshold(inverted, true)) {
						fragmentImage = fragmentImage.getNext();
						this.openCv.save(fragmentImage, baw);
						
						Mat bw = this.openCv.threshold(baw);
						fragmentImage = fragmentImage.getNext();
						this.openCv.save(fragmentImage, bw);
/*
						Mat gs = this.openCv.grayscale(baw);
						fragmentImage = fragmentImage.getNext();
						this.openCv.save(fragmentImage, gs);
						*/
						String rawText = this.tesseract.process(fragmentImage, template);
						String processedText = this.postProcessText(rawText);
						fragment.setText(processedText);
					}
				}
			}
		}

		return fragment;
	}

	public String postProcessText(String raw) {
		return StringUtils.safeTrim(StringUtils.stripNewLines(raw));
	}

}
