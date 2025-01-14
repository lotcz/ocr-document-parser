package eu.zavadil.ocr.core.storage;

import java.io.File;
import java.nio.file.Path;

public class StorageFile extends StorageDirectory implements LocalFile {

	public StorageFile(FileStorage storage, Path file) {
		super(storage, file);
	}

	public StorageFile(FileStorage storage, String file) {
		super(storage, file);
	}

	public StorageFile(StorageDirectory directory, String file) {
		super(directory.storage, Path.of(directory.path.toString(), file));
	}

	public File asFile() {
		return this.asPath().toFile();
	}


	public StorageFile createNext() {
		return new StorageFile(this.getParentDirectory(), this.createNextBase());
	}

}
