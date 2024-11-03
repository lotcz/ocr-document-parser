package eu.zavadil.ocr.core.parser;

import eu.zavadil.ocr.core.parser.document.FragmentExtractor;
import eu.zavadil.ocr.core.parser.fragment.img.ImageFileWrapper;
import eu.zavadil.ocr.core.pipe.Pipe;
import eu.zavadil.ocr.data.document.Document;
import eu.zavadil.ocr.data.template.DocumentTemplate;
import eu.zavadil.ocr.data.document.Fragment;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class DocumentParser implements Pipe<ImageFileWrapper, Document, DocumentTemplate> {

	@Autowired
	FragmentExtractor fragmentExtractor;

	@Autowired
	FragmentParser fragmentParser;

	@Override
	public Document process(ImageFileWrapper input, DocumentTemplate template) {
		Document document = new Document();
		document.setImagePath(input.toString());
		document.setDocumentTemplate(template);

		template.getFragments().forEach(
			t -> {
				ImageFileWrapper fragmentImage = this.fragmentExtractor.process(input, t);
				Fragment fragment = this.fragmentParser.process(fragmentImage, t);
				document.getFragments().add(fragment);
			}
		);

		return document;
	}

}
