package eu.zavadil.ocr.core.parser.fragment.img;

import eu.zavadil.ocr.core.parser.fragment.FragmentPipeLine;
import eu.zavadil.ocr.core.storage.StorageFile;
import eu.zavadil.ocr.data.template.FragmentTemplate;
import lombok.extern.slf4j.Slf4j;
import org.bytedeco.opencv.global.opencv_imgcodecs;
import org.bytedeco.opencv.global.opencv_imgproc;
import org.bytedeco.opencv.opencv_core.Mat;
import org.bytedeco.opencv.opencv_core.Size;
import org.springframework.stereotype.Component;

@Component
@Slf4j
public class Upscale extends FragmentPipeLine<StorageFile> {

	@Override
	public StorageFile processInternal(StorageFile input, FragmentTemplate settings) {
		Mat originalImage = opencv_imgcodecs.imread(input.getAbsolutePath());
		Size originalSize = originalImage.size();

		double upscaleRatio = 1.5;

		int upscaledWidth = (int) Math.round(originalSize.width() * upscaleRatio);
		int upscaledHeight = (int) Math.round(originalSize.height() * upscaleRatio);

		log.info("Resizing {} by factor of {} to {}x{}", input, upscaleRatio, upscaledWidth, upscaledHeight);

		Size scaleSize = new Size(upscaledWidth, upscaledHeight);
		Mat resizedImage = new Mat();
		opencv_imgproc.resize(originalImage, resizedImage, scaleSize, 0, 0, opencv_imgproc.INTER_CUBIC);

		StorageFile newFile = input.createNext();
		opencv_imgcodecs.imwrite(newFile.getAbsolutePath(), resizedImage);

		return newFile;
	}

}
