package eu.zavadil.ocr.data.template.pageTemplate;

import eu.zavadil.ocr.data.template.documentTemplate.DocumentTemplate;
import eu.zavadil.ocr.data.template.fragmentTemplate.FragmentTemplate;
import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.hibernate.annotations.Cascade;
import org.hibernate.annotations.CascadeType;

import java.util.ArrayList;
import java.util.List;

@EqualsAndHashCode(callSuper = true, exclude = "fragments")
@Data
@Entity
@Table(name = "page_template")
public class PageTemplate extends PageTemplateBase {

	@ManyToOne
	DocumentTemplate documentTemplate;

	@OneToMany(mappedBy = "pageTemplate", fetch = FetchType.EAGER)
	@Cascade(CascadeType.ALL)
	private List<FragmentTemplate> fragments = new ArrayList<>();

	@Override
	public String toString() {
		return String.format("[PageTemplate][%d/%d]", this.getId(), this.getPageNumber());
	}

}
