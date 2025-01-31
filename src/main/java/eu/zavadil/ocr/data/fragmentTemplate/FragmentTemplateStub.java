package eu.zavadil.ocr.data.fragmentTemplate;

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

	@Column(name = "document_template_id")
	private Integer documentTemplateId;

	@Override
	public String toString() {
		return String.format("[FragmentTemplateStub][%d/%s]", this.getId(), this.getName());
	}
}
