package eu.zavadil.ocr.core.parser;

import eu.zavadil.ocr.data.document.Document;
import eu.zavadil.ocr.data.document.Fragment;
import eu.zavadil.ocr.data.template.DocumentTemplate;
import eu.zavadil.ocr.data.template.FragmentTemplate;
import eu.zavadil.ocr.storage.ImageService;
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

	public Document parse(Document document) {
		DocumentTemplate template = document.getDocumentTemplate();
		template.getFragments().forEach(
			t -> {
				StorageFile fragmentImage = this.extractFragmentImage(document, t);
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
		return this.extractFragmentImage(this.imageService.getDocumentImage(document), template);
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
