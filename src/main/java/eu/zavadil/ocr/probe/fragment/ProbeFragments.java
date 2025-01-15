package eu.zavadil.ocr.probe.fragment;

import eu.zavadil.ocr.data.Language;
import eu.zavadil.ocr.data.template.FragmentTemplate;
import org.springframework.stereotype.Component;

import java.util.ArrayList;

@Component
public class ProbeFragments extends ArrayList<ProbeFragment> {

	public ProbeFragments() {
		super();
		this.addFragment("/examples/java-ocr-1.png", "Performing OCR on an Image", Language.eng);
		this.addFragment("/examples/java-ocr-2.png", "With the image loaded and Tesseract configured, we can now perform OCR on the image:", Language.enb);
		this.addFragment("/examples/java-ocr-3.png", "Rodit doma je podle záchranářů hazard. Zákon to ale brzy řešit nezačne", Language.ces);
		this.addFragment("/examples/java-ocr-4.png", "Sometimes, this simply isn't possible. Sometimes, we wish to automate a task of rewriting text from an image with our own hands.", Language.enb);
	}

	private void addFragment(String path, String text, Language language) {
		FragmentTemplate template = new FragmentTemplate();
		template.setLanguage(language);
		this.add(new ProbeFragment(path, text, template));
	}
}
