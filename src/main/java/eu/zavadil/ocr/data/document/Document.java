package eu.zavadil.ocr.data.document;

import eu.zavadil.ocr.data.documentTemplate.DocumentTemplate;
import eu.zavadil.ocr.data.folder.Folder;
import eu.zavadil.ocr.data.fragment.Fragment;
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
@Table(name = "document")
public class Document extends DocumentBase {

	@ManyToOne(optional = false)
	private Folder folder;

	@ManyToOne(optional = false)
	private DocumentTemplate documentTemplate;

	@OneToMany(mappedBy = "document", fetch = FetchType.EAGER)
	@Cascade(CascadeType.ALL)
	private List<Fragment> fragments = new ArrayList<>();

	@Override
	public String toString() {
		return String.format("[Document][%d/%s]", this.getId(), this.getImagePath());
	}
}
