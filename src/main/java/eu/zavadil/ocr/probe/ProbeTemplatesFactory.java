package eu.zavadil.ocr.probe;

import eu.zavadil.java.caching.Lazy;
import eu.zavadil.ocr.data.language.LanguageService;
import eu.zavadil.ocr.data.template.documentTemplate.DocumentTemplate;
import eu.zavadil.ocr.data.template.documentTemplate.DocumentTemplateRepository;
import eu.zavadil.ocr.data.template.fragmentTemplate.FragmentTemplate;
import eu.zavadil.ocr.data.template.pageTemplate.PageTemplate;
import eu.zavadil.ocr.storage.ImageFile;
import eu.zavadil.ocr.storage.StorageFile;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
@Slf4j
public class ProbeTemplatesFactory {

	@Autowired
	DocumentTemplateRepository documentTemplateRepository;

	@Autowired
	ProbeImageFactory probeImageFactory;

	@Autowired
	LanguageService languageService;

	private static final String DOCUMENT_TEMPLATE_NAME = "Document Template";

	private static final String SIMPLE_TEMPLATE_NAME = "Simple Template";

	private final Lazy<DocumentTemplate> simpleTemplate = new Lazy<>(
		() -> {
			DocumentTemplate dt = this.documentTemplateRepository.findFirstByName(SIMPLE_TEMPLATE_NAME).orElse(null);
			if (dt == null) {
				log.info("Creating simple document template");
				dt = new DocumentTemplate();
				dt.setName(SIMPLE_TEMPLATE_NAME);
				dt.setLanguage(this.languageService.getByTesseractCode("eng"));

				PageTemplate pt = new PageTemplate();
				pt.setDocumentTemplate(dt);
				dt.getPages().add(pt);

				FragmentTemplate fragment0 = new FragmentTemplate();
				fragment0.setName("fragment_0");
				fragment0.setPageTemplate(pt);
				pt.getFragments().add(fragment0);

				this.documentTemplateRepository.save(dt);

				ImageFile img = this.probeImageFactory.createProbeTemplateImage("/examples/java-ocr-1.png", dt);
				dt.setPreviewImg(img.toString());

				StorageFile pimg = img.copyTo(img.getNextUnused());
				pt.setPreviewImg(pimg.toString());

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
			DocumentTemplate dt = this.documentTemplateRepository
				.findFirstByName(DOCUMENT_TEMPLATE_NAME)
				.orElse(null);
			if (dt == null) {
				log.info("Creating example document template");
				dt = new DocumentTemplate();
				dt.setName(DOCUMENT_TEMPLATE_NAME);
				dt.setLanguage(this.languageService.getByTesseractCode("eng"));

				PageTemplate pt = new PageTemplate();
				pt.setDocumentTemplate(dt);
				dt.getPages().add(pt);

				FragmentTemplate fragment1 = new FragmentTemplate();
				fragment1.setPageTemplate(pt);
				fragment1.setName("fragment_0");
				fragment1.setLeft(0);
				fragment1.setTop(0);
				fragment1.setWidth(0.5);
				fragment1.setHeight(1);
				pt.getFragments().add(fragment1);

				FragmentTemplate fragment2 = new FragmentTemplate();
				fragment2.setPageTemplate(pt);
				fragment2.setName("fragment_1");
				fragment2.setLeft(0.5);
				fragment2.setTop(0);
				fragment2.setWidth(0.5);
				fragment2.setHeight(1);
				pt.getFragments().add(fragment2);

				this.documentTemplateRepository.save(dt);

				ImageFile img = this.probeImageFactory.createProbeTemplateImage("/examples/java-ocr-1.png", dt);
				dt.setPreviewImg(img.toString());

				StorageFile pimg = img.copyTo(img.getNextUnused());
				pt.setPreviewImg(pimg.toString());

				this.documentTemplateRepository.save(dt);
			}
			return dt;
		}
	);

	public DocumentTemplate getDocumentTemplate() {
		return this.documentTemplate.get();
	}

}
