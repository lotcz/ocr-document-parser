package eu.zavadil.ocr.data.parsed.document;

import jakarta.persistence.Column;
import jakarta.persistence.MappedSuperclass;
import lombok.Data;
import lombok.EqualsAndHashCode;

@EqualsAndHashCode(callSuper = true)
@Data
@MappedSuperclass
public class DocumentStubBase extends DocumentBase {

	@Column(name = "folder_id", nullable = false)
	int folderId;

	@Column(name = "document_template_id", nullable = true)
	Integer documentTemplateId = null;

}
