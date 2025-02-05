package eu.zavadil.ocr.stats;

import eu.zavadil.java.JavaHeapStats;
import eu.zavadil.ocr.queue.SmartQueue;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
public class OkarinaStats {

	private final JavaHeapStats javaHeap = JavaHeapStats.ofCurrent();

	@Getter
	@AllArgsConstructor
	public static class QueueStats {
		long remaining;
		int loaded;
		SmartQueue.QueueState state;
	}

	@Setter
	private QueueStats documentQueue;

	@Getter
	@AllArgsConstructor
	public static class CacheStats {
		int cachedItems;
		int capacity;
	}

	@Setter
	private CacheStats templateCache;

	@Setter
	private CacheStats folderChain;

}
