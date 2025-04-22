package eu.zavadil.ocr.data.template.documentTemplate;

import eu.zavadil.ocr.data.language.Language;
import eu.zavadil.ocr.data.template.pageTemplate.PageTemplate;
import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.hibernate.annotations.Cascade;
import org.hibernate.annotations.CascadeType;

import java.util.ArrayList;
import java.util.List;

@EqualsAndHashCode(callSuper = true, exclude = "pages")
@Data
@Entity
@Table(name = "document_template")
public class DocumentTemplate extends DocumentTemplateBase {

	@OneToMany(mappedBy = "documentTemplate", fetch = FetchType.EAGER)
	@Cascade(CascadeType.ALL)
	private List<PageTemplate> pages = new ArrayList<>();

	@ManyToOne
	@JoinColumn(name = "language_id")
	private Language language;

	@Override
	public String toString() {
		return String.format("[DocumentTemplate][%d/%s]", this.getId(), this.getName());
	}
}
