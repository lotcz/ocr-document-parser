package eu.zavadil.ocr.data.language;

import eu.zavadil.java.spring.common.entity.EntityBase;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.EqualsAndHashCode;

@EqualsAndHashCode(callSuper = true)
@Data
@Entity
@Table(name = "language")
public class Language extends EntityBase {

	private static final int NAME_LENGTH = 50;

	@Column(length = NAME_LENGTH)
	private String name;

	void setName(String name) {
		this.name = this.truncateString(name, NAME_LENGTH);
	}

	private static final int TESS_CODE_LENGTH = 3;

	@Column(length = TESS_CODE_LENGTH)
	private String tesseractCode;

	void setTesseractCode(String code) {
		this.tesseractCode = this.truncateString(code, TESS_CODE_LENGTH);
	}

	private String description;

}
