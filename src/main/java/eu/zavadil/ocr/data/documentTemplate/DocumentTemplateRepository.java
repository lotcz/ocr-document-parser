package eu.zavadil.ocr.data.documentTemplate;

import eu.zavadil.java.spring.common.entity.EntityRepository;

import java.util.Optional;

public interface DocumentTemplateRepository extends EntityRepository<DocumentTemplate> {

	Optional<DocumentTemplate> findFirstByName(String name);

}
