package eu.zavadil.ocr.storage;

import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;

public interface LocalFile extends LocalPath {

	File asFile();

	@Override
	default boolean exists() {
		return this.asFile().isFile();
	}

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

	default void upload(MultipartFile multipartFile) {
		try {
			if (multipartFile.isEmpty()) {
				throw new RuntimeException("Failed to store empty file.");
			}
			Path destinationFile = this.asPath();
			try (InputStream inputStream = multipartFile.getInputStream()) {
				Files.copy(inputStream, destinationFile, StandardCopyOption.REPLACE_EXISTING);
			}
		} catch (IOException e) {
			throw new RuntimeException(String.format("Failed to store file %s", this.getAbsolutePath()), e);
		}
	}
}
