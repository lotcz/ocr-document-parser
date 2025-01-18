package eu.zavadil.ocr.service;


import eu.zavadil.ocr.storage.StorageFile;
import org.bytedeco.opencv.global.opencv_core;
import org.bytedeco.opencv.global.opencv_imgcodecs;
import org.bytedeco.opencv.global.opencv_imgproc;
import org.bytedeco.opencv.opencv_core.Mat;
import org.bytedeco.opencv.opencv_core.Rect;
import org.bytedeco.opencv.opencv_core.Size;
import org.springframework.stereotype.Component;

@Component
public class OpenCvWrapper {

	public boolean canDecode(String path) {
		return opencv_imgcodecs.haveImageReader(path);
	}

	public boolean canEncode(String path) {
		return opencv_imgcodecs.haveImageWriter(path);
	}

	public Mat load(String path) {
		if (!this.canDecode(path)) {
			throw new RuntimeException(String.format("OpenCV cannot read format of %s", path));
		}
		return opencv_imgcodecs.imread(path);
	}

	public Mat load(StorageFile file) {
		return this.load(file.getAbsolutePath());
	}

	public void save(String path, Mat mat) {
		if (!this.canEncode(path)) {
			throw new RuntimeException(String.format("OpenCV cannot write format of %s", path));
		}
		opencv_imgcodecs.imwrite(path, mat);
	}

	public void save(StorageFile file, Mat mat) {
		this.save(file.getAbsolutePath(), mat);
	}

	public Mat invert(Mat input) {
		Mat output = new Mat();
		opencv_core.bitwise_not(input, output);
		return output;
	}

	public Mat resize(Mat input, int width, int height) {
		Size size = new Size(width, height);
		Mat output = new Mat();
		opencv_imgproc.resize(input, output, size, 0, 0, opencv_imgproc.INTER_CUBIC);
		return output;
	}

	public Mat resize(Mat input, double scale) {
		Size originalSize = input.size();
		int upscaledWidth = (int) Math.round(originalSize.width() * scale);
		int upscaledHeight = (int) Math.round(originalSize.height() * scale);
		return this.resize(input, upscaledWidth, upscaledHeight);
	}

	public Mat clamp(Mat input, int maxWidth, int maxHeight) {
		Size originalSize = input.size();
		final double scaleWidth = (double) maxWidth / originalSize.width();
		final double scaleHeight = (double) maxHeight / originalSize.height();
		final double finalScale = Math.min(scaleWidth, scaleHeight);
		if (finalScale >= 1) return input;
		return this.resize(input, finalScale);
	}

	public Mat grayscale(Mat input) {
		Mat grayscaleImage = new Mat();
		opencv_imgproc.cvtColor(input, grayscaleImage, opencv_imgproc.COLOR_BGR2GRAY);
		return grayscaleImage;
	}

	public Mat blackAndWhite(Mat input, double lowThresh, double highThresh, boolean adaptive, boolean toZero) {
		Mat output = new Mat();
		int arg = adaptive ? 0 : opencv_imgproc.THRESH_OTSU;
		if (toZero) arg += opencv_imgproc.THRESH_TOZERO;
		opencv_imgproc.threshold(input, output, lowThresh, highThresh, arg);
		return output;
	}

	public Mat blackAndWhite(Mat input, double lowThresh, double highThresh, boolean toZero) {
		return this.blackAndWhite(input, lowThresh, highThresh, false, toZero);
	}

	public Mat blackAndWhite(Mat input, boolean toZero) {
		return this.blackAndWhite(input, 127, 255, true, toZero);
	}

	public Mat blackAndWhite(Mat input) {
		return this.blackAndWhite(input, false);
	}

	public Mat crop(Mat input, int left, int top, int width, int height) {
		Size originalSize = input.size();
		if ((left + width) > originalSize.width()) {
			width = originalSize.width() - left;
		}
		if ((top + height) > originalSize.height()) {
			height = originalSize.height() - top;
		}
		return new Mat(input, new Rect(left, top, width, height));
	}
}
