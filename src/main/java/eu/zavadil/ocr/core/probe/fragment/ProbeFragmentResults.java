package eu.zavadil.ocr.core.probe.fragment;

import java.util.ArrayList;

public class ProbeFragmentResults extends ArrayList<ProbeFragmentResult> {

	@Override
	public String toString() {
		StringBuilder sb = new StringBuilder();
		this.forEach(pr -> {
			sb.append(pr.toString());
			sb.append("\n");
		});
		return sb.toString();
	}
}
