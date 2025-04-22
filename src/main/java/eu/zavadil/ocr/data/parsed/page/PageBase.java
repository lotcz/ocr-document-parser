package eu.zavadil.ocr.data.parsed.page;

import eu.zavadil.java.spring.common.entity.EntityBase;
import eu.zavadil.ocr.data.parsed.document.DocumentState;
import jakarta.persistence.Column;
import jakarta.persistence.MappedSuperclass;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.hibernate.annotations.JdbcType;
import org.hibernate.dialect.PostgreSQLEnumJdbcType;

@EqualsAndHashCode(callSuper = true)
@Data
@MappedSuperclass
public class PageBase extends EntityBase {

	public static final int IMG_PATH_LENGTH = 255;

	@Column(length = IMG_PATH_LENGTH)
	private String imagePath;

	public void setImagePath(String path) {
		String sanitized = this.sanitizeString(path);
		if (sanitized != null && sanitized.length() > IMG_PATH_LENGTH)
			throw new RuntimeException(
				String.format("Image path '%s' is too long! Max length is %s", path, IMG_PATH_LENGTH)
			);
		this.imagePath = path;
	}

	private int pageNumber = 0;

	@JdbcType(PostgreSQLEnumJdbcType.class)
	private DocumentState state = DocumentState.Waiting;

	private String stateMessage;

}
