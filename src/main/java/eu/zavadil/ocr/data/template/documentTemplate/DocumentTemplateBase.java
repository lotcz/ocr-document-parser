package eu.zavadil.ocr.data.template.documentTemplate;

import eu.zavadil.ocr.data.template.TemplateBase;
import jakarta.persistence.Column;
import jakarta.persistence.MappedSuperclass;
import lombok.Data;
import lombok.EqualsAndHashCode;

@EqualsAndHashCode(callSuper = true)
@Data
@MappedSuperclass
public class DocumentTemplateBase extends TemplateBase {

	public static final int PREVIEW_IMG_LENGTH = 255;

	@Column(length = PREVIEW_IMG_LENGTH)
	private String previewImg;

	public void setPreviewImg(String path) {
		String sanitized = this.sanitizeString(path);
		if (sanitized != null && sanitized.length() > PREVIEW_IMG_LENGTH)
			throw new RuntimeException(
				String.format("Image path '%s' is too long! Max length is %s", path, PREVIEW_IMG_LENGTH)
			);
		this.previewImg = sanitized;
	}

	private int pageCount = 1;

}
