package eu.zavadil.ocr.data.document;

import eu.zavadil.java.spring.common.entity.EntityRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface DocumentStubWithFragmentsRepository extends EntityRepository<DocumentStubWithFragments> {

	@Query("""
			select d
			from DocumentStubWithFragments d
			where d.documentTemplateId = :templateId
		""")
	Page<DocumentStubWithFragments> loadByTemplate(@Param("templateId") int templateId, Pageable pr);

}
