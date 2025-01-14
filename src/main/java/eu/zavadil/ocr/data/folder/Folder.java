package eu.zavadil.ocr.data.folder;

import eu.zavadil.ocr.data.EntityBase;
import eu.zavadil.ocr.data.template.DocumentTemplate;
import jakarta.persistence.Entity;
import jakarta.persistence.ManyToOne;
import lombok.Data;
import lombok.EqualsAndHashCode;

@EqualsAndHashCode(callSuper = true)
@Data
@Entity
public class Folder extends EntityBase {

	@ManyToOne
	private Folder parent;

	private String name;

	@ManyToOne
	private DocumentTemplate documentTemplate;

}
