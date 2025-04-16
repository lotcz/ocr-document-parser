package eu.zavadil.ocr.storage;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
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

	public StorageFile getNext() {
		return new StorageFile(this.getParentDirectory(), this.createNextBase());
	}

	public StorageFile getNextUnused() {
		if (this.exists()) {
			return this.getNext().getNextUnused();
		}
		return this;
	}

	public StorageFile moveTo(StorageFile target, boolean forceOverwrite) {
		if (!this.exists()) {
			throw new RuntimeException(String.format("Source file %s does not exist, cannot move!", this.toString()));
		}
		if (target.exists()) {
			if (forceOverwrite) {
				target.delete();
			} else {
				throw new RuntimeException(String.format("Target file %s exists, cannot move!", target.toString()));
			}
		}
		try {
			target.createDirectories();
			Files.move(this.asPath(), target.asPath());
			return target;
		} catch (IOException e) {
			throw new RuntimeException(
				String.format("Error when moving file %s to %s!", this.toString(), target.toString()),
				e
			);
		}
	}

	public StorageFile moveTo(StorageFile target) {
		return moveTo(target, false);
	}

}
