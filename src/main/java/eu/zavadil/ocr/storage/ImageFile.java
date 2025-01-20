package eu.zavadil.ocr.storage;

import org.springframework.http.MediaType;

import java.nio.file.Path;

public class ImageFile extends StorageFile {

	public ImageFile(FileStorage storage, Path file) {
		super(storage, file);
	}

	public ImageFile(FileStorage storage, String file) {
		super(storage, file);
	}

	public ImageFile(StorageDirectory directory, String file) {
		super(directory, file);
	}

	public ImageFile(StorageFile file) {
		super(file.storage, file.path);
	}

	public MediaType getMediaType() {
		return switch (this.getExtension().toLowerCase()) {
			case "jpg", "jpeg" -> MediaType.IMAGE_JPEG;
			case "png" -> MediaType.IMAGE_PNG;
			case "gif" -> MediaType.IMAGE_GIF;
			default -> MediaType.ALL;
		};
	}
}
