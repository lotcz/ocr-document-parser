package eu.zavadil.ocr.data.documentTemplate;

import eu.zavadil.ocr.data.Language;
import jakarta.persistence.Entity;
import jakarta.persistence.Index;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.EqualsAndHashCode;

@EqualsAndHashCode(callSuper = true)
@Data
@Entity
@Table(
	name = "document_template",
	indexes = {
		@Index(columnList = "name"),
		@Index(columnList = "isMulti")
	}
)
public class DocumentTemplateStub extends DocumentTemplateBase {

	public DocumentTemplateStub() {
		super();
	}

	public DocumentTemplateStub(Integer id, String name, Language lang) {
		super();
		this.setId(id);
		this.setName(name);
		this.setLanguage(lang);
	}

	@Override
	public String toString() {
		return String.format("[DocumentTemplateStub][%d/%s]", this.getId(), this.getName());
	}
}
