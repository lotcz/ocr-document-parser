package eu.zavadil.ocr.data.fragmentTemplate;

import com.fasterxml.jackson.annotation.JsonIgnore;
import eu.zavadil.ocr.data.Language;
import eu.zavadil.ocr.data.documentTemplate.DocumentTemplate;
import jakarta.annotation.Nullable;
import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;

@EqualsAndHashCode(callSuper = true)
@Data
@Entity
@Table(indexes = {
	@Index(columnList = "document_template_id")
})
public class FragmentTemplate extends FragmentTemplateBase {

	@Nullable
	@Enumerated(EnumType.STRING)
	private Language language;

	@ManyToOne
	@JsonIgnore
	private DocumentTemplate documentTemplate;

	public Language getLanguageEffective() {
		if (this.getLanguage() != null) return this.getLanguage();
		return this.getDocumentTemplate().getLanguage();
	}

}
