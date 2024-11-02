package eu.zavadil.ocr.core.pipe;

public interface PipeLine<T> extends Pipe<T, T> {

	void add(PipeLine<T> next);
	
}
