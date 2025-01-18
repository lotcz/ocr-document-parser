package eu.zavadil.ocr.storage;

import eu.zavadil.java.util.StringUtils;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;

public interface LocalPath {

	Path asPath();

	default Path asDirectory() {
		return this.asPath();
	}

	default String getAbsolutePath() {
		return this.asPath().toAbsolutePath().toString();
	}

	default boolean exists() {
		return Files.exists(this.asPath());
	}

	default boolean equals(LocalPath other) {
		if (other == null) return false;
		if (other == this) return true;
		return StringUtils.safeEquals(other.getAbsolutePath(), this.getAbsolutePath());
	}

	default void delete() {
		if (!this.exists()) return;
		try {
			Files.delete(this.asPath());
		} catch (IOException e) {
			throw new RuntimeException(String.format("Failed to delete %s", this.getAbsolutePath()), e);
		}
	}

	default void createDirectories() {
		try {
			Files.createDirectories(this.asDirectory());
		} catch (IOException e) {
			throw new RuntimeException(String.format("Failed to create directories %s", this.asDirectory().toString()), e);
		}
	}

	default String getBaseName() {
		return this.asPath().getFileName().toString();
	}

	default String getRegularName() {
		String baseName = this.getBaseName();
		String regular;

		int i = baseName.lastIndexOf('_');
		if (i > 0) {
			regular = baseName.substring(0, i);
		} else {
			regular = baseName;
		}

		return regular;
	}

	default int getNumber() {
		String baseName = this.getBaseName();
		int n = 0;

		int i = baseName.lastIndexOf('_');
		if (i > 0) {
			String nStr = baseName.substring(i + 1);
			n = Integer.parseInt(nStr);
		}

		return n;
	}

	default String createNextBase() {
		return String.format("%s_%d", this.getRegularName(), this.getNumber() + 1);
	}

}
