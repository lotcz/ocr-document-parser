package eu.zavadil.ocr.data.parsed.page;

import jakarta.persistence.Column;
import jakarta.persistence.MappedSuperclass;
import lombok.Data;
import lombok.EqualsAndHashCode;

@EqualsAndHashCode(callSuper = true)
@Data
@MappedSuperclass
public class PageStubBase extends PageBase {

	@Column(name = "document_id", nullable = false)
	int documentId;

	@Column(name = "page_template_id", nullable = true)
	Integer pageTemplateId;

}
