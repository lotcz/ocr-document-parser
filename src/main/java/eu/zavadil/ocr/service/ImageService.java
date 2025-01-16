package eu.zavadil.ocr.service;

import eu.zavadil.ocr.storage.FileStorage;
import eu.zavadil.ocr.storage.ImageFile;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.nio.file.Path;

@Service
public class ImageService {

	@Autowired
	private FileStorage fileStorage;

	public ImageFile getFile(Path path) {
		return new ImageFile(this.fileStorage.getFile(path));
	}

	public ImageFile getFile(String path) {
		return this.getFile(Path.of(path));
	}

}
