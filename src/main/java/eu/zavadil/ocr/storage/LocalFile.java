package eu.zavadil.ocr.storage;

import eu.zavadil.java.util.FileNameUtils;
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
		return FileNameUtils.extractExtension(this.getFileName());
	}

	@Override
	default String getBaseName() {
		return FileNameUtils.extractBaseName(this.getFileName());
	}

	default String createNextBase() {
		return String.format("%s_%d.%s", this.getRegularName(), this.getNumber() + 1, this.getExtension());
	}

	default void upload(MultipartFile multipartFile) {
		try {
			if (multipartFile.isEmpty()) {
				throw new RuntimeException("Multipart file is empty!");
			}
			Path destinationFile = this.asPath();
			try (InputStream inputStream = multipartFile.getInputStream()) {
				Files.copy(inputStream, destinationFile, StandardCopyOption.REPLACE_EXISTING);
			}
		} catch (IOException e) {
			throw new RuntimeException(String.format("Failed to store multipart file into %s", this.getAbsolutePath()), e);
		}
	}
}
