package eu.zavadil.ocr.storage;

import java.nio.file.Path;

public class StorageDirectory implements LocalPath {

	protected final FileStorage storage;

	protected final Path path;

	public StorageDirectory(FileStorage storage, Path path) {
		if (path.isAbsolute()) {
			throw new RuntimeException(String.format("Path [%s] is absolute! Storage directory path must be relative!", path.toString()));
		}
		this.path = path.normalize();
		this.storage = storage;

		Path myFinalPath = this.asPath().toAbsolutePath().normalize();
		Path storagePath = storage.asPath().toAbsolutePath().normalize();

		if (!myFinalPath.startsWith(storagePath)) {
			throw new RuntimeException(String.format("Path %s is not within storage directory!", path.toString()));
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

	public Path asRelativePath() {
		return this.path;
	}

	@Override
	public String toString() {
		return this.path.toString();
	}

	public StorageDirectory getParentDirectory() {
		return new StorageDirectory(this.storage, this.path.getParent());
	}

	public StorageDirectory getNext() {
		return new StorageDirectory(this.getParentDirectory(), this.createNextBase());
	}

	public StorageDirectory getSubdirectory(String name) {
		return new StorageDirectory(this, name);
	}

	public StorageFile getFile(String name) {
		return new StorageFile(this, name);
	}

	public StorageFile getUnusedFile(String name) {
		return this.getFile(name).getNextUnused();
	}

}
