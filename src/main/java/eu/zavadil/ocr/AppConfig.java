package eu.zavadil.ocr;

import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.scheduling.annotation.EnableScheduling;

@Configuration
@EnableJpaRepositories
@EntityScan(basePackages = "eu.zavadil.java.ocr.common")
@EnableScheduling
public class AppConfig {

}
