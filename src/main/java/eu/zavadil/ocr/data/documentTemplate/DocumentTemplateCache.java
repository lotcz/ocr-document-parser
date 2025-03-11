package eu.zavadil.ocr.data.documentTemplate;

import eu.zavadil.java.spring.common.entity.cache.RepositoryHashCache;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class DocumentTemplateCache extends RepositoryHashCache<DocumentTemplate> {

	@Autowired
	public DocumentTemplateCache(DocumentTemplateRepository repository) {
		super(repository);
	}
}
