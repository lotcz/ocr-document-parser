package eu.zavadil.ocr.data.fragmentTemplate;

import com.fasterxml.jackson.annotation.JsonIgnore;
import eu.zavadil.ocr.data.Language;
import eu.zavadil.ocr.data.documentTemplate.DocumentTemplate;
import jakarta.persistence.Entity;
import jakarta.persistence.Index;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.EqualsAndHashCode;

@EqualsAndHashCode(callSuper = true)
@Data
@Entity
@Table(indexes = {
	@Index(columnList = "document_template_id")
})
public class FragmentTemplate extends FragmentTemplateBase {

	@ManyToOne
	@JsonIgnore
	private DocumentTemplate documentTemplate;

	public Language getLanguageEffective() {
		if (this.getLanguage() != null) return this.getLanguage();
		return this.getDocumentTemplate().getLanguage();
	}

}
