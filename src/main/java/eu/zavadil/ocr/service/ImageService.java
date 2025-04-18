package eu.zavadil.ocr.service;

import eu.zavadil.java.util.FileNameUtils;
import eu.zavadil.java.util.StringUtils;
import eu.zavadil.ocr.api.exceptions.BadRequestException;
import eu.zavadil.ocr.data.folder.FolderChain;
import eu.zavadil.ocr.storage.FileStorage;
import eu.zavadil.ocr.storage.ImageFile;
import eu.zavadil.ocr.storage.StorageDirectory;
import lombok.extern.slf4j.Slf4j;
import org.bytedeco.opencv.opencv_core.Mat;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.Path;
import java.util.List;

@Service
@Slf4j
public class ImageService {

	@Autowired
	private FileStorage fileStorage;

	@Autowired
	OpenCvWrapper openCv;

	@Autowired
	PdfBoxWrapper pdf;

	public static enum Size {
		original(0, 0),
		tiny(35, 35),
		thumb(150, 150),
		preview(900, 800);

		private final int maxWidth;

		private final int maxHeight;

		Size(int maxWidth, int maxHeight) {
			this.maxWidth = maxWidth;
			this.maxHeight = maxHeight;
		}
	}

	public ImageFile getImage(Path path) {
		return new ImageFile(this.fileStorage.getFile(path));
	}

	public ImageFile getImage(String path) {
		return this.getImage(Path.of(StringUtils.safeTrim(path)));
	}

	public Path getImageSizePath(Path path, Size size) {
		if (size == Size.original) return path;
		return Path.of("resized", size.name(), path.toString());
	}

	public void createClampedImage(ImageFile source, ImageFile target, Size size) {
		if (size == Size.original) return;
		Mat original = this.openCv.load(source);
		Mat clamped = this.openCv.clamp(original, size.maxWidth, size.maxHeight);
		this.openCv.save(target, clamped);
	}

	public ImageFile getImage(Path path, Size size) {
		ImageFile original = this.getImage(path);
		if (size == Size.original) return original;
		ImageFile resized = this.getImage(this.getImageSizePath(path, size));
		if (resized.exists() || !original.exists()) return resized;
		this.createClampedImage(original, resized, size);
		return resized;
	}

	public ImageFile getImage(String path, Size size) {
		return this.getImage(Path.of(StringUtils.safeTrim(path)), size);
	}

	public void delete(ImageFile file) {
		this.deleteAllResized(file);
		file.delete();
	}

	public void delete(Path path) {
		this.delete(this.getImage(path));
	}

	public void delete(String path) {
		this.delete(this.getImage(path));
	}

	public void delete(Path path, Size size) {
		this.getImage(this.getImageSizePath(path, size)).delete();
	}

	public void deleteAllResized(ImageFile file) {
		for (Size size : Size.values()) {
			if (size != Size.original) {
				this.delete(file.asRelativePath(), size);
			}
		}
	}

	public List<ImageFile> upload(StorageDirectory directory, MultipartFile file) {
		String originalFileName = FileNameUtils.extractFileName(file.getOriginalFilename());
		String fileName = String.format(
			"%s.%s",
			FileNameUtils.slugify(FileNameUtils.extractBaseName(originalFileName)),
			FileNameUtils.extractExtension(originalFileName)
		);
		ImageFile newFile = new ImageFile(this.fileStorage.getUnusedFileName(directory.getFile(fileName)));
		newFile.upload(file);

		// image is OK
		if (this.openCv.canDecode(newFile.getAbsolutePath())) {
			return List.of(newFile);
		}

		// try to decode pages from PDF
		if (newFile.getExtension().equalsIgnoreCase("pdf")) {
			List<ImageFile> convertedImgs = this.pdf.pdfToImage(newFile, newFile.getParentDirectory());
			if (convertedImgs.isEmpty()) {
				throw new RuntimeException(String.format("PDF document %s has no pages!", newFile));
			}
			log.info("PDF document {} converted into {} pages.", newFile, convertedImgs.size());
			newFile.delete();
			return convertedImgs;
		}

		// image not okay
		newFile.delete();
		throw new BadRequestException(String.format("Uploaded file %s cannot be decoded as image or PDF!", fileName));
	}

	public List<ImageFile> upload(String directory, MultipartFile file) {
		return this.upload(this.fileStorage.getDirectory(directory), file);
	}

	public List<ImageFile> upload(FolderChain directory, MultipartFile file) {
		return this.upload(directory.toPath().toString(), file);
	}
}
