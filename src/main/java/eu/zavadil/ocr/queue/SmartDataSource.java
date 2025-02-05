package eu.zavadil.ocr.queue;

public interface SmartDataSource<T> {

	T next();

	default boolean hasNext() {
		return this.getRemaining() > 0;
	}

	long getRemaining();

}
