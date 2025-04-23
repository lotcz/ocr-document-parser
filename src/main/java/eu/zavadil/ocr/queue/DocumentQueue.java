package eu.zavadil.ocr.queue;

import eu.zavadil.java.spring.common.queues.PagedSmartQueue;
import eu.zavadil.ocr.data.parsed.document.DocumentStubWithPages;
import eu.zavadil.ocr.data.parsed.document.DocumentStubWithPagesRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class DocumentQueue extends PagedSmartQueue<DocumentStubWithPages> {

	@Autowired
	DocumentStubWithPagesRepository documentStubRepository;

	@Override
	public Page<DocumentStubWithPages> loadRemaining() {
		return this.documentStubRepository.loadQueue();
	}

}
