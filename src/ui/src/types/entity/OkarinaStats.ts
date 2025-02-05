export type JavaHeapStats = {
	heapSize: number;
	heapMaxSize: number;
	heapFreeSize: number;
}

export type QueueStats = {
	remaining: number;
	loaded: number;
	state: string;
}

export type CacheStats = {
	cachedItems: number;
	capacity: number;
}

export type OkarinaStats = {
	javaHeap: JavaHeapStats;
	documentQueue: QueueStats;
	templateCache: CacheStats;
	folderChain: CacheStats;
}
