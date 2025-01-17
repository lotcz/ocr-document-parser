package eu.zavadil.ocr.probe.document;

import eu.zavadil.java.caching.Lazy;
import eu.zavadil.ocr.data.Language;
import eu.zavadil.ocr.data.documentTemplate.DocumentTemplate;
import eu.zavadil.ocr.data.documentTemplate.DocumentTemplateRepository;
import eu.zavadil.ocr.data.folder.Folder;
import eu.zavadil.ocr.data.folder.FolderRepository;
import eu.zavadil.ocr.data.fragmentTemplate.FragmentTemplate;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
@Slf4j
public class ProbeDocumentFactory {

	@Autowired
	DocumentTemplateRepository documentTemplateRepository;

	@Autowired
	FolderRepository folderRepository;

	private static final String FOLDER_NAME = "Probes";

	private static final String TEMPLATE_NAME = "Probe Template";

	private final Lazy<DocumentTemplate> probeTemplate = new Lazy<>(
		() -> {
			DocumentTemplate dt = this.documentTemplateRepository.findFirstByName(TEMPLATE_NAME).orElse(null);
			if (dt == null) {
				log.info("Creating example document template");
				dt = new DocumentTemplate();
				dt.setName(TEMPLATE_NAME);
				dt.setLanguage(Language.eng);
				dt.setWidth(480);
				dt.setHeight(640);

				FragmentTemplate fragment0 = new FragmentTemplate();
				fragment0.setName("fragment-0");
				fragment0.setDocumentTemplate(dt);
				dt.getFragments().add(fragment0);

				FragmentTemplate fragment1 = new FragmentTemplate();
				fragment1.setDocumentTemplate(dt);
				fragment1.setName("fragment-1");
				fragment1.setLeft(0);
				fragment1.setTop(0);
				fragment1.setWidth(0.5);
				fragment1.setHeight(1);
				dt.getFragments().add(fragment1);

				FragmentTemplate fragment2 = new FragmentTemplate();
				fragment2.setName("fragment-2");
				fragment2.setDocumentTemplate(dt);
				fragment2.setLeft(0.5);
				fragment2.setTop(0);
				fragment2.setWidth(0.5);
				fragment2.setHeight(1);
				dt.getFragments().add(fragment2);

				this.documentTemplateRepository.save(dt);
			}
			return dt;
		}
	);

	private final Lazy<Folder> probesFolder = new Lazy<>(
		() -> {
			Folder f = this.folderRepository.findFirstByName(FOLDER_NAME).orElse(null);
			if (f == null) {
				log.info("Creating probes folder");
				f = new Folder();
				f.setName(FOLDER_NAME);
				f.setDocumentTemplate(this.getProbeDocumentTemplate());
				this.folderRepository.save(f);
			}
			return f;
		}
	);

	public DocumentTemplate getProbeDocumentTemplate() {
		return this.probeTemplate.get();
	}

	public ProbeDocument createProbeDocument() {
		return new ProbeDocument("/examples/java-ocr-1.png", this.getProbeDocumentTemplate());
	}

	public Folder getProbesFolder() {
		return this.probesFolder.get();
	}
}
