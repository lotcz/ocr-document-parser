package eu.zavadil.ocr.service.parser;

import eu.zavadil.java.util.FileNameUtils;
import eu.zavadil.java.util.StringUtils;
import eu.zavadil.ocr.data.parsed.fragment.FragmentStub;
import eu.zavadil.ocr.data.template.fragmentTemplate.FragmentTemplate;
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

	boolean keepProcessed = false;

	boolean saveSteps = false;

	private StorageFile saveProcessedImage(StorageFile orig, Mat data, String name) {
		StorageFile img = orig.getParentDirectory().getFile(
			FileNameUtils.changeBaseName(orig.getFileName(), String.format("%s-%s", orig.getBaseName(), name))
		);
		this.openCv.save(img, data);
		return img;
	}

	public FragmentStub process(FragmentStub fragment, FragmentTemplate template) {
		StorageFile fragmentImage = this.imageService.getImage(fragment.getImagePath());

		try (Mat raw = this.openCv.load(fragmentImage)) {
			try (Mat gs = this.openCv.grayscale(raw)) {
				if (this.saveSteps) this.saveProcessedImage(fragmentImage, gs, "grayscale");
				try (Mat scaled = this.openCv.resize(gs, 2)) {
					if (this.saveSteps) this.saveProcessedImage(fragmentImage, scaled, "scaled");
					try (Mat thresh0 = this.openCv.threshold(scaled, true)) {
						StorageFile processedImage = this.saveProcessedImage(fragmentImage, thresh0, "thresh0");
						String rawText = this.tesseract.process(processedImage, template);
						String processedText = this.postProcessText(rawText);
						fragment.setText(processedText);
						if (!this.keepProcessed) processedImage.delete();
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
