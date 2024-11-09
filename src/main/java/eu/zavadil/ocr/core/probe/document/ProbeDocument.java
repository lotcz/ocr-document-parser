package eu.zavadil.ocr.core.probe.document;

import eu.zavadil.ocr.core.probe.ProbeItem;
import eu.zavadil.ocr.data.template.DocumentTemplate;
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
