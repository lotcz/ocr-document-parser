package eu.zavadil.ocr.service;

import eu.zavadil.ocr.data.document.Document;
import eu.zavadil.ocr.data.documentTemplate.DocumentTemplate;
import eu.zavadil.ocr.data.fragment.Fragment;
import eu.zavadil.ocr.data.fragmentTemplate.FragmentTemplate;
import eu.zavadil.ocr.storage.StorageFile;
import lombok.extern.slf4j.Slf4j;
import org.bytedeco.opencv.opencv_core.Mat;
import org.bytedeco.opencv.opencv_core.Size;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
@Slf4j
public class DocumentParser {

	@Autowired
	FragmentParser fragmentParser;

	@Autowired
	ImageService imageService;

	@Autowired
	OpenCvWrapper openCv;

	@Autowired
	PdfBoxWrapper pdf;

	@Autowired
	DocumentTemplateCache documentTemplateCache;

	public Document parse(Document document) {
		// load template
		DocumentTemplate template = document.getDocumentTemplate();
		if (template == null) {
			throw new RuntimeException(String.format("Document %s has no template!", document));
		}

		// check img
		StorageFile docImg = this.imageService.getImage(document.getImagePath());
		if (!docImg.exists()) {
			throw new RuntimeException(String.format("Document image %s doesnt exist!", docImg));
		}

		template.getFragments().forEach(
			t -> {
				StorageFile fragmentImage = this.extractFragmentImage(docImg, t);
				Fragment fragment = document.getFragments()
					.stream()
					.filter(f -> f.getFragmentTemplate().equals(t))
					.findAny()
					.orElse(null);
				if (fragment == null) {
					fragment = new Fragment();
					fragment.setFragmentTemplate(t);
					fragment.setDocument(document);
					document.getFragments().add(fragment);
				}
				fragment.setImagePath(fragmentImage.toString());
				this.fragmentParser.process(fragment);
			}
		);

		return document;
	}

	public StorageFile extractFragmentImage(Document document, FragmentTemplate template) {
		return this.extractFragmentImage(this.imageService.getImage(document.getImagePath()), template);
	}

	public StorageFile extractFragmentImage(StorageFile documentImage, FragmentTemplate template) {
		if (template.getTop() == 0 && template.getLeft() == 0 && template.getWidth() >= 1 && template.getHeight() >= 1) {
			log.info("No need to extract fragment {} from {}", template.getName(), documentImage.toString());
			return documentImage;
		}

		Mat originalImage = this.openCv.load(documentImage);
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

		StorageFile croppedFile = documentImage
			.getParentDirectory()
			.createSubdirectory(documentImage.getRegularName())
			.createSubdirectory(template.getName())
			.createFile(documentImage.getFileName());

		this.openCv.save(croppedFile, cropped);

		return croppedFile;
	}
}
