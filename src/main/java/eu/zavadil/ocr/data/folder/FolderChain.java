package eu.zavadil.ocr.data.folder;

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
public class FolderChain extends FolderBase {

	@ManyToOne
	private FolderChain parent;

	@Column(name = "document_template_id")
	private Integer documentTemplateId;
}
