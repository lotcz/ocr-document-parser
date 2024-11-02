package eu.zavadil.ocr.core.pipe;

import eu.zavadil.ocr.core.settings.ProcessingSettings;

public abstract class PipeLineBase<T> implements PipeLine<T> {

	protected PipeLine<T> next = null;

	public T processInternal(T input, ProcessingSettings settings) {
		return input;
	}

	@Override
	public T process(T input, ProcessingSettings settings) {
		T internal = this.processInternal(input, settings);
		if (this.next == null) {
			return internal;
		}
		return this.next.process(internal, settings);
	}

	@Override
	public void add(PipeLine<T> next) {
		if (this.next == null) {
			this.next = next;
		} else {
			this.next.add(next);
		}
	}
}

