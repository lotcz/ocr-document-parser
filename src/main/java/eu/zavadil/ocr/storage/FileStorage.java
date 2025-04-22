package eu.zavadil.ocr.storage;

import eu.zavadil.ocr.data.parsed.folder.FolderChain;
import lombok.Getter;

import java.nio.file.Path;

public class FileStorage implements LocalPath {

	private final Path basePath;

	@Getter
	private final boolean autoCreateEnabled;

	public FileStorage(Path path, boolean autoCreateDirectories) {
		this.basePath = path;
		this.autoCreateEnabled = autoCreateDirectories;
	}

	public FileStorage(Path path) {
		this(path, false);
	}

	@Override
	public Path asPath() {
		return this.basePath;
	}

	public StorageDirectory getDirectory(Path path) {
		return new StorageDirectory(this, path);
	}

	public StorageDirectory getDirectory(String path) {
		return this.getDirectory(Path.of(path));
	}

	public StorageDirectory getDirectory(FolderChain folder) {
		return this.getDirectory(folder.toPath().toString());
	}

	public StorageDirectory getHomeDirectory() {
		return this.getDirectory("");
	}

	public StorageFile getFile(Path path) {
		return new StorageFile(this, path);
	}

	public StorageFile getFile(String path) {
		return this.getFile(Path.of(path));
	}

	public StorageFile getUnusedFileName(StorageFile file) {
		return file.getNextUnused();
	}
}
