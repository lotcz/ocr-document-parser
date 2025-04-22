package eu.zavadil.ocr.data.parsed.document;

import eu.zavadil.ocr.data.parsed.folder.Folder;
import eu.zavadil.ocr.data.parsed.page.Page;
import eu.zavadil.ocr.data.template.documentTemplate.DocumentTemplate;
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
@Table(name = "document")
public class Document extends DocumentBase {

	@ManyToOne(optional = false)
	private Folder folder;

	@ManyToOne(optional = true)
	private DocumentTemplate documentTemplate;

	@OneToMany(mappedBy = "document", fetch = FetchType.EAGER)
	@Cascade(CascadeType.ALL)
	private List<Page> pages = new ArrayList<>();

	@Override
	public String toString() {
		return String.format("[Document][%d/%s]", this.getId(), this.getImagePath());
	}
}
