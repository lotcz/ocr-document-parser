package eu.zavadil.ocr.data.template;

import com.fasterxml.jackson.annotation.JsonIgnore;
import eu.zavadil.ocr.data.Language;
import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;

@EqualsAndHashCode(callSuper = true)
@Data
@Entity
@Table(indexes = {
	@Index(columnList = "document_template_id")
})
public class FragmentTemplate extends TemplateBase {

	@ManyToOne
	@JsonIgnore
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
