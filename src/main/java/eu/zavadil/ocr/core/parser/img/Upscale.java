package eu.zavadil.ocr.core.parser.img;

import eu.zavadil.ocr.core.pipe.PipeLineBase;
import eu.zavadil.ocr.core.settings.ProcessingSettings;
import lombok.extern.slf4j.Slf4j;
import org.bytedeco.opencv.global.opencv_imgcodecs;
import org.bytedeco.opencv.global.opencv_imgproc;
import org.bytedeco.opencv.opencv_core.Mat;
import org.bytedeco.opencv.opencv_core.Size;
import org.decimal4j.util.DoubleRounder;
import org.springframework.stereotype.Component;

@Component
@Slf4j
public class Upscale extends PipeLineBase<ImageFileWrapper> {

	@Override
	public ImageFileWrapper processInternal(ImageFileWrapper input, ProcessingSettings settings) {
		Mat originalImage = opencv_imgcodecs.imread(input.toString());
		Size originalSize = originalImage.size();

		if (originalSize.width() > settings.getFragmentMinWidth() && originalSize.height() > settings.getFragmentMinHeight()) {
			log.info("No need to resize {}", input.toString());
			return input;
		}

		double upscaleRatioWidth = (double) settings.getFragmentMinWidth() / originalSize.width();
		double upscaleRatioHeight = (double) settings.getFragmentMinHeight() / originalSize.height();
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
