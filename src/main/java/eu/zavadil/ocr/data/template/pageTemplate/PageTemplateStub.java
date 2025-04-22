package eu.zavadil.ocr.data.template.pageTemplate;

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
	name = "page_template",
	indexes = {
		@Index(columnList = "documentTemplateId,pageNumber"),
	}
)
public class PageTemplateStub extends PageTemplateStubBase {

	@Override
	public String toString() {
		return String.format("[PageTemplateStub][%d/%d]", this.getId(), this.getPageNumber());
	}
}
