package eu.zavadil.ocr;

import eu.zavadil.ocr.data.Language;
import eu.zavadil.ocr.storage.FileStorage;
import lombok.extern.slf4j.Slf4j;
import net.sourceforge.tess4j.Tesseract;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.scheduling.annotation.EnableScheduling;

import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Arrays;

@Configuration
@EnableJpaRepositories
@EnableScheduling
@Slf4j
public class AppConfig {

	@Value("${eu.zavadil.ocr.home}")
	String homeDir;

	@Bean
	public Tesseract tesseract() {
		log.info("Hello, starting Tesseract...");

		Tesseract tesseract = new Tesseract();

		Path tessdataPath = Path.of(this.homeDir, "tessdata");
		if (!Files.exists(tessdataPath)) {
			throw new RuntimeException(String.format("Tessdata folder %s not found!", tessdataPath.toString()));
		}
		Arrays.stream(Language.values()).forEach(
			(l) -> {
				Path langpath = Path.of(tessdataPath.toString(), String.format("%s.traineddata", l.name()));
				if (!Files.exists(langpath)) {
					throw new RuntimeException(String.format("Tesseract language folder %s not found!", langpath.toString()));
				}
			}
		);

		// this includes the path of tessdata inside the extracted folder
		tesseract.setDatapath(tessdataPath.toString());

		return tesseract;
	}

	@Bean
	public FileStorage fileStorage() {
		Path storagePath = Path.of(this.homeDir, "tmp");
		if (!Files.exists(storagePath)) {
			throw new RuntimeException(String.format("Storage folder %s not found!", storagePath.toString()));
		}
		return new FileStorage(storagePath, true);
	}

}
