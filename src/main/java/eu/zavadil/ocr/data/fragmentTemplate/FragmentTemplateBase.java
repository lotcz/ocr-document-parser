package eu.zavadil.ocr.data.fragmentTemplate;

import com.fasterxml.jackson.annotation.JsonIgnore;
import eu.zavadil.ocr.data.Language;
import eu.zavadil.ocr.data.documentTemplate.DocumentTemplate;
import eu.zavadil.ocr.data.documentTemplate.TemplateBase;
import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;

@EqualsAndHashCode(callSuper = true)
@Data
@MappedSuperclass
public class FragmentTemplateBase extends TemplateBase {

	private double top = 0;

	@Column(name = "lft")
	private double left = 0;

	private double width = 1;

	private double height = 1;

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
