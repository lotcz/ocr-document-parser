package eu.zavadil.ocr.core.parser.fragment.text;

import eu.zavadil.ocr.core.parser.fragment.FragmentPipeLine;
import eu.zavadil.ocr.data.template.FragmentTemplate;
import org.springframework.stereotype.Component;

@Component
public class StripNewLines extends FragmentPipeLine<String> {
	@Override
	public String processInternal(String input, FragmentTemplate settings) {
		return input.replace("\n", " ");
	}
}
