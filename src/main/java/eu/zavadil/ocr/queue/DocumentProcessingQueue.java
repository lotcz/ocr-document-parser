package eu.zavadil.ocr.queue;

import eu.zavadil.ocr.data.document.DocumentStub;
import eu.zavadil.ocr.data.document.DocumentStubRepository;
import eu.zavadil.ocr.service.DocumentParser;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class DocumentProcessingQueue extends SmartQueue<DocumentStub> {

	private DocumentStubRepository documentStubRepository;

	private DocumentParser documentParser;

	@Autowired
	public DocumentProcessingQueue(
		DocumentStubRepository documentStubRepository,
		DocumentParser documentParser
	) {
		super();
		this.documentStubRepository = documentStubRepository;
		this.documentParser = documentParser;
	}

	@Override
	Page<DocumentStub> loadRemaining() {
		log.info("Loading queue");
		return this.documentStubRepository.loadQueue();
	}

	@Override
	void process(DocumentStub d) {
		this.documentParser.parse(d);
	}

	@Scheduled(fixedDelay = 3000)
	void scheduledProcessQueue() {
		this.processQueue();
	}
}
