package eu.zavadil.ocr.probe;

import eu.zavadil.java.caching.Lazy;
import eu.zavadil.ocr.data.Language;
import eu.zavadil.ocr.data.documentTemplate.DocumentTemplate;
import eu.zavadil.ocr.data.documentTemplate.DocumentTemplateRepository;
import eu.zavadil.ocr.data.fragmentTemplate.FragmentTemplate;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
@Slf4j
public class ProbeTemplatesFactory {

	@Autowired
	DocumentTemplateRepository documentTemplateRepository;

	private static final String DOCUMENT_TEMPLATE_NAME = "Document Template";

	private static final String SIMPLE_TEMPLATE_NAME = "Simple Template";

	private final Lazy<DocumentTemplate> simpleTemplate = new Lazy<>(
		() -> {
			DocumentTemplate dt = this.documentTemplateRepository.findFirstByName(SIMPLE_TEMPLATE_NAME).orElse(null);
			if (dt == null) {
				log.info("Creating simple document template");
				dt = new DocumentTemplate();
				dt.setName(SIMPLE_TEMPLATE_NAME);
				dt.setLanguage(Language.eng);
				dt.setWidth(480);
				dt.setHeight(640);

				FragmentTemplate fragment0 = new FragmentTemplate();
				fragment0.setName("fragment-0");
				fragment0.setDocumentTemplate(dt);
				dt.getFragments().add(fragment0);

				this.documentTemplateRepository.save(dt);
			}
			return dt;
		}
	);

	public DocumentTemplate getSimpleTemplate() {
		return this.simpleTemplate.get();
	}

	private final Lazy<DocumentTemplate> documentTemplate = new Lazy<>(
		() -> {
			DocumentTemplate dt = this.documentTemplateRepository.findFirstByName(DOCUMENT_TEMPLATE_NAME).orElse(null);
			if (dt == null) {
				log.info("Creating example document template");
				dt = new DocumentTemplate();
				dt.setName(DOCUMENT_TEMPLATE_NAME);
				dt.setLanguage(Language.eng);
				dt.setWidth(480);
				dt.setHeight(640);

				FragmentTemplate fragment1 = new FragmentTemplate();
				fragment1.setDocumentTemplate(dt);
				fragment1.setName("fragment-0");
				fragment1.setLeft(0);
				fragment1.setTop(0);
				fragment1.setWidth(0.5);
				fragment1.setHeight(1);
				dt.getFragments().add(fragment1);

				FragmentTemplate fragment2 = new FragmentTemplate();
				fragment2.setName("fragment-1");
				fragment2.setDocumentTemplate(dt);
				fragment2.setLeft(0.5);
				fragment2.setTop(0);
				fragment2.setWidth(0.5);
				fragment2.setHeight(1);
				dt.getFragments().add(fragment2);

				this.documentTemplateRepository.save(dt);
			}
			return dt;
		}
	);

	public DocumentTemplate getDocumentTemplate() {
		return this.documentTemplate.get();
	}

}
