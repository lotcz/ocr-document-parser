package eu.zavadil.ocr.core.probe.fragment;

import eu.zavadil.ocr.core.probe.ProbeItem;
import eu.zavadil.ocr.data.FragmentTemplate;
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
