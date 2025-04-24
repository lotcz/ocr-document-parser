package eu.zavadil.ocr.service.parser;

import eu.zavadil.ocr.data.parsed.document.DocumentState;
import eu.zavadil.ocr.data.parsed.document.DocumentStubRepository;
import eu.zavadil.ocr.data.parsed.fragment.FragmentStub;
import eu.zavadil.ocr.data.parsed.fragment.FragmentStubRepository;
import eu.zavadil.ocr.data.parsed.page.PageStubWithFragments;
import eu.zavadil.ocr.data.template.fragmentTemplate.FragmentTemplate;
import eu.zavadil.ocr.data.template.pageTemplate.PageTemplate;
import eu.zavadil.ocr.service.*;
import eu.zavadil.ocr.storage.StorageFile;
import lombok.extern.slf4j.Slf4j;
import org.bytedeco.opencv.opencv_core.Mat;
import org.bytedeco.opencv.opencv_core.Size;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
@Slf4j
public class PageParser {

	@Autowired
	FragmentParser fragmentParser;

	@Autowired
	ImageService imageService;

	@Autowired
	OpenCvWrapper openCv;

	@Autowired
	PdfBoxWrapper pdf;

	@Autowired
	DocumentTemplateService documentTemplateService;

	@Autowired
	DocumentService documentService;

	@Autowired
	FragmentStubRepository fragmentStubRepository;

	@Autowired
	DocumentStubRepository documentStubRepository;

	public StorageFile extractFragmentImage(StorageFile pageImage, FragmentTemplate template) {
		if (template.getTop() == 0 && template.getLeft() == 0 && template.getWidth() >= 1 && template.getHeight() >= 1) {
			return pageImage;
		}

		Mat originalImage = this.openCv.load(pageImage);
		Size originalSize = originalImage.size();

		int left = (int) Math.round(template.getLeft() * originalSize.width());
		int top = (int) Math.round(template.getTop() * originalSize.height());
		int width = (int) Math.round(template.getWidth() * originalSize.width());
		int height = (int) Math.round(template.getHeight() * originalSize.height());

		log.info(
			"Cropping {} - {}x{} => {}x{}, left: {}, top: {}",
			template.getName(),
			originalSize.width(),
			originalSize.height(),
			width,
			height,
			left,
			top
		);

		Mat cropped = this.openCv.crop(originalImage, left, top, width, height);

		StorageFile croppedFile = pageImage
			.getParentDirectory()
			.createSubdirectory("fragments")
			.createSubdirectory(template.getName())
			.getFile(pageImage.getFileName());

		this.openCv.save(croppedFile, cropped);

		return croppedFile;
	}

	public PageStubWithFragments parse(PageStubWithFragments page, PageTemplate pageTemplate) {
		log.info("Parsing page {}", page.getPageNumber());

		page.getFragments().clear();

		if (pageTemplate == null) {
			page.setState(DocumentState.NoTemplate);
			return page;
		}

		// check img
		StorageFile pageImg = this.imageService.getImage(page.getImagePath());
		if (!pageImg.exists()) {
			page.setState(DocumentState.NoImage);
			return page;
		}

		try {
			pageTemplate.getFragments().forEach(
				ft -> {
					StorageFile fragmentImage = this.extractFragmentImage(pageImg, ft);
					FragmentStub fragment = new FragmentStub();
					if (page.getId() != null) fragment.setPageId(page.getId());
					fragment.setFragmentTemplateId(ft.getId());
					fragment.setImagePath(fragmentImage.toString());
					fragment = this.fragmentParser.process(fragment, ft);
					page.getFragments().add(fragment);
				}
			);
			page.setState(DocumentState.Processed);
		} catch (Exception e) {
			log.error("Error when parsing page {}", pageImg.toString(), e);
			page.setState(DocumentState.Error);
		}

		return page;
	}

}
