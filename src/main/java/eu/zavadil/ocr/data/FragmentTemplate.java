package eu.zavadil.ocr.data;

import lombok.Data;

@Data
public class FragmentTemplate extends TemplateBase {

	private DocumentTemplate documentTemplate;

	private double top;

	private double left;

	private double width;

	private double height;

	public Language getLanguageEffective() {
		if (this.getLanguage() != null) return this.getLanguage();
		return this.getDocumentTemplate().getLanguage();
	}

}
