package eu.zavadil.ocr.service;

import eu.zavadil.java.spring.common.entity.EntityBase;
import eu.zavadil.ocr.data.document.DocumentState;
import eu.zavadil.ocr.data.document.DocumentStub;
import eu.zavadil.ocr.data.document.DocumentStubRepository;
import eu.zavadil.ocr.data.documentTemplate.DocumentTemplate;
import eu.zavadil.ocr.data.fragment.FragmentStub;
import eu.zavadil.ocr.data.fragment.FragmentStubRepository;
import eu.zavadil.ocr.data.fragmentTemplate.FragmentTemplate;
import eu.zavadil.ocr.storage.StorageFile;
import lombok.extern.slf4j.Slf4j;
import org.bytedeco.opencv.opencv_core.Mat;
import org.bytedeco.opencv.opencv_core.Size;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

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
	DocumentTemplateService documentTemplateService;

	@Autowired
	FragmentStubRepository fragmentStubRepository;

	@Autowired
	DocumentStubRepository documentStubRepository;

	@Transactional
	public DocumentStub parse(DocumentStub document) {
		log.info("Parsing document {}", document.getImagePath());

		// load template
		DocumentTemplate template = this.documentTemplateService.getForDocument(document);
		if (template == null) {
			document.setState(DocumentState.NoTemplate);
			this.documentStubRepository.save(document);
			return document;
		}

		// check img
		StorageFile docImg = this.imageService.getImage(document.getImagePath());
		if (!docImg.exists()) {
			document.setState(DocumentState.NoImage);
			this.documentStubRepository.save(document);
			return document;
		}

		List<FragmentStub> fragments = this.fragmentStubRepository.findAllByDocumentId(document.getId());

		try {
			template.getFragments().forEach(
				ft -> {
					StorageFile fragmentImage = this.extractFragmentImage(docImg, ft);
					FragmentStub fragment = fragments.stream()
						.filter(f -> f.getFragmentTemplateId() == ft.getId())
						.findFirst()
						.orElse(null);
					if (fragment == null) {
						fragment = new FragmentStub();
					} else {
						fragments.remove(fragment);
					}
					fragment.setDocumentId(document.getId());
					fragment.setFragmentTemplateId(ft.getId());
					fragment.setImagePath(fragmentImage.toString());
					this.fragmentParser.process(fragment, ft);
					this.fragmentStubRepository.save(fragment);
				}
			);
			document.setState(DocumentState.Processed);
		} catch (Exception e) {
			log.error("Error when parsing document {}", docImg.toString(), e);
			document.setState(DocumentState.Error);
		}

		this.fragmentStubRepository.deleteAllById(fragments.stream().map(EntityBase::getId).toList());
		this.documentStubRepository.save(document);
		return document;
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
			.getFile(documentImage.getFileName());

		this.openCv.save(croppedFile, cropped);

		return croppedFile;
	}
}
