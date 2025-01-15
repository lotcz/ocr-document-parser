package eu.zavadil.ocr.service;

import eu.zavadil.ocr.data.document.Document;
import eu.zavadil.ocr.data.document.Fragment;
import eu.zavadil.ocr.storage.FileStorage;
import eu.zavadil.ocr.storage.StorageDirectory;
import eu.zavadil.ocr.storage.StorageFile;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.nio.file.Path;

@Service
public class ImageService {

	@Autowired
	private FileStorage fileStorage;

	public ImageService() {
	}

	public StorageDirectory getImageDirectory() {
		return this.fileStorage.getHomeDirectory().createSubdirectory("img");
	}

	public StorageDirectory getDirectory(Path path) {
		return this.fileStorage.getDirectory(path);
	}

	public StorageDirectory getDirectory(String path) {
		return this.getDirectory(Path.of(path));
	}

	public StorageFile getFile(Path path) {
		return this.fileStorage.getFile(path);
	}

	public StorageFile getFile(String path) {
		return this.getFile(Path.of(path));
	}

	public StorageFile getDocumentImage(Document document) {
		return this.getFile(document.getImagePath());
	}

	public StorageFile getFragmentImage(Fragment fragment) {
		return this.getFile(fragment.getImagePath());
	}

}
