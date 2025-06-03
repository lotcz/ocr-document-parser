package eu.zavadil.ocr.service.parser;

import eu.zavadil.java.ocr.common.parsed.fragment.FragmentStub;
import eu.zavadil.java.ocr.common.template.fragment.FragmentTemplate;
import eu.zavadil.java.util.StringUtils;
import eu.zavadil.ocr.service.ImageService;
import eu.zavadil.ocr.storage.StorageFile;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
@Slf4j
public class FragmentParser {

	@Autowired
	ImageService imageService;

	@Autowired
	ImageParser imageParser;

	public FragmentStub process(FragmentStub fragment, FragmentTemplate template) {
		StorageFile fragmentImage = this.imageService.getImage(fragment.getImagePath());
		String parsedText = this.imageParser.process(fragmentImage, template.getLanguageEffective().getTesseractCode());
		String processedText = this.postProcessText(parsedText);
		fragment.setText(processedText);
		return fragment;
	}

	public String postProcessText(String raw) {
		return StringUtils.safeTrim(StringUtils.stripNewLines(raw));
	}

}
