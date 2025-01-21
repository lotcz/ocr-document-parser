package eu.zavadil.ocr.data.fragmentTemplate;

import eu.zavadil.ocr.data.RepositoryBase;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface FragmentTemplateStubRepository extends RepositoryBase<FragmentTemplateStub> {

	List<FragmentTemplateStub> findAllByDocumentTemplateId(int id);

	@Query("""
			delete
			from FragmentTemplateStub ft
			where ft.documentTemplateId = :documentTemplateId
				and ft.id not in :fragmentIds
		""")
	void deleteNotIn(@Param("documentTemplateId") int documentTemplateId, @Param("fragmentIds") List<Integer> fragmentIds);
}
