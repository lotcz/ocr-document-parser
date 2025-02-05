package eu.zavadil.ocr.service;

import eu.zavadil.java.caching.HashCache;
import eu.zavadil.ocr.data.EntityBase;
import eu.zavadil.ocr.stats.OkarinaStats;
import org.springframework.data.jpa.repository.JpaRepository;

public class BasicEntityCache<T extends EntityBase> extends HashCache<Integer, T> {

	private JpaRepository<T, Integer> repository;

	public BasicEntityCache(JpaRepository<T, Integer> repository) {
		this.repository = repository;
	}

	@Override
	protected T load(Integer id) {
		return this.repository.findById(id)
			.orElseThrow(() -> new IllegalArgumentException(String.format("Cached entity with ID %d not found!", id)));
	}

	@Override
	protected T save(T e) {
		return this.repository.save(e);
	}

	@Override
	protected Integer extractKey(T e) {
		return e.getId();
	}

	public OkarinaStats.CacheStats getStats() {
		return new OkarinaStats.CacheStats(
			this.cache.size(),
			this.maxItems
		);
	}
}
