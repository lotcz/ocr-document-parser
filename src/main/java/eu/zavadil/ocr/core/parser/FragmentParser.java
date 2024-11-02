package eu.zavadil.ocr.core.parser;

import eu.zavadil.ocr.core.parser.img.ImageFileWrapper;
import eu.zavadil.ocr.core.parser.img.ImagePreProcess;
import eu.zavadil.ocr.core.parser.ocr.TesseractOcr;
import eu.zavadil.ocr.core.parser.text.TextPostProcess;
import eu.zavadil.ocr.core.pipe.Pipe;
import eu.zavadil.ocr.core.settings.ProcessingSettings;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class FragmentParser implements Pipe<ImageFileWrapper, String> {

	@Autowired
	ImagePreProcess imagePreProcess;

	@Autowired
	TesseractOcr tesseractOcr;

	@Autowired
	TextPostProcess textPostProcess;

	@Override
	public String process(ImageFileWrapper input, ProcessingSettings settings) {
		ImageFileWrapper processedImage = this.imagePreProcess.process(input, settings);
		String rawText = this.tesseractOcr.process(processedImage, settings);
		return this.textPostProcess.process(rawText, settings);
	}

}
