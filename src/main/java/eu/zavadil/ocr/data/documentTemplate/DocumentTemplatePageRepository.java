package eu.zavadil.ocr.data.documentTemplate;

import eu.zavadil.java.spring.common.entity.EntityRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface DocumentTemplatePageRepository extends EntityRepository<DocumentTemplatePage> {

	List<DocumentTemplatePage> findAllByParentDocumentTemplateId(int documentTemplateId);

	@Modifying
	@Query("""
			delete
			from DocumentTemplatePage dtp
			where dtp.parentDocumentTemplateId = :parentTemplateId
				and dtp.id not in :pageIds
		""")
	void deleteNotIn(@Param("parentTemplateId") int parentTemplateId, @Param("pageIds") List<Integer> pageIds);
}
