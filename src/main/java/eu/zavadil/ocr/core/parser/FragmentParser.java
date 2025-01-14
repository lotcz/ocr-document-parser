package eu.zavadil.ocr.core.parser;

import eu.zavadil.ocr.core.parser.fragment.img.ImagePreProcess;
import eu.zavadil.ocr.core.parser.fragment.ocr.TesseractOcr;
import eu.zavadil.ocr.core.parser.fragment.text.TextPostProcess;
import eu.zavadil.ocr.core.pipe.Pipe;
import eu.zavadil.ocr.core.storage.StorageFile;
import eu.zavadil.ocr.data.document.Fragment;
import eu.zavadil.ocr.data.template.FragmentTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class FragmentParser implements Pipe<StorageFile, Fragment, FragmentTemplate> {

	@Autowired
	ImagePreProcess imagePreProcess;

	@Autowired
	TesseractOcr tesseractOcr;

	@Autowired
	TextPostProcess textPostProcess;

	@Override
	public Fragment process(StorageFile input, FragmentTemplate template) {
		StorageFile processedImage = this.imagePreProcess.process(input, template);
		String rawText = this.tesseractOcr.process(processedImage, template);
		String processedText = this.textPostProcess.process(rawText, template);

		Fragment fragment = new Fragment();
		fragment.setFragmentTemplate(template);
		fragment.setImagePath(input.toString());

		fragment.setText(processedText);

		return fragment;
	}

}
