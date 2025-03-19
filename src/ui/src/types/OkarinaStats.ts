import {CacheStats, JavaHeapStats, QueueStats} from "zavadil-ts-common";

export type OkarinaStats = {
	javaHeap: JavaHeapStats;
	documentQueue: QueueStats;
	templateCache: CacheStats;
	folderChain: CacheStats;
}

export type ClientStats = {
	documentTemplatesCache: CacheStats;
	fragmentTemplatesCache: CacheStats;
	folderChainCache: CacheStats;
}
