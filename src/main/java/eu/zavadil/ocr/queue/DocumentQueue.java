package eu.zavadil.ocr.queue;

import eu.zavadil.java.spring.common.queues.PagedSmartQueue;
import eu.zavadil.ocr.data.document.DocumentStub;
import eu.zavadil.ocr.data.document.DocumentStubRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class DocumentQueue extends PagedSmartQueue<DocumentStub> {

	@Autowired
	DocumentStubRepository documentStubRepository;

	@Override
	public Page<DocumentStub> loadRemaining() {
		log.info("Loading queue");
		return this.documentStubRepository.loadQueue();
	}

}
