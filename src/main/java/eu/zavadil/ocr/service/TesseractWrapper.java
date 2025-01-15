package eu.zavadil.ocr.service;

import eu.zavadil.ocr.data.template.FragmentTemplate;
import eu.zavadil.ocr.storage.StorageFile;
import net.sourceforge.tess4j.Tesseract;
import net.sourceforge.tess4j.TesseractException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.io.File;

@Component
public class TesseractWrapper {

	@Autowired
	Tesseract tesseract;

	public String process(File file, String language) {
		try {
			this.tesseract.setLanguage(language);
			return this.tesseract.doOCR(file);
		} catch (TesseractException e) {
			throw new RuntimeException("TesseractException!", e);
		}
	}

	public String process(StorageFile fragment, FragmentTemplate fragmentTemplate) {
		return this.process(fragment.asFile(), fragmentTemplate.getLanguageEffective().name());
	}

}
