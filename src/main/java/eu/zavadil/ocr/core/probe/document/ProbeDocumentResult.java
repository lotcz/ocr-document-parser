package eu.zavadil.ocr.core.probe.document;

import eu.zavadil.ocr.data.document.Document;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ProbeDocumentResult {

	ProbeDocument probeDocument;

	Document document;

	@Override
	public String toString() {
		StringBuilder sb = new StringBuilder();
		sb.append("Document");
		sb.append("\n");
		sb.append("========");
		sb.append("\n\n");
		sb.append("Success: ");
		sb.append("Yes");
		sb.append("\n");
		sb.append("Path: ");
		sb.append(this.document.getImagePath());
		sb.append("\n");
		sb.append("Language: ");
		sb.append(this.probeDocument.getDocumentTemplate().getLanguage().name());
		sb.append("\n\n");

		sb.append("Fragments");
		sb.append("\n");
		sb.append("---------");
		sb.append("\n\n");

		this.document.getFragments().forEach(
			f -> {
				sb.append("Name: ");
				sb.append(f.getFragmentTemplate().getName());
				sb.append("\n");
				sb.append("Text: ");
				sb.append(f.getText());
				sb.append("\n");
				sb.append("File: ");
				sb.append(f.getImagePath());
				sb.append("\n\n");
			}
		);

		return sb.toString();
	}
}
