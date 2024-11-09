package eu.zavadil.ocr.data.template;

import eu.zavadil.ocr.data.RepositoryBase;

import java.util.Optional;

public interface DocumentTemplateRepository extends RepositoryBase<DocumentTemplate> {

	Optional<DocumentTemplate> findFirstByName(String name);

}
