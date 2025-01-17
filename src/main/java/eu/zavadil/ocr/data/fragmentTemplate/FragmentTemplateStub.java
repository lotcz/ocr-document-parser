package eu.zavadil.ocr.data.fragmentTemplate;

import jakarta.persistence.Entity;
import jakarta.persistence.Index;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.EqualsAndHashCode;

@EqualsAndHashCode(callSuper = true)
@Data
@Entity
@Table(indexes = {
	@Index(columnList = "document_template_id")
})
public class FragmentTemplateStub extends FragmentTemplateBase {

	private Integer documentTemplateId;

}
