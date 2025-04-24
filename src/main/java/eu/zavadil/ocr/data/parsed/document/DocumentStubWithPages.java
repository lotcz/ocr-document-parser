package eu.zavadil.ocr.data.parsed.document;

import eu.zavadil.ocr.data.parsed.page.PageStubWithFragments;
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
@Table(name = "document")
public class DocumentStubWithPages extends DocumentStubBase {

	@OneToMany(mappedBy = "documentId", fetch = FetchType.EAGER)
	private List<PageStubWithFragments> pages = new ArrayList<>();

	@Override
	public String toString() {
		return String.format("[DocumentStubWithPages][%d/%s][pages:%d]", this.getId(), this.getImagePath(), this.pages.size());
	}
}
