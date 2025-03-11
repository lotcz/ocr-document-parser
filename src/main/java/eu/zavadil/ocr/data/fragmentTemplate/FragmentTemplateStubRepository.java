package eu.zavadil.ocr.data.fragmentTemplate;

import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface FragmentTemplateStubRepository extends org.springframework.data.jpa.repository.JpaRepository<FragmentTemplateStub, Integer> {

	List<FragmentTemplateStub> findAllByDocumentTemplateId(int id);

	@Modifying
	@Query("""
			delete
			from FragmentTemplateStub ft
			where ft.documentTemplateId = :documentTemplateId
				and ft.id not in :fragmentIds
		""")
	void deleteNotIn(@Param("documentTemplateId") int documentTemplateId, @Param("fragmentIds") List<Integer> fragmentIds);
}
