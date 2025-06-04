package eu.zavadil.ocr.service.parser;

import eu.zavadil.java.util.FileNameUtils;
import eu.zavadil.ocr.service.ImageService;
import eu.zavadil.ocr.service.OpenCvWrapper;
import eu.zavadil.ocr.service.TesseractWrapper;
import eu.zavadil.ocr.storage.StorageFile;
import lombok.extern.slf4j.Slf4j;
import org.bytedeco.opencv.opencv_core.Mat;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
@Slf4j
public class ImageParser {

	@Autowired
	ImageService imageService;

	@Autowired
	OpenCvWrapper openCv;

	@Autowired
	TesseractWrapper tesseract;

	@Value("${eu.zavadil.ocr.parser.keep-processing-steps:false}")
	boolean saveSteps;

	@Value("${eu.zavadil.ocr.parser.keep-processed:false}")
	boolean keepProcessed;

	private StorageFile saveProcessedImage(StorageFile orig, Mat data, String name) {
		StorageFile img = orig.getParentDirectory().getFile(
			FileNameUtils.changeBaseName(orig.getFileName(), String.format("%s-%s", orig.getBaseName(), name))
		);
		this.openCv.save(img, data);
		return img;
	}

	public String process(StorageFile image, String language) {
		try (Mat raw = this.openCv.load(image)) {
			try (Mat gs = this.openCv.grayscale(raw)) {
				if (this.saveSteps) this.saveProcessedImage(image, gs, "grayscale");
				try (Mat scaled = this.openCv.resize(gs, 2)) {
					if (this.saveSteps) this.saveProcessedImage(image, scaled, "scaled");
					try (Mat thresh0 = this.openCv.threshold(scaled, true, false)) {
						StorageFile processedImage = this.saveProcessedImage(image, thresh0, "thresh0");
						String rawText = this.tesseract.process(processedImage.asFile(), language);
						if (!this.keepProcessed) processedImage.delete();
						return rawText;
					}
				}
			}
		}
	}

}
