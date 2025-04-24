package eu.zavadil.ocr.data.parsed.document;

import eu.zavadil.java.spring.common.entity.EntityRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;

import java.util.Optional;

public interface DocumentStubWithPagesRepository extends EntityRepository<DocumentStubWithPages> {

	Optional<DocumentStubWithPages> findFirstByFolderIdAndImagePath(int folderId, String imagePath);

	Page<DocumentStubWithPages> findAllByStateOrderByLastUpdatedOnAsc(DocumentState state, PageRequest pr);

	default Page<DocumentStubWithPages> loadQueue() {
		return this.findAllByStateOrderByLastUpdatedOnAsc(DocumentState.Waiting, PageRequest.of(0, 10));
	}


}
