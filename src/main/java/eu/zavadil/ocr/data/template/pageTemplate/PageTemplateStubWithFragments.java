package eu.zavadil.ocr.data.template.pageTemplate;

import eu.zavadil.ocr.data.template.fragmentTemplate.FragmentTemplateStub;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.hibernate.annotations.Cascade;

import java.util.ArrayList;
import java.util.List;

@EqualsAndHashCode(callSuper = true)
@Data
@Entity
@Table(name = "page_template")
public class PageTemplateStubWithFragments extends PageTemplateStubBase {

	@OneToMany(mappedBy = "pageTemplateId", fetch = FetchType.EAGER)
	@Cascade(org.hibernate.annotations.CascadeType.ALL)
	private List<FragmentTemplateStub> fragments = new ArrayList<>();

	@Override
	public String toString() {
		return String.format("[PageTemplateStubWithFragments][%d/%d][fragments:%d]", this.getId(), this.getPageNumber(), this.fragments.size());
	}
}
