package eu.zavadil.ocr.data.parsed.fragment;

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
	name = "fragment",
	indexes = {
		@Index(columnList = "document_id, fragment_template_id", unique = true)
	}
)
public class FragmentStub extends FragmentBase {

	@Column(name = "page_id")
	private int pageId;

	@Column(name = "fragment_template_id")
	private int fragmentTemplateId;

	@Override
	public String toString() {
		return String.format("[FragmentStub][%d/%s]", this.getId(), this.getText());
	}
}
