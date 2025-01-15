package eu.zavadil.ocr.service;

import eu.zavadil.java.caching.HashCache;
import eu.zavadil.ocr.data.template.DocumentTemplate;
import eu.zavadil.ocr.data.template.DocumentTemplateRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class DocumentTemplateCache extends HashCache<Integer, DocumentTemplate> {

	@Autowired
	DocumentTemplateRepository documentTemplateRepository;

	@Override
	protected DocumentTemplate load(Integer id) {
		return this.documentTemplateRepository.findById(id)
			.orElseThrow(() -> new IllegalArgumentException(String.format("Document template %d not found!", id)));
	}

	@Override
	protected void save(Integer integer, DocumentTemplate documentTemplate) {
		this.documentTemplateRepository.save(documentTemplate);
	}
}
