package eu.zavadil.ocr;

import lombok.extern.slf4j.Slf4j;
import net.sourceforge.tess4j.Tesseract;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.nio.file.Path;

@Configuration
@Slf4j
public class AppConfig {

	@Value("${eu.zavadil.ocr.home}")
	String homeDir;

	@Bean
	public Tesseract tesseract() {
		log.info("Hello, starting Tesseract...");

		Tesseract tesseract = new Tesseract();

		// this includes the path of tessdata inside the extracted folder
		tesseract.setDatapath(Path.of(this.homeDir, "tessdata").toString());

		return tesseract;
	}

}