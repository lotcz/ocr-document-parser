package eu.zavadil.ocr.probe.fragment;

import eu.zavadil.ocr.data.fragmentTemplate.FragmentTemplate;
import eu.zavadil.ocr.probe.ProbeItem;
import lombok.Data;

@Data
public class ProbeFragment extends ProbeItem {

	private String text;

	private FragmentTemplate template;

	public ProbeFragment(String path, String text, FragmentTemplate template) {
		super(path);
		this.text = text;
		this.template = template;
	}
}
