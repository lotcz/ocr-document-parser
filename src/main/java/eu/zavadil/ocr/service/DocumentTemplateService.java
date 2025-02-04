package eu.zavadil.ocr.service;

import eu.zavadil.ocr.data.documentTemplate.DocumentTemplate;
import eu.zavadil.ocr.data.documentTemplate.DocumentTemplateRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class DocumentTemplateService extends BasicEntityCache<DocumentTemplate> {

	@Autowired
	public DocumentTemplateService(DocumentTemplateRepository documentTemplateRepository) {
		super(documentTemplateRepository);
	}

}
