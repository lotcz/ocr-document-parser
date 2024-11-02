package eu.zavadil.ocr.core.settings;

import org.springframework.stereotype.Component;

@Component
public class GlobalSettings extends ProcessingSettings {

	public GlobalSettings() {
		super();

		this.setLanguage(Language.eng);
		this.setFragmentMinWidth(900);
		this.setFragmentMinHeight(150);
	}

}
