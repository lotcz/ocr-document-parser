package eu.zavadil.ocr.data.document;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;

import java.util.Optional;

public interface DocumentStubRepository extends org.springframework.data.jpa.repository.JpaRepository<DocumentStub, Integer> {

	Page<DocumentStub> findAllByStateOrderByLastUpdatedOnAsc(DocumentState state, PageRequest pr);

	default Page<DocumentStub> loadQueue() {
		return this.findAllByStateOrderByLastUpdatedOnAsc(DocumentState.Waiting, PageRequest.of(0, 10));
	}

	Optional<DocumentStub> findFirstByFolderIdAndImagePath(int folderId, String imagePath);

}
