package eu.zavadil.ocr.data.document;

import eu.zavadil.ocr.data.EntityBase;
import eu.zavadil.ocr.data.template.DocumentTemplate;
import jakarta.persistence.Entity;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.util.ArrayList;
import java.util.List;

@EqualsAndHashCode(callSuper = true, exclude = "fragments")
@Data
@Entity
public class Document extends EntityBase {

	@ManyToOne
	private DocumentTemplate documentTemplate;

	private String imagePath;

	@OneToMany(mappedBy = "document")
	private List<Fragment> fragments = new ArrayList<>();

}
