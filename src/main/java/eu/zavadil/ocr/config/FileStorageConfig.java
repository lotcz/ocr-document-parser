package eu.zavadil.ocr.config;

import eu.zavadil.ocr.storage.FileStorage;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.nio.file.Files;
import java.nio.file.Path;

@Configuration
@Slf4j
public class FileStorageConfig {

	@Value("${eu.zavadil.ocr.home}")
	String homeDir;

	@Bean
	public FileStorage fileStorage() {
		Path storagePath = Path.of(this.homeDir, "files");
		if (!Files.exists(storagePath)) {
			throw new RuntimeException(String.format("Storage folder %s not found!", storagePath.toString()));
		}
		FileStorage fs = new FileStorage(storagePath, true);
		fs.getTempDirectory().delete();
		return fs;
	}

}
