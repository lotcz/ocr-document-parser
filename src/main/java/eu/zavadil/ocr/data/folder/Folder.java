package eu.zavadil.ocr.data.folder;

import eu.zavadil.ocr.data.EntityBase;
import jakarta.persistence.Entity;
import lombok.Data;
import lombok.EqualsAndHashCode;

@EqualsAndHashCode(callSuper = true)
@Data
@Entity
public class Folder extends EntityBase {

	private String name;

}
