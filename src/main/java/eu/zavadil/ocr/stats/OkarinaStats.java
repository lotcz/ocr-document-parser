package eu.zavadil.ocr.stats;

import eu.zavadil.java.JavaHeapStats;
import eu.zavadil.java.caching.HashCacheStats;
import eu.zavadil.java.queues.SmartQueueProcessorStats;
import lombok.Getter;
import lombok.Setter;

@Getter
public class OkarinaStats {

	private final JavaHeapStats javaHeap = JavaHeapStats.ofCurrent();

	@Setter
	private SmartQueueProcessorStats documentQueue;

	@Setter
	private HashCacheStats templateCache;

	@Setter
	private HashCacheStats folderChain;

}
