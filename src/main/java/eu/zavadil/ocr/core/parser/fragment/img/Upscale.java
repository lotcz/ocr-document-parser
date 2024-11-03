package eu.zavadil.ocr.core.parser.fragment.img;

import eu.zavadil.ocr.core.parser.fragment.FragmentPipeLine;
import eu.zavadil.ocr.data.FragmentTemplate;
import lombok.extern.slf4j.Slf4j;
import org.bytedeco.opencv.global.opencv_imgcodecs;
import org.bytedeco.opencv.global.opencv_imgproc;
import org.bytedeco.opencv.opencv_core.Mat;
import org.bytedeco.opencv.opencv_core.Size;
import org.decimal4j.util.DoubleRounder;
import org.springframework.stereotype.Component;

@Component
@Slf4j
public class Upscale extends FragmentPipeLine<ImageFileWrapper> {

	@Override
	public ImageFileWrapper processInternal(ImageFileWrapper input, FragmentTemplate settings) {
		Mat originalImage = opencv_imgcodecs.imread(input.toString());
		Size originalSize = originalImage.size();

		int minWidth = 800;
		int minHeight = 150;

		if (originalSize.width() > minWidth && originalSize.height() > minHeight) {
			log.info("No need to resize {}", input.toString());
			return input;
		}

		double upscaleRatioWidth = (double) minWidth / originalSize.width();
		double upscaleRatioHeight = (double) minHeight / originalSize.height();
		double upscaleRatio = upscaleRatioWidth > upscaleRatioWidth ? upscaleRatioWidth : upscaleRatioHeight;

		int upscaledWidth = (int) Math.round(originalSize.width() * upscaleRatio);
		int upscaledHeight = (int) Math.round(originalSize.height() * upscaleRatio);

		log.info(
			"Resizing {} by factor of {} to {}x{}",
			input.toString(),
			DoubleRounder.round(upscaleRatio, 2),
			upscaledWidth,
			upscaledHeight
		);

		Size scaleSize = new Size(upscaledWidth, upscaledHeight);
		Mat resizedImage = new Mat();
		opencv_imgproc.resize(originalImage, resizedImage, scaleSize, 0, 0, opencv_imgproc.INTER_CUBIC);

		ImageFileWrapper newFile = input.createNext();
		opencv_imgcodecs.imwrite(newFile.toString(), resizedImage);

		return newFile;
	}

}
