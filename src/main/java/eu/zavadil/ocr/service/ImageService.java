package eu.zavadil.ocr.service;

import eu.zavadil.java.util.FileNameUtils;
import eu.zavadil.java.util.StringUtils;
import eu.zavadil.ocr.api.exceptions.BadRequestException;
import eu.zavadil.ocr.data.parsed.folder.FolderChain;
import eu.zavadil.ocr.storage.FileStorage;
import eu.zavadil.ocr.storage.ImageFile;
import eu.zavadil.ocr.storage.StorageDirectory;
import eu.zavadil.ocr.storage.StorageFile;
import lombok.NonNull;
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

	public StorageDirectory getDirectory(FolderChain folder) {
		return this.fileStorage.getDirectory(folder);
	}

	public ImageFile getImage(Path path) {
		return new ImageFile(this.fileStorage.getFile(path));
	}

	public ImageFile getImage(String path) {
		return this.getImage(Path.of(StringUtils.safeTrim(path)));
	}

	public Path getImageSizePath(Path path, Size size) {
		if (size == Size.original) return path;
		String fileName = path.getFileName().toString();
		if (StringUtils.safeEqualsIgnoreCase("pdf", FileNameUtils.extractExtension(fileName))) {
			return this.getImageSizePath(
				Path.of(
					path.getParent().toString(),
					String.format("%s.%s", FileNameUtils.extractBaseName(fileName), "png")
				),
				size
			);
		}
		return Path.of("resized", size.name(), path.toString());
	}

	public ImageFile createClampedImage(ImageFile source, ImageFile target, Size size) {
		if (!source.exists()) return null;
		if (source.getExtension().equalsIgnoreCase("pdf")) {
			ImageFile page0 = this.pdf.extractPage(source, source.getParentDirectory(), 0);
			if (page0 == null || !page0.exists()) return null;
			try {
				return this.createClampedImage(page0, target, size);
			} finally {
				page0.delete();
			}
		}

		if (!this.openCv.canDecode(source.getAbsolutePath())) {
			log.warn("Cannot decode image {}", source);
			return null;
		}

		if (size == Size.original) return source;
		Mat original = this.openCv.load(source);
		Mat clamped = this.openCv.clamp(original, size.maxWidth, size.maxHeight);
		this.openCv.save(target, clamped);

		return target;
	}

	public ImageFile getImage(Path path, Size size) {
		ImageFile original = this.getImage(path);
		ImageFile resized = this.getImage(this.getImageSizePath(path, size));
		if (resized.exists() || !original.exists()) return resized;
		return this.createClampedImage(original, resized, size);
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

	public List<ImageFile> extractPages(@NonNull ImageFile image) {
		if (!image.exists()) {
			return List.of();
		}

		// try to decode pages from PDF
		if (image.getExtension().equalsIgnoreCase("pdf")) {
			List<ImageFile> convertedImgs = this.pdf.extractPages(image, image.getParentDirectory());
			log.info("PDF document {} converted into {} pages.", image, convertedImgs.size());
			return convertedImgs;
		}

		StorageFile newFile = image.getParentDirectory().getUnusedFile(image.getFileName());
		image.copyTo(newFile);
		return List.of(new ImageFile(newFile));
	}

	public ImageFile upload(StorageDirectory directory, MultipartFile file) {
		String originalFileName = FileNameUtils.extractFileName(file.getOriginalFilename());
		String fileName = String.format(
			"%s.%s",
			FileNameUtils.slugify(FileNameUtils.extractBaseName(originalFileName)),
			FileNameUtils.extractExtension(originalFileName)
		);
		ImageFile newFile = new ImageFile(directory.getUnusedFile(fileName));
		newFile.upload(file);

		if (!(newFile.getExtension().equalsIgnoreCase("pdf") || this.openCv.canDecode(newFile.getAbsolutePath()))) {
			newFile.delete();
			throw new BadRequestException(String.format("Cannot decode image %s", file.getOriginalFilename()));
		}

		return newFile;
	}

	public ImageFile upload(FolderChain directory, MultipartFile file) {
		return this.upload(this.fileStorage.getDirectory(directory), file);
	}

	public ImageFile upload(String directory, MultipartFile file) {
		return this.upload(this.fileStorage.getDirectory(directory), file);
	}
}
