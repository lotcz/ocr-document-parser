package eu.zavadil.ocr.core.parser.fragment;

import eu.zavadil.ocr.core.parser.FragmentParser;
import eu.zavadil.ocr.core.pipe.PipeLineBase;
import eu.zavadil.ocr.core.storage.StorageFile;
import eu.zavadil.ocr.data.template.FragmentTemplate;
import lombok.extern.slf4j.Slf4j;
import org.bytedeco.opencv.global.opencv_imgcodecs;
import org.bytedeco.opencv.opencv_core.Mat;
import org.bytedeco.opencv.opencv_core.Rect;
import org.bytedeco.opencv.opencv_core.Size;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
@Slf4j
public class FragmentExtractor extends PipeLineBase<StorageFile, FragmentTemplate> {

	@Autowired
	FragmentParser fragmentParser;

	@Override
	public StorageFile process(StorageFile input, FragmentTemplate template) {
		if (template.getTop() == 0 && template.getLeft() == 0 && template.getWidth() >= 1 && template.getHeight() >= 1) {
			log.info("No need to extract {} from {}", template.getName(), input.toString());
			return input;
		}

		Mat originalImage = opencv_imgcodecs.imread(input.getAbsolutePath());
		Size originalSize = originalImage.size();

		int left = (int) Math.round(template.getLeft() * originalSize.width());
		int top = (int) Math.round(template.getTop() * originalSize.height());
		int width = (int) Math.round(template.getWidth() * originalSize.width());
		int height = (int) Math.round(template.getHeight() * originalSize.height());

		if ((left + width) > originalSize.width()) {
			width = originalSize.width() - left;
		}

		if ((top + height) > originalSize.height()) {
			height = originalSize.height() - top;
		}

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

		Mat cropped = new Mat(originalImage, new Rect(left, top, width, height));

		StorageFile croppedFile = input
			.getParentDirectory()
			.createSubdirectory(template.getName())
			.createFile(input.getFileName());

		opencv_imgcodecs.imwrite(croppedFile.getAbsolutePath(), cropped);

		return croppedFile;
	}

}
