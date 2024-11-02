package eu.zavadil.ocr.core.probe;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ProbeResult {

	ProbeFile probeFile;

	String parsedText;

	@Override
	public String toString() {
		StringBuilder sb = new StringBuilder();
		sb.append("Success: ");
		sb.append(this.probeFile.getText().equals(this.getParsedText()) ? "YES" : "NO");
		sb.append("\n");
		sb.append("Path: ");
		sb.append(this.probeFile.getPath());
		sb.append("\n");
		sb.append("Language: ");
		sb.append(this.probeFile.getLanguage().name());
		sb.append("\n");
		sb.append("Original: '");
		sb.append(this.probeFile.getText());
		sb.append("'\n");
		sb.append("Parsed: '");
		sb.append(this.getParsedText());
		sb.append("'\n");
		return sb.toString();
	}
}
