package eu.zavadil.ocr.data.folder;

import eu.zavadil.ocr.data.EntityBase;
import jakarta.persistence.MappedSuperclass;
import lombok.Data;
import lombok.EqualsAndHashCode;

@EqualsAndHashCode(callSuper = true)
@Data
@MappedSuperclass
public class FolderBase extends EntityBase {

	private String name;

}
