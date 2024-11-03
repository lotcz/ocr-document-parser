package eu.zavadil.ocr.core.parser.document;

import eu.zavadil.ocr.core.parser.FragmentParser;
import eu.zavadil.ocr.core.parser.fragment.img.ImageFileWrapper;
import eu.zavadil.ocr.core.pipe.PipeLineBase;
import eu.zavadil.ocr.data.FragmentTemplate;
import lombok.extern.slf4j.Slf4j;
import org.bytedeco.opencv.global.opencv_imgcodecs;
import org.bytedeco.opencv.opencv_core.Mat;
import org.bytedeco.opencv.opencv_core.Rect;
import org.bytedeco.opencv.opencv_core.Size;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
@Slf4j
public class FragmentExtractor extends PipeLineBase<ImageFileWrapper, FragmentTemplate> {

	@Autowired
	FragmentParser fragmentParser;

	@Override
	public ImageFileWrapper process(ImageFileWrapper input, FragmentTemplate template) {
		if (template.getTop() == 0 && template.getLeft() == 0 && template.getWidth() >= 1 && template.getHeight() >= 1) {
			log.info("No need to extract {} from {}", template.getName(), input.toString());
			return input;
		}

		Mat originalImage = opencv_imgcodecs.imread(input.toString());
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
			"Cropping {} - {}x{}, left: {}, top: {} from original {}x{}",
			template.getName(),
			width,
			height,
			left,
			top,
			originalSize.width(),
			originalSize.height()
		);

		Mat cropped = new Mat(originalImage, new Rect(left, top, width, height));

		ImageFileWrapper croppedFile = input.createSub(template.getName());
		croppedFile.createDirectories();
		opencv_imgcodecs.imwrite(croppedFile.toString(), cropped);

		return croppedFile;
	}

}
