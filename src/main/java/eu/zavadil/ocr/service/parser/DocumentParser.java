package eu.zavadil.ocr.service.parser;

import eu.zavadil.java.util.IntegerUtils;
import eu.zavadil.ocr.data.parsed.document.DocumentState;
import eu.zavadil.ocr.data.parsed.document.DocumentStubWithPages;
import eu.zavadil.ocr.data.parsed.page.PageStubWithFragments;
import eu.zavadil.ocr.data.template.documentTemplate.DocumentTemplate;
import eu.zavadil.ocr.data.template.pageTemplate.PageTemplate;
import eu.zavadil.ocr.service.DocumentService;
import eu.zavadil.ocr.service.DocumentTemplateService;
import eu.zavadil.ocr.service.ImageService;
import eu.zavadil.ocr.service.PdfBoxWrapper;
import eu.zavadil.ocr.storage.ImageFile;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Component
@Slf4j
public class DocumentParser {

	@Autowired
	PageParser pageParser;

	@Autowired
	ImageService imageService;

	@Autowired
	PdfBoxWrapper pdf;

	@Autowired
	DocumentTemplateService documentTemplateService;

	@Autowired
	DocumentService documentService;

	@Transactional
	public DocumentStubWithPages parse(DocumentStubWithPages document) {
		log.info("Parsing document {}", document.getImagePath());

		document = this.documentService.deletePages(document);

		// load template
		DocumentTemplate template = this.documentTemplateService.getForDocument(document);
		if (template == null) {
			document.setState(DocumentState.NoTemplate);
			document = this.documentService.save(document);
			return document;
		}

		// check img
		ImageFile docImg = this.imageService.getImage(document.getImagePath());
		if (!docImg.exists()) {
			document.setState(DocumentState.NoImage);
			document = this.documentService.save(document);
			return document;
		}

		try {
			List<ImageFile> pageImages = this.imageService.extractPages(docImg);
			int max = Math.max(template.getPages().size(), pageImages.size());

			for (int i = 0; i < max; i++) {
				ImageFile img = i < pageImages.size() ? pageImages.get(i) : null;
				int pageNumber = i;
				PageTemplate pageTemplate = template.getPages().stream()
					.filter(p -> IntegerUtils.safeEquals(p.getPageNumber(), pageNumber))
					.findFirst().orElse(null);

				PageStubWithFragments page = new PageStubWithFragments();
				page.setDocumentId(document.getId());
				page.setPageTemplateId(pageTemplate == null ? null : pageTemplate.getId());
				page.setImagePath(img == null ? null : img.toString());
				page.setPageNumber(pageNumber);

				page = this.pageParser.parse(page, pageTemplate);
				document.getPages().add(page);
			}
		} catch (Exception e) {
			log.error("Error when parsing document pages {}", docImg.toString(), e);
			document.setState(DocumentState.Error);
		}

		List<String> errors = document.getPages().stream()
			.filter(p -> p.getState().getSeverity().equals(DocumentState.Severity.error))
			.map(p -> String.format("page %d - %s", p.getPageNumber(), p.getStateMessage()))
			.toList();
		boolean hasErrors = !errors.isEmpty();
		document.setState(hasErrors ? DocumentState.Error : DocumentState.Processed);
		document.setStateMessage(hasErrors ? String.join("\r\n", errors) : null);
		
		return this.documentService.save(document);
	}

}
