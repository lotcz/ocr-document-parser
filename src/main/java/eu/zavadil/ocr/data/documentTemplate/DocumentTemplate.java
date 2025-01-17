package eu.zavadil.ocr.data.documentTemplate;

import eu.zavadil.ocr.data.fragmentTemplate.FragmentTemplate;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.hibernate.annotations.Cascade;
import org.hibernate.annotations.CascadeType;

import java.util.ArrayList;
import java.util.List;

@EqualsAndHashCode(callSuper = true, exclude = "fragments")
@Data
@Entity
@Table(name = "document_template")
public class DocumentTemplate extends DocumentTemplateBase {

	private int width;

	private int height;

	@OneToMany(mappedBy = "documentTemplate", fetch = FetchType.EAGER)
	@Cascade(CascadeType.ALL)
	private List<FragmentTemplate> fragments = new ArrayList<>();

	public DocumentTemplateStub toStub() {
		return new DocumentTemplateStub(this.getId(), this.getName(), this.getLanguage());
	}

}
