package eu.zavadil.ocr.core.parser;

import eu.zavadil.ocr.core.parser.fragment.FragmentExtractor;
import eu.zavadil.ocr.core.pipe.Pipe;
import eu.zavadil.ocr.core.storage.StorageFile;
import eu.zavadil.ocr.data.document.Document;
import eu.zavadil.ocr.data.document.Fragment;
import eu.zavadil.ocr.data.template.DocumentTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class DocumentParser implements Pipe<StorageFile, Document, DocumentTemplate> {

	@Autowired
	FragmentExtractor fragmentExtractor;

	@Autowired
	FragmentParser fragmentParser;

	@Override
	public Document process(StorageFile input, DocumentTemplate template) {
		Document document = new Document();
		document.setImagePath(input.toString());
		document.setDocumentTemplate(template);

		template.getFragments().forEach(
			t -> {
				StorageFile fragmentImage = this.fragmentExtractor.process(input, t);
				Fragment fragment = this.fragmentParser.process(fragmentImage, t);
				document.getFragments().add(fragment);
			}
		);

		return document;
	}

}
