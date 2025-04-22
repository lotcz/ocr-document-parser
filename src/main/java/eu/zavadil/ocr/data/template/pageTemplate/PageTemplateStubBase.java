package eu.zavadil.ocr.data.template.pageTemplate;

import jakarta.persistence.Column;
import jakarta.persistence.MappedSuperclass;
import lombok.Data;
import lombok.EqualsAndHashCode;

@EqualsAndHashCode(callSuper = true)
@Data
@MappedSuperclass
public class PageTemplateStubBase extends PageTemplateBase {

	@Column(name = "document_template_id", nullable = false)
	private Integer documentTemplateId;

	@Column(name = "inherit_from_page_template_id")
	private Integer inheritFromPageTemplateId;

}
