package eu.zavadil.ocr.data.parsed.document;

import eu.zavadil.java.spring.common.entity.EntityRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;

public interface DocumentStubWithPagesRepository extends EntityRepository<DocumentStubWithPages> {

	Page<DocumentStubWithPages> findAllByStateOrderByLastUpdatedOnAsc(DocumentState state, PageRequest pr);

	default Page<DocumentStubWithPages> loadQueue() {
		return this.findAllByStateOrderByLastUpdatedOnAsc(DocumentState.Waiting, PageRequest.of(0, 10));
	}

}
