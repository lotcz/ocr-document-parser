package eu.zavadil.ocr.data.folder;

import eu.zavadil.java.spring.common.entity.EntityBase;
import jakarta.persistence.Column;
import jakarta.persistence.MappedSuperclass;
import lombok.Data;
import lombok.EqualsAndHashCode;

@EqualsAndHashCode(callSuper = true)
@Data
@MappedSuperclass
public class FolderBase extends EntityBase {

	private final int NAME_LENGTH = 50;

	@Column(length = NAME_LENGTH)
	private String name;

	void setName(String name) {
		this.name = this.truncateString(name, NAME_LENGTH);
	}
}
