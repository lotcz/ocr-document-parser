package eu.zavadil.ocr.data.documentTemplate;

import jakarta.persistence.MappedSuperclass;
import lombok.Data;
import lombok.EqualsAndHashCode;

@EqualsAndHashCode(callSuper = true)
@Data
@MappedSuperclass
public class DocumentTemplateBase extends TemplateBase {

	private int width;

	private int height;
	
	private String previewImg;

}
