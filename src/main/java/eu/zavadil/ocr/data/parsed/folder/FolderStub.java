package eu.zavadil.ocr.data.parsed.folder;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.EqualsAndHashCode;

@EqualsAndHashCode(callSuper = true)
@Data
@Entity
@Table(name = "folder")
public class FolderStub extends FolderBase {

	@Column(name = "parent_id")
	private Integer parentId;

	@Column(name = "document_template_id")
	private Integer documentTemplateId;

	@Override
	public String toString() {
		return String.format("[FolderStub][%d/%s]", this.getId(), this.getName());
	}
}
