package eu.zavadil.ocr.data.document;

import eu.zavadil.java.spring.common.entity.EntityRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

public interface DocumentStubRepository extends EntityRepository<DocumentStub> {

	Page<DocumentStub> findAllByStateOrderByLastUpdatedOnAsc(DocumentState state, PageRequest pr);

	List<DocumentStub> findAllByParentDocumentId(int parentDocumentId);

	default Page<DocumentStub> loadQueue() {
		return this.findAllByStateOrderByLastUpdatedOnAsc(DocumentState.Waiting, PageRequest.of(0, 10));
	}

	Optional<DocumentStub> findFirstByFolderIdAndImagePath(int folderId, String imagePath);

	@Modifying
	@Transactional
	@Query("""
			update DocumentStub d
			set d.state = :state
			where d.folderId = :folderId
		""")
	void updateDocumentsState(@Param("folderId") int folderId, @Param("state") DocumentState state);

}
