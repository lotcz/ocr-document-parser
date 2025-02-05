package eu.zavadil.ocr.queue;

import eu.zavadil.ocr.stats.OkarinaStats;
import lombok.Getter;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;

import java.util.List;

@Slf4j
public abstract class SmartQueue<T> implements SmartDataSource<T> {

	@Getter
	private int currentItemNumber;

	public enum QueueState {
		Idle,
		Loading,
		Processing
	}

	@Getter
	private QueueState state = QueueState.Idle;

	protected Page<T> currentPage = null;

	public SmartQueue() {
	}

	public void reload() {
		this.state = QueueState.Loading;
		this.currentPage = this.loadRemaining();
		this.state = QueueState.Idle;
		this.currentItemNumber = 0;
	}

	public void reset() {
		this.currentPage = null;
		this.currentItemNumber = 0;
	}

	abstract Page<T> loadRemaining();

	abstract void process(T e);

	public boolean needsReload() {
		return (this.currentPage == null || this.currentPage.getNumberOfElements() <= this.currentItemNumber);
	}

	@Override
	public T next() {
		if (this.needsReload()) {
			this.reload();
		}
		List<T> content = this.currentPage.getContent();
		T result = content.size() > this.currentItemNumber ? content.get(this.currentItemNumber) : null;
		this.currentItemNumber++;
		return result;
	}

	@Override
	public long getRemaining() {
		if (this.needsReload()) {
			this.reload();
		}
		return this.currentPage.getTotalElements() - this.currentItemNumber;
	}

	public void processQueue() {
		this.state = QueueState.Processing;
		while (this.hasNext()) {
			log.info("Processing document queue, {} remaining", this.getRemaining());
			this.process(this.next());
		}
		log.info("Document queue empty");
		this.reset();
		this.state = QueueState.Idle;
	}

	public OkarinaStats.QueueStats getStats() {
		return new OkarinaStats.QueueStats(
			this.getRemaining(),
			this.currentPage == null ? 0 : this.currentPage.getNumberOfElements(),
			this.state
		);
	}
}
