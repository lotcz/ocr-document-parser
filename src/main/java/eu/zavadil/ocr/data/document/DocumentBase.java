package eu.zavadil.ocr.data.document;

import eu.zavadil.ocr.data.EntityBase;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.MappedSuperclass;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.EqualsAndHashCode;

@EqualsAndHashCode(callSuper = true)
@Data
@MappedSuperclass
public class DocumentBase extends EntityBase {

	private String imagePath;

	@Enumerated(EnumType.STRING)
	@NotNull
	private DocumentState state = DocumentState.Waiting;

}
