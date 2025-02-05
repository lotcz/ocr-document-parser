package eu.zavadil.ocr.stats;

import eu.zavadil.ocr.queue.DocumentProcessingQueue;
import eu.zavadil.ocr.service.DocumentTemplateService;
import eu.zavadil.ocr.service.FolderChainService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class StatsService {

	@Autowired
	DocumentTemplateService documentTemplateService;

	@Autowired
	FolderChainService folderChainService;

	@Autowired
	DocumentProcessingQueue documentProcessingQueue;

	public OkarinaStats getStats() {
		final OkarinaStats stats = new OkarinaStats();
		stats.setTemplateCache(this.documentTemplateService.getStats());
		stats.setFolderChain(this.folderChainService.getStats());
		stats.setDocumentQueue(this.documentProcessingQueue.getStats());
		return stats;
	}
}
