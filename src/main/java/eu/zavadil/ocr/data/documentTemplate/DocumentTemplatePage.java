package eu.zavadil.ocr.data.documentTemplate;

import eu.zavadil.java.spring.common.entity.EntityBase;
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
	name = "document_template_page",
	indexes = {
		@Index(columnList = "parentDocumentTemplateId")
	}
)
public class DocumentTemplatePage extends EntityBase {

	private int page;

	@Column(name = "parent_document_template_id")
	private int parentDocumentTemplateId;

	@Column(name = "document_template_id")
	private int documentTemplateId;

}
