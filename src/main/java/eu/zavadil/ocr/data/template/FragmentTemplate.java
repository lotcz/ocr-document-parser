package eu.zavadil.ocr.data.template;

import eu.zavadil.ocr.data.Language;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.ManyToOne;
import lombok.Data;
import lombok.EqualsAndHashCode;

@EqualsAndHashCode(callSuper = true)
@Data
@Entity
public class FragmentTemplate extends TemplateBase {

	@ManyToOne
	private DocumentTemplate documentTemplate;

	private double top = 0;

	@Column(name = "lft")
	private double left = 0;

	private double width = 1;

	private double height = 1;

	public Language getLanguageEffective() {
		if (this.getLanguage() != null) return this.getLanguage();
		return this.getDocumentTemplate().getLanguage();
	}

	private static double toPortion(double val) {
		return Math.max(0, Math.min(val, 1));
	}

	public void setTop(double val) {
		this.top = toPortion(val);
	}

	public void setLeft(double val) {
		this.left = toPortion(val);
	}

	public void setWidth(double val) {
		this.width = toPortion(val);
	}

	public void setHeight(double val) {
		this.height = toPortion(val);
	}
}
