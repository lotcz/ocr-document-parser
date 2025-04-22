package eu.zavadil.ocr.probe;

import eu.zavadil.java.caching.Lazy;
import eu.zavadil.ocr.data.parsed.folder.FolderStub;
import eu.zavadil.ocr.data.parsed.folder.FolderStubRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
@Slf4j
public class ProbeFoldersFactory {

	@Autowired
	FolderStubRepository folderStubRepository;

	@Autowired
	ProbeTemplatesFactory probeTemplatesFactory;

	private static final String FOLDER_NAME = "TEST";

	private final Lazy<FolderStub> probesFolder = new Lazy<>(
		() -> {
			FolderStub f = this.folderStubRepository.findFirstByName(FOLDER_NAME).orElse(null);
			if (f == null) {
				log.info("Creating probes folder");
				f = new FolderStub();
				f.setName(FOLDER_NAME);
				this.folderStubRepository.save(f);
			}
			return f;
		}
	);

	public FolderStub getProbesFolder() {
		return this.probesFolder.get();
	}

	private static final String SIMPLE_FOLDER_NAME = "Simples";

	private final Lazy<FolderStub> simplesFolder = new Lazy<>(
		() -> {
			FolderStub f = this.folderStubRepository
				.findFirstByNameAndParentId(SIMPLE_FOLDER_NAME, this.getProbesFolder().getId())
				.orElse(null);
			if (f == null) {
				log.info("Creating Simples folder");
				f = new FolderStub();
				f.setName(SIMPLE_FOLDER_NAME);
				f.setParentId(this.getProbesFolder().getId());
			}
			if (f.getDocumentTemplateId() == null) {
				f.setDocumentTemplateId(this.probeTemplatesFactory.getSimpleTemplate().getId());
				this.folderStubRepository.save(f);
			}
			return f;
		}
	);

	public FolderStub getSimplesFolder() {
		return this.simplesFolder.get();
	}

	private static final String DOCUMENT_FOLDER_NAME = "Documents";

	private final Lazy<FolderStub> documentFolder = new Lazy<>(
		() -> {
			FolderStub f = this.folderStubRepository
				.findFirstByNameAndParentId(DOCUMENT_FOLDER_NAME, this.getProbesFolder().getId())
				.orElse(null);
			if (f == null) {
				log.info("Creating Document folder");
				f = new FolderStub();
				f.setName(DOCUMENT_FOLDER_NAME);
				f.setParentId(this.getProbesFolder().getId());
			}
			if (f.getDocumentTemplateId() == null) {
				f.setDocumentTemplateId(this.probeTemplatesFactory.getDocumentTemplate().getId());
				this.folderStubRepository.save(f);
			}
			return f;
		}
	);

	public FolderStub getDocumentFolder() {
		return this.documentFolder.get();
	}
}
