package eu.zavadil.ocr.core.parser.text;

import eu.zavadil.ocr.core.pipe.PipeLineBase;
import eu.zavadil.ocr.core.settings.ProcessingSettings;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class TextPostProcess extends PipeLineBase<String> {

	@Autowired
	public TextPostProcess(
		Trim trim,
		StripNewLines stripNewLines
	) {
		this.add(stripNewLines);
		this.add(trim);
	}

	@Override
	public String process(String input, ProcessingSettings settings) {
		if (input == null || input.isBlank()) return null;
		return this.next.process(input, settings);
	}
}
