package eu.zavadil.ocr.data.template.fragmentTemplate;

import eu.zavadil.java.spring.common.entity.EntityRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface FragmentTemplateStubRepository extends EntityRepository<FragmentTemplateStub> {

	@Modifying
	@Query("""
			delete
			from FragmentTemplateStub ft
			where ft.pageTemplateId in (
				select p.id from PageTemplateStub p where p.documentTemplateId = :documentTemplateId
			) and ft.id not in :fragmentIds
		""")
	void deleteExtra(@Param("documentTemplateId") int documentTemplateId, @Param("fragmentIds") List<Integer> fragmentIds);
}
