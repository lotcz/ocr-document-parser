package eu.zavadil.ocr.probe.document;

import eu.zavadil.ocr.data.documentTemplate.DocumentTemplate;
import eu.zavadil.ocr.probe.ProbeItem;
import lombok.Data;
import lombok.EqualsAndHashCode;

@EqualsAndHashCode(callSuper = true)
@Data
public class ProbeDocument extends ProbeItem {

	private DocumentTemplate documentTemplate;

	public ProbeDocument(String path, DocumentTemplate documentTemplate) {
		super(path);
		this.documentTemplate = documentTemplate;
	}

}
