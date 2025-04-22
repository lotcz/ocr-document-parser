package eu.zavadil.ocr.data.parsed.document;

import jakarta.persistence.Entity;
import jakarta.persistence.Index;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.EqualsAndHashCode;

@EqualsAndHashCode(callSuper = true)
@Data
@Entity
@Table(
	name = "document",
	indexes = {
		@Index(columnList = "folderId"),
		@Index(columnList = "documentTemplateId"),
		@Index(columnList = "state")
	}
)
public class DocumentStub extends DocumentStubBase {

	@Override
	public String toString() {
		return String.format("[DocumentStub][%d/%s]", this.getId(), this.getImagePath());
	}
}
