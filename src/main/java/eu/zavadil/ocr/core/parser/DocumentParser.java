package eu.zavadil.ocr.core.parser;

import eu.zavadil.ocr.core.parser.fragment.img.ImageFileWrapper;
import eu.zavadil.ocr.core.pipe.Pipe;
import eu.zavadil.ocr.data.Document;
import eu.zavadil.ocr.data.DocumentTemplate;
import eu.zavadil.ocr.data.Fragment;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class DocumentParser implements Pipe<ImageFileWrapper, Document, DocumentTemplate> {

	@Autowired
	FragmentParser fragmentParser;

	@Override
	public Document process(ImageFileWrapper input, DocumentTemplate template) {
		Document document = new Document();
		document.setImagePath(input.toString());
		document.setDocumentTemplate(template);

		template.getFragments().forEach(
			t -> {
				// todo: slice image
				ImageFileWrapper fragmentImage = input;
				Fragment fragment = this.fragmentParser.process(fragmentImage, t);
				document.getFragments().add(fragment);
			}
		);

		return document;
	}

}
