package eu.zavadil.ocr.data.documentTemplate;

import eu.zavadil.java.spring.common.entity.EntityBase;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import lombok.Data;
import lombok.EqualsAndHashCode;

@EqualsAndHashCode(callSuper = true)
@Data
@Entity
public class DocumentTemplatePage extends EntityBase {

	private int page;

	@Column(name = "parent_document_template_id")
	private int parentDocumentTemplateId;

	@Column(name = "document_template_id")
	private int documentTemplateId;

}
