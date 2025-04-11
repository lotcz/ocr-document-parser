package eu.zavadil.ocr.data.documentTemplate;

import eu.zavadil.java.spring.common.entity.EntityRepository;

import java.util.List;

public interface DocumentTemplatePageRepository extends EntityRepository<DocumentTemplatePage> {

	List<DocumentTemplatePage> findAllByParentDocumentTemplateId(int documentTemplateId);

}
