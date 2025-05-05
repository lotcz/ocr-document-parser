package eu.zavadil.ocr.config;

import eu.zavadil.ocr.data.language.Language;
import eu.zavadil.ocr.data.language.LanguageService;
import lombok.extern.slf4j.Slf4j;
import net.sourceforge.tess4j.Tesseract;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;

@Configuration
@Slf4j
public class TesseractConfig {

	@Value("${eu.zavadil.ocr.home}")
	String homeDir;

	@Autowired
	LanguageService languageService;

	@Bean
	public Tesseract tesseract() {
		log.info("Starting Tesseract...");

		Tesseract tesseract = new Tesseract();

		Path tessdataPath = Path.of(this.homeDir, "tessdata");
		if (!Files.exists(tessdataPath)) {
			throw new RuntimeException(String.format("Tessdata folder %s not found!", tessdataPath.toString()));
		}

		List<Language> languages = this.languageService.all();
		languages.forEach(
			(l) -> {
				Path langpath = Path.of(tessdataPath.toString(), String.format("%s.traineddata", l.getTesseractCode()));
				if (!Files.exists(langpath)) {
					throw new RuntimeException(String.format("Tesseract language folder %s not found!", langpath.toString()));
				}
			}
		);

		// this includes the path of tessdata inside the extracted folder
		tesseract.setDatapath(tessdataPath.toString());

		return tesseract;
	}

}
