package eu.zavadil.ocr.data.documentTemplate;

import jakarta.persistence.Column;
import jakarta.persistence.MappedSuperclass;
import lombok.Data;
import lombok.EqualsAndHashCode;

@EqualsAndHashCode(callSuper = true)
@Data
@MappedSuperclass
public class DocumentTemplateBase extends TemplateBase {

	private int width;

	private int height;

	public final int PREVIEW_IMG_LENGTH = 255;

	@Column(length = PREVIEW_IMG_LENGTH)
	private String previewImg;

	void setPreviewImg(String path) {
		String sanitized = this.sanitizeString(path);
		if (sanitized != null && sanitized.length() > PREVIEW_IMG_LENGTH)
			throw new RuntimeException(
				String.format("Image path '%s' is too long! Max length is %s", path, PREVIEW_IMG_LENGTH)
			);
	}

	private int pages = 1;

}
