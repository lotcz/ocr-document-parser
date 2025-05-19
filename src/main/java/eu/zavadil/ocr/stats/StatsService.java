package eu.zavadil.ocr.stats;

import eu.zavadil.java.ocr.common.stats.OkarinaStats;
import eu.zavadil.ocr.queue.DocumentQueueProcessor;
import eu.zavadil.ocr.service.DocumentTemplateCache;
import eu.zavadil.ocr.service.folders.FolderChainCache;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class StatsService {

	@Autowired
	DocumentTemplateCache documentTemplateCache;

	@Autowired
	FolderChainCache folderChainService;

	@Autowired
	DocumentQueueProcessor documentProcessingQueue;

	public OkarinaStats getStats() {
		final OkarinaStats stats = new OkarinaStats();
		stats.setTemplateCache(this.documentTemplateCache.getStats());
		stats.setFolderChain(this.folderChainService.getStats());
		stats.setDocumentQueue(this.documentProcessingQueue.getStats());
		return stats;
	}
}
