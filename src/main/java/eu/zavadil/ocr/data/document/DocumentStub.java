package eu.zavadil.ocr.data.document;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.EqualsAndHashCode;

@EqualsAndHashCode(callSuper = true)
@Data
@Entity
@Table(name = "document")
public class DocumentStub extends DocumentBase {

	@Column(name = "folder_id")
	Integer folderId;

}