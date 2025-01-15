package eu.zavadil.ocr.data.document;

import eu.zavadil.ocr.data.EntityBase;
import jakarta.persistence.MappedSuperclass;
import lombok.Data;
import lombok.EqualsAndHashCode;

@EqualsAndHashCode(callSuper = true)
@Data
@MappedSuperclass
public class DocumentBase extends EntityBase {

	private String imagePath;

	@Override
	public String toString() {
		return String.format("%d:%s", this.getId(), this.getImagePath());
	}
}
