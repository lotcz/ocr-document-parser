package eu.zavadil.ocr.data.template.fragmentTemplate;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Index;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.EqualsAndHashCode;

@EqualsAndHashCode(callSuper = true)
@Data
@Entity
@Table(
	name = "fragment_template",
	indexes = {
		@Index(columnList = "document_template_id, name", unique = true)
	}
)
public class FragmentTemplateStub extends FragmentTemplateBase {

	@Column(name = "page_template_id")
	private int pageTemplateId;

	@Column(name = "language_id")
	private Integer languageId;

	@Override
	public String toString() {
		return String.format("[FragmentTemplateStub][%d/%s]", this.getId(), this.getName());
	}
}
