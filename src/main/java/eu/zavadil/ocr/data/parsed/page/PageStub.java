package eu.zavadil.ocr.data.parsed.page;

import jakarta.persistence.Entity;
import jakarta.persistence.Index;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.EqualsAndHashCode;

@EqualsAndHashCode(callSuper = true)
@Data
@Entity
@Table(name = "page",
	indexes = {
		@Index(columnList = "documentId,pageNumber")
	}
)
public class PageStub extends PageStubBase {

	@Override
	public String toString() {
		return String.format("[PageStub][%d/%s]", this.getPageNumber(), this.getImagePath());
	}
}
