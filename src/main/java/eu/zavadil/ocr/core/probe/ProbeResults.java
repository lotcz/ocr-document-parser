package eu.zavadil.ocr.core.probe;

import java.util.ArrayList;

public class ProbeResults extends ArrayList<ProbeResult> {

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
