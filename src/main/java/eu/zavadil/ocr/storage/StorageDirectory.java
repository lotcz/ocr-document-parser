package eu.zavadil.ocr.storage;

import java.nio.file.Path;

public class StorageDirectory implements LocalPath {

	protected final FileStorage storage;

	protected final Path path;

	public StorageDirectory(FileStorage storage, Path path) {
		if (path.isAbsolute()) {
			throw new RuntimeException("Path must be relative!");
		}
		this.path = path.normalize();
		this.storage = storage;

		Path myFinalPath = this.asPath().toAbsolutePath().normalize();
		Path storagePath = storage.asPath().toAbsolutePath().normalize();

		if (!myFinalPath.startsWith(storagePath)) {
			throw new RuntimeException(String.format("Path %s is not within storage directory!", path.toString()));
		}

		if (this.storage.isAutoCreateEnabled()) {
			this.createDirectories();
		}
	}

	public StorageDirectory(FileStorage storage, String path) {
		this(storage, Path.of(path));
	}

	public StorageDirectory(StorageDirectory parentDirectory, String directory) {
		this(parentDirectory.storage, Path.of(parentDirectory.path.toString(), directory));
	}

	public Path asPath() {
		return Path.of(this.storage.asPath().toString(), this.path.toString()).normalize();
	}

	public StorageDirectory getParentDirectory() {
		return new StorageDirectory(this.storage, this.path.getParent());
	}

	@Override
	public String toString() {
		return this.path.toString();
	}

	public StorageDirectory createNext() {
		return new StorageDirectory(this.getParentDirectory(), this.createNextBase());
	}

	public StorageDirectory createSubdirectory(String name) {
		return new StorageDirectory(this, name);
	}

	public StorageFile createFile(String name) {
		return new StorageFile(this, name);
	}

}
