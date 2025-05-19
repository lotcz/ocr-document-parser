package eu.zavadil.ocr.data.template;

import eu.zavadil.java.ocr.common.template.page.PageTemplateStub;
import eu.zavadil.java.spring.common.entity.EntityRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface PageTemplateStubRepository extends EntityRepository<PageTemplateStub> {

	@Query("""
		select p
		from PageTemplateStub p
		where p.documentTemplateId = :documentTemplateId and p.id not in :existingIds
		""")
	List<PageTemplateStub> loadExtraPages(@Param("documentTemplateId") int documentTemplateId, @Param("existingIds") List<Integer> existingIds);

}
