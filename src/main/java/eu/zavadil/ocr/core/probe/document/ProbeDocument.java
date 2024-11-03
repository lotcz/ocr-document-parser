package eu.zavadil.ocr.core.probe.document;

import eu.zavadil.ocr.core.probe.ProbeItem;
import lombok.Data;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
@Data
public class ProbeDocument extends ProbeItem {

	@Autowired
	ProbeDocumentTemplate documentTemplate;

	public ProbeDocument() {
		super("/img/java-ocr-1.png");
	}

}
