package eu.zavadil.ocr.data.parsed.document;

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

}
