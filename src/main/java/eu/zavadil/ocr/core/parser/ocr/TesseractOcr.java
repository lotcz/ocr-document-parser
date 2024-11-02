package eu.zavadil.ocr.core.parser.ocr;

import eu.zavadil.ocr.core.parser.img.ImageFileWrapper;
import eu.zavadil.ocr.core.pipe.Pipe;
import eu.zavadil.ocr.core.settings.ProcessingSettings;
import net.sourceforge.tess4j.Tesseract;
import net.sourceforge.tess4j.TesseractException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class TesseractOcr implements Pipe<ImageFileWrapper, String> {

	@Autowired
	Tesseract tesseract;

	public String process(ImageFileWrapper fragment, ProcessingSettings settings) {
		try {
			this.tesseract.setLanguage(settings.getLanguage().name());
			return this.tesseract.doOCR(fragment.asFile());
		} catch (TesseractException e) {
			throw new RuntimeException("TesseractException!", e);
		}
	}
}
