package eu.zavadil.ocr.queue;

import eu.zavadil.java.spring.common.queues.SmartQueueProcessorBase;
import eu.zavadil.ocr.data.document.DocumentStub;
import eu.zavadil.ocr.service.DocumentParser;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class DocumentQueueProcessor extends SmartQueueProcessorBase<DocumentStub> {

	private DocumentParser documentParser;

	@Autowired
	public DocumentQueueProcessor(
		DocumentQueue documentQueue,
		DocumentParser documentParser
	) {
		super(documentQueue);
		this.documentParser = documentParser;
	}

	@Override
	public void processItem(DocumentStub d) {
		this.documentParser.parse(d);
	}

	@Scheduled(fixedDelay = 3000)
	void scheduledProcessQueue() {
		this.process();
	}
}
