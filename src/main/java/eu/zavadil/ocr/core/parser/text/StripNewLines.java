package eu.zavadil.ocr.core.parser.text;

import eu.zavadil.ocr.core.pipe.PipeLineBase;
import eu.zavadil.ocr.core.settings.ProcessingSettings;
import org.springframework.stereotype.Component;

@Component
public class StripNewLines extends PipeLineBase<String> {
	@Override
	public String processInternal(String input, ProcessingSettings settings) {
		return input.replace("\n", " ");
	}
}
