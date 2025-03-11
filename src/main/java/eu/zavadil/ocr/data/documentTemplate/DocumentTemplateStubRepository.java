package eu.zavadil.ocr.data.documentTemplate;

import java.util.Optional;

public interface DocumentTemplateStubRepository extends org.springframework.data.jpa.repository.JpaRepository<DocumentTemplateStub, Integer> {

	Optional<DocumentTemplateStub> findFirstByName(String name);

}
