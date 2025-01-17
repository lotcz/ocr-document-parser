package eu.zavadil.ocr.data.documentTemplate;

import eu.zavadil.ocr.data.RepositoryBase;

import java.util.Optional;

public interface DocumentTemplateStubRepository extends RepositoryBase<DocumentTemplateStub> {

	Optional<DocumentTemplateStub> findFirstByName(String name);

}
