package eu.zavadil.ocr.data.document;

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

	@Column(name = "document_template_id", nullable = false)
	int documentTemplateId = 0;

	@Column(name = "parent_document_id", nullable = true)
	Integer parentDocumentId;

}
