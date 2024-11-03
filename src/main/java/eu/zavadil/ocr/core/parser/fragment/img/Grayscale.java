package eu.zavadil.ocr.core.parser.fragment.img;

import eu.zavadil.ocr.core.parser.fragment.FragmentPipeLine;
import eu.zavadil.ocr.data.FragmentTemplate;
import lombok.extern.slf4j.Slf4j;
import org.bytedeco.opencv.global.opencv_imgcodecs;
import org.bytedeco.opencv.global.opencv_imgproc;
import org.bytedeco.opencv.opencv_core.Mat;
import org.springframework.stereotype.Component;

@Component
@Slf4j
public class Grayscale extends FragmentPipeLine<ImageFileWrapper> {

	@Override
	public ImageFileWrapper processInternal(ImageFileWrapper input, FragmentTemplate settings) {
		Mat originalImage = opencv_imgcodecs.imread(input.toString());
		Mat grayscaleImage = new Mat();
		opencv_imgproc.cvtColor(originalImage, grayscaleImage, opencv_imgproc.COLOR_BGR2GRAY);
		ImageFileWrapper newFile = input.createNext();
		opencv_imgcodecs.imwrite(newFile.toString(), grayscaleImage);
		return newFile;
	}

}
