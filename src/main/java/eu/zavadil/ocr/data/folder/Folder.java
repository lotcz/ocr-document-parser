package eu.zavadil.ocr.data.folder;

import eu.zavadil.ocr.data.documentTemplate.DocumentTemplate;
import jakarta.persistence.Entity;
import jakarta.persistence.ManyToOne;
import lombok.Data;
import lombok.EqualsAndHashCode;

@EqualsAndHashCode(callSuper = true)
@Data
@Entity
public class Folder extends FolderBase {

	@ManyToOne
	private Folder parent;

	@ManyToOne
	private DocumentTemplate documentTemplate;

}
