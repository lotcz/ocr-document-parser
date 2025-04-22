package eu.zavadil.ocr.data.template.fragmentTemplate;

import com.fasterxml.jackson.annotation.JsonIgnore;
import eu.zavadil.ocr.data.language.Language;
import eu.zavadil.ocr.data.template.pageTemplate.PageTemplate;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.EqualsAndHashCode;

@EqualsAndHashCode(callSuper = true)
@Data
@Entity
@Table(name = "fragment_template")
public class FragmentTemplate extends FragmentTemplateBase {
	
	@ManyToOne
	@JsonIgnore
	private PageTemplate pageTemplate;

	public Language getLanguageEffective() {
		if (this.getLanguage() != null) return this.getLanguage();
		return this.getPageTemplate().getDocumentTemplate().getLanguage();
	}

	@ManyToOne
	@JoinColumn(name = "language_id")
	private Language language;

	@Override
	public String toString() {
		return String.format("[FragmentTemplate][%d/%s]", this.getId(), this.getName());
	}
}
