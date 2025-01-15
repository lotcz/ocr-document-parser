package eu.zavadil.ocr.data.folder;

import eu.zavadil.ocr.data.template.DocumentTemplateStub;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.ManyToOne;
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

	@ManyToOne
	private DocumentTemplateStub documentTemplate;

}
