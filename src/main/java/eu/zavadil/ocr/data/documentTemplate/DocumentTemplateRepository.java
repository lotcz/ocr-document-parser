package eu.zavadil.ocr.data.documentTemplate;

import eu.zavadil.ocr.data.RepositoryBase;

import java.util.Optional;

public interface DocumentTemplateRepository extends RepositoryBase<DocumentTemplate> {

	Optional<DocumentTemplate> findFirstByName(String name);

}
