package eu.zavadil.ocr.service;

import eu.zavadil.java.caching.Lazy;
import eu.zavadil.java.ocr.common.Language;
import eu.zavadil.java.util.StringUtils;
import eu.zavadil.ocr.data.LanguageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class LanguageService {

	@Autowired
	LanguageRepository languageRepository;

	private Lazy<List<Language>> languages = new Lazy<>(
		() -> this.languageRepository.findAll()
	);

	public List<Language> all() {
		return this.languages.get();
	}

	public Language getByTesseractCode(String code) {
		return this.all().stream().filter(l -> StringUtils.safeEquals(l.getTesseractCode(), code)).findAny().orElse(null);
	}
}
