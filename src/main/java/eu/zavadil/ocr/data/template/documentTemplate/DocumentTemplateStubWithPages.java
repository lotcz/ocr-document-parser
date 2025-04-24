package eu.zavadil.ocr.data.template.documentTemplate;

import eu.zavadil.ocr.data.template.pageTemplate.PageTemplateStubWithFragments;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.util.ArrayList;
import java.util.List;

@EqualsAndHashCode(callSuper = true)
@Data
@Entity
@Table(name = "document_template")
public class DocumentTemplateStubWithPages extends DocumentTemplateStubBase {

	@OneToMany(mappedBy = "documentTemplateId", fetch = FetchType.EAGER, cascade = {})
	private List<PageTemplateStubWithFragments> pages = new ArrayList<>();

	@Override
	public String toString() {
		return String.format("[DocumentTemplateStubWithPages][%d/%s][pages:%d]", this.getId(), this.getName(), this.pages.size());
	}
}
