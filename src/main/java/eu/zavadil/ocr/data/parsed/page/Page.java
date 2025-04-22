package eu.zavadil.ocr.data.parsed.page;

import eu.zavadil.ocr.data.parsed.document.Document;
import eu.zavadil.ocr.data.parsed.fragment.Fragment;
import eu.zavadil.ocr.data.template.pageTemplate.PageTemplate;
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
@Table(name = "page")
public class Page extends PageBase {

	@ManyToOne(optional = false)
	private Document document;

	@ManyToOne(optional = false)
	private PageTemplate pageTemplate;

	@OneToMany(mappedBy = "page", fetch = FetchType.EAGER)
	@Cascade(CascadeType.ALL)
	private List<Fragment> fragments = new ArrayList<>();

	@Override
	public String toString() {
		return String.format("[Page][%d/%d]", this.getId(), this.getPageNumber());
	}
}
