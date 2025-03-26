package eu.zavadil.ocr.data.document;

import eu.zavadil.ocr.data.fragment.FragmentStub;
import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.util.ArrayList;
import java.util.List;

@EqualsAndHashCode(callSuper = true)
@Data
@Entity
@Table(
	name = "document",
	indexes = {
		@Index(columnList = "folderId"),
		@Index(columnList = "documentTemplateId"),
		@Index(columnList = "state")
	}
)
public class DocumentStubWithFragments extends DocumentStubBase {

	@OneToMany(mappedBy = "documentId", fetch = FetchType.EAGER)
	private List<FragmentStub> fragments = new ArrayList<>();

	@Override
	public String toString() {
		return String.format("[DocumentStubWithFragments][%d/%s][fragments:%d]", this.getId(), this.getImagePath(), this.fragments.size());
	}
}
