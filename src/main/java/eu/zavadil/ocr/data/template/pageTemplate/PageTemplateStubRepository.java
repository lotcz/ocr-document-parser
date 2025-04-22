package eu.zavadil.ocr.data.template.pageTemplate;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface PageTemplateStubRepository extends JpaRepository<PageTemplateStub, Integer> {

	@Query("""
		select p
		from PageTemplateStub p
		where p.documentTemplateId = :documentTemplateId and p.id not in :existingIds
		""")
	List<PageTemplateStub> loadExtraPages(@Param("documentTemplateId") int documentTemplateId, @Param("existingIds") List<Integer> existingIds);

}
