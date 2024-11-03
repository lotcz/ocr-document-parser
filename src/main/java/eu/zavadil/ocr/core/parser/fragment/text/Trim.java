package eu.zavadil.ocr.core.parser.fragment.text;

import eu.zavadil.ocr.core.parser.fragment.FragmentPipeLine;
import eu.zavadil.ocr.data.FragmentTemplate;
import org.springframework.stereotype.Component;

@Component
public class Trim extends FragmentPipeLine<String> {
	@Override
	public String processInternal(String input, FragmentTemplate settings) {
		return input.trim();
	}
}
