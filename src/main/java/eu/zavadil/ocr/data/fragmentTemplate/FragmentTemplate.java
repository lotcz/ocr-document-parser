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
@Table(name = "fragment_template")
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
	
	@Override
	public String toString() {
		return String.format("[FragmentTemplate][%d/%s]", this.getId(), this.getName());
	}
}
