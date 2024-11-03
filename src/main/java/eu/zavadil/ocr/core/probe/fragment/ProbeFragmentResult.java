package eu.zavadil.ocr.core.probe.fragment;

import eu.zavadil.ocr.data.Fragment;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ProbeFragmentResult {

	ProbeFragment probeFragment;

	Fragment fragment;

	@Override
	public String toString() {
		StringBuilder sb = new StringBuilder();
		sb.append("Success: ");
		sb.append(this.probeFragment.getText().equals(this.getFragment().getText()) ? "YES" : "NO");
		sb.append("\n");
		sb.append("Path: ");
		sb.append(this.probeFragment.getPath());
		sb.append("\n");
		sb.append("Language: ");
		sb.append(this.probeFragment.getTemplate().getLanguage().name());
		sb.append("\n");
		sb.append("Original: '");
		sb.append(this.probeFragment.getText());
		sb.append("'\n");
		sb.append("Parsed: '");
		sb.append(this.getFragment().getText());
		sb.append("'\n");
		return sb.toString();
	}
}
