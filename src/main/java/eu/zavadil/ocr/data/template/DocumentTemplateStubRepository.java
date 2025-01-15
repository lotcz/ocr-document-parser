package eu.zavadil.ocr.data.template;

import eu.zavadil.ocr.data.RepositoryBase;

import java.util.Optional;

public interface DocumentTemplateStubRepository extends RepositoryBase<DocumentTemplateStub> {

	Optional<DocumentTemplateStub> findFirstByName(String name);

}
