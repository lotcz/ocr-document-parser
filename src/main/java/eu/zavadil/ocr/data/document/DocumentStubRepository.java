package eu.zavadil.ocr.data.document;

import eu.zavadil.java.spring.common.entity.EntityRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;

import java.util.Optional;

public interface DocumentStubRepository extends EntityRepository<DocumentStub> {

	Page<DocumentStub> findAllByStateOrderByLastUpdatedOnAsc(DocumentState state, PageRequest pr);

	default Page<DocumentStub> loadQueue() {
		return this.findAllByStateOrderByLastUpdatedOnAsc(DocumentState.Waiting, PageRequest.of(0, 10));
	}

	Optional<DocumentStub> findFirstByFolderIdAndImagePath(int folderId, String imagePath);

}
