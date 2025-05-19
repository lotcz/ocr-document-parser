package eu.zavadil.ocr.data.template;

import eu.zavadil.java.ocr.common.template.document.DocumentTemplate;
import eu.zavadil.java.spring.common.entity.EntityRepository;

import java.util.Optional;

public interface DocumentTemplateRepository extends EntityRepository<DocumentTemplate> {

	Optional<DocumentTemplate> findFirstByName(String name);

}
