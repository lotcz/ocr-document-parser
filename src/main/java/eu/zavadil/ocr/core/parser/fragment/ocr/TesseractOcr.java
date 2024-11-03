package eu.zavadil.ocr.core.parser.fragment.ocr;

import eu.zavadil.ocr.core.parser.fragment.img.ImageFileWrapper;
import eu.zavadil.ocr.core.pipe.Pipe;
import eu.zavadil.ocr.data.template.FragmentTemplate;
import net.sourceforge.tess4j.Tesseract;
import net.sourceforge.tess4j.TesseractException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class TesseractOcr implements Pipe<ImageFileWrapper, String, FragmentTemplate> {

	@Autowired
	Tesseract tesseract;

	public String process(ImageFileWrapper fragment, FragmentTemplate fragmentTemplate) {
		try {
			this.tesseract.setLanguage(fragmentTemplate.getLanguageEffective().name());
			return this.tesseract.doOCR(fragment.asFile());
		} catch (TesseractException e) {
			throw new RuntimeException("TesseractException!", e);
		}
	}
}
