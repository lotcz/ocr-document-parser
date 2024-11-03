package eu.zavadil.ocr.data.template;

import eu.zavadil.ocr.data.EntityBase;
import eu.zavadil.ocr.data.Language;
import jakarta.persistence.MappedSuperclass;
import lombok.Data;

@Data
@MappedSuperclass
public class TemplateBase extends EntityBase {

	private String name;

	private Language language;

}
