package eu.zavadil.ocr.data.template.documentTemplate;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.EqualsAndHashCode;

@EqualsAndHashCode(callSuper = true)
@Data
@Entity
@Table(name = "document_template")
public class DocumentTemplateStub extends DocumentTemplateStubBase {

	@Override
	public String toString() {
		return String.format("[DocumentTemplateStub][%d/%s]", this.getId(), this.getName());
	}
}
