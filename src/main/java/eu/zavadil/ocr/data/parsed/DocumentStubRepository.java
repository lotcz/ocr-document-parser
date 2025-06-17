package eu.zavadil.ocr.data.parsed;

import eu.zavadil.java.ocr.common.parsed.document.DocumentState;
import eu.zavadil.java.ocr.common.parsed.document.DocumentStub;
import eu.zavadil.java.spring.common.entity.EntityRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

public interface DocumentStubRepository extends EntityRepository<DocumentStub> {

	@Modifying
	@Transactional
	@Query("""
			update DocumentStub d
			set d.state = :state
			where d.folderId = :folderId
		""")
	void updateDocumentsState(@Param("folderId") int folderId, @Param("state") DocumentState state);

	@Modifying
	@Transactional
	@Query("""
			update DocumentStub d
			set d.state = :state
			where d.id = :id
		""")
	void updateDocumentState(@Param("id") int id, @Param("state") DocumentState state);

}
