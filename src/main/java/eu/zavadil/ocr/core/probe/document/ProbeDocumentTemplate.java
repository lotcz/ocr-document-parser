package eu.zavadil.ocr.core.probe.document;

import eu.zavadil.ocr.data.DocumentTemplate;
import eu.zavadil.ocr.data.FragmentTemplate;
import eu.zavadil.ocr.data.Language;
import org.springframework.stereotype.Component;

@Component
public class ProbeDocumentTemplate extends DocumentTemplate {

	public ProbeDocumentTemplate() {
		this.setLanguage(Language.eng);
		this.setWidth(480);
		this.setHeight(640);

		FragmentTemplate fragment0 = new FragmentTemplate();
		fragment0.setName("fragment-0");
		fragment0.setDocumentTemplate(this);
		this.getFragments().add(fragment0);

		FragmentTemplate fragment1 = new FragmentTemplate();
		fragment1.setDocumentTemplate(this);
		fragment1.setName("fragment-1");
		fragment1.setLeft(0);
		fragment1.setTop(0);
		fragment1.setWidth(0.5);
		fragment1.setHeight(1);
		this.getFragments().add(fragment1);

		FragmentTemplate fragment2 = new FragmentTemplate();
		fragment2.setName("fragment-2");
		fragment2.setDocumentTemplate(this);
		fragment2.setLeft(0.5);
		fragment2.setTop(0);
		fragment2.setWidth(0.5);
		fragment2.setHeight(1);
		this.getFragments().add(fragment2);
	}

}
