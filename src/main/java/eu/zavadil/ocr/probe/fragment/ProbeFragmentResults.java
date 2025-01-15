package eu.zavadil.ocr.probe.fragment;

import java.util.ArrayList;

public class ProbeFragmentResults extends ArrayList<ProbeFragmentResult> {

	@Override
	public String toString() {
		StringBuilder sb = new StringBuilder();
		sb.append("Fragments");
		sb.append("\n");
		sb.append("=========");
		sb.append("\n\n");
		this.forEach(pr -> {
			sb.append(pr.toString());
			sb.append("\n");
		});
		return sb.toString();
	}
}
