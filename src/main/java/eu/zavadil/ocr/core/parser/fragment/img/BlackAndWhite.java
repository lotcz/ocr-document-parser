package eu.zavadil.ocr.core.parser.fragment.img;

import eu.zavadil.ocr.core.parser.fragment.FragmentPipeLine;
import eu.zavadil.ocr.data.FragmentTemplate;
import lombok.extern.slf4j.Slf4j;
import org.bytedeco.opencv.global.opencv_core;
import org.bytedeco.opencv.global.opencv_imgcodecs;
import org.bytedeco.opencv.global.opencv_imgproc;
import org.bytedeco.opencv.opencv_core.Mat;
import org.springframework.stereotype.Component;

@Component
@Slf4j
public class BlackAndWhite extends FragmentPipeLine<ImageFileWrapper> {

	@Override
	public ImageFileWrapper processInternal(ImageFileWrapper input, FragmentTemplate settings) {
		Mat originalImage = opencv_imgcodecs.imread(input.toString(), opencv_imgcodecs.IMREAD_GRAYSCALE);
		Mat invertedImage = new Mat();
		opencv_core.bitwise_not(originalImage, invertedImage);
		Mat blackAndWhiteImage = new Mat();
		opencv_imgproc.threshold(
			invertedImage,
			blackAndWhiteImage,
			(double) 127,
			(double) 255,
			opencv_imgproc.THRESH_OTSU + opencv_imgproc.THRESH_TOZERO
		);
		ImageFileWrapper newFile = input.createNext();
		opencv_imgcodecs.imwrite(newFile.toString(), blackAndWhiteImage);
		return newFile;
	}

}
