package eu.zavadil.ocr.core.probe.document;

import eu.zavadil.ocr.data.Language;
import eu.zavadil.ocr.data.template.DocumentTemplate;
import eu.zavadil.ocr.data.template.DocumentTemplateRepository;
import eu.zavadil.ocr.data.template.FragmentTemplate;
import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
@Slf4j
public class ProbeDocumentFactory {

	@Autowired
	DocumentTemplateRepository documentTemplateRepository;

	@PostConstruct
	public void init() {
		DocumentTemplate dt = this.documentTemplateRepository.findFirstByName("Probe Document").orElse(null);
		if (dt == null) {
			log.info("Creating example document template");
			this.documentTemplateRepository.save(this.createProbeDocumentTemplate());
		}
	}

	public DocumentTemplate createProbeDocumentTemplate() {
		DocumentTemplate dt = new DocumentTemplate();
		dt.setId(1);
		dt.setName("Probe Document");
		dt.setLanguage(Language.eng);
		dt.setWidth(480);
		dt.setHeight(640);

		FragmentTemplate fragment0 = new FragmentTemplate();
		fragment0.setName("fragment-0");
		fragment0.setDocumentTemplate(dt);
		dt.getFragments().add(fragment0);

		FragmentTemplate fragment1 = new FragmentTemplate();
		fragment1.setDocumentTemplate(dt);
		fragment1.setName("fragment-1");
		fragment1.setLeft(0);
		fragment1.setTop(0);
		fragment1.setWidth(0.5);
		fragment1.setHeight(1);
		dt.getFragments().add(fragment1);

		FragmentTemplate fragment2 = new FragmentTemplate();
		fragment2.setName("fragment-2");
		fragment2.setDocumentTemplate(dt);
		fragment2.setLeft(0.5);
		fragment2.setTop(0);
		fragment2.setWidth(0.5);
		fragment2.setHeight(1);
		dt.getFragments().add(fragment2);

		return dt;
	}

	public ProbeDocument createProbeDocument() {
		return new ProbeDocument("/img/java-ocr-1.png", this.createProbeDocumentTemplate());
	}

}
