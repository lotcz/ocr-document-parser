package eu.zavadil.ocr.core.parser.fragment.text;

import eu.zavadil.ocr.core.parser.fragment.FragmentPipeLine;
import eu.zavadil.ocr.data.template.FragmentTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class TextPostProcess extends FragmentPipeLine<String> {

	@Autowired
	public TextPostProcess(
		Trim trim,
		StripNewLines stripNewLines
	) {
		this.add(stripNewLines);
		this.add(trim);
	}

	@Override
	public String process(String input, FragmentTemplate settings) {
		if (input == null || input.isBlank()) return null;
		return this.next.process(input, settings);
	}
}
