package eu.zavadil.ocr.api.admin;

import eu.zavadil.ocr.data.language.Language;
import eu.zavadil.ocr.data.language.LanguageService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("${api.base-url}/admin/enumerations")
@Tag(name = "Enumerations")
@Slf4j
public class EnumerationsController {

	@Autowired
	LanguageService languageService;

	@GetMapping("languages/all")
	@Operation(summary = "Available languages.")
	public List<Language> languages() {
		return this.languageService.all();
	}

}
