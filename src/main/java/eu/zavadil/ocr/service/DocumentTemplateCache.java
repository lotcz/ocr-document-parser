package eu.zavadil.ocr.service;

import eu.zavadil.java.ocr.common.template.document.DocumentTemplate;
import eu.zavadil.java.spring.common.entity.cache.RepositoryHashCache;
import eu.zavadil.ocr.data.template.DocumentTemplateRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class DocumentTemplateCache extends RepositoryHashCache<DocumentTemplate> {

	@Autowired
	public DocumentTemplateCache(DocumentTemplateRepository repository) {
		super(repository);
	}
}
