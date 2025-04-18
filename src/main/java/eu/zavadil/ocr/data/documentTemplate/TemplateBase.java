package eu.zavadil.ocr.data.documentTemplate;

import eu.zavadil.java.spring.common.entity.EntityBase;
import eu.zavadil.ocr.data.Language;
import jakarta.persistence.Column;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.MappedSuperclass;
import lombok.Data;
import lombok.EqualsAndHashCode;

@EqualsAndHashCode(callSuper = true)
@Data
@MappedSuperclass
public class TemplateBase extends EntityBase {

	private final int NAME_LENGTH = 100;

	@Column(length = NAME_LENGTH)
	private String name;

	void setName(String name) {
		this.name = this.truncateString(name, NAME_LENGTH);
	}

	@ManyToOne
	private Language language;

}
