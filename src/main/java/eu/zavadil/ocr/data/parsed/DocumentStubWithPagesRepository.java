package eu.zavadil.ocr.data.parsed;

import eu.zavadil.java.ocr.common.parsed.document.DocumentState;
import eu.zavadil.java.ocr.common.parsed.document.DocumentStubWithPages;
import eu.zavadil.java.spring.common.entity.EntityRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import java.util.Optional;

public interface DocumentStubWithPagesRepository extends EntityRepository<DocumentStubWithPages> {

	Optional<DocumentStubWithPages> findFirstByFolderIdAndImagePath(int folderId, String imagePath);

	Page<DocumentStubWithPages> findAllByStateOrderByLastUpdatedOnAsc(DocumentState state, PageRequest pr);

	Page<DocumentStubWithPages> findAllByState(DocumentState state, PageRequest pr);

	default Page<DocumentStubWithPages> loadQueue() {
		return this.findAllByStateOrderByLastUpdatedOnAsc(DocumentState.Waiting, PageRequest.of(0, 10));
	}

	Page<DocumentStubWithPages> findAllByFolderId(int folderId, Pageable pr);

	Page<DocumentStubWithPages> findAllByStateAndFolderId(DocumentState state, int folderId, Pageable pr);

}
