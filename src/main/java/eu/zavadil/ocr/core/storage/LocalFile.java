package eu.zavadil.ocr.core.storage;

import java.io.File;
import java.nio.file.Path;

public interface LocalFile extends LocalPath {

	File asFile();

	@Override
	default Path asDirectory() {
		return this.asPath().getParent();
	}

	default String getFileName() {
		return this.asFile().getName();
	}

	default String getExtension() {
		String fileName = this.getFileName();
		String extension = "";

		int i = fileName.lastIndexOf('.');
		if (i > 0) {
			extension = fileName.substring(i + 1);
		}

		return extension;
	}

	@Override
	default String getBaseName() {
		String fileName = this.getFileName();
		String base;

		int i = fileName.lastIndexOf('.');
		if (i > 0) {
			base = fileName.substring(0, i);
		} else {
			base = fileName;
		}

		return base;
	}

	default String createNextBase() {
		return String.format("%s_%d.%s", this.getRegularName(), this.getNumber() + 1, this.getExtension());
	}

}
