package eu.zavadil.ocr.core.pipe;

public abstract class PipeLineBase<T, SettingsT> implements PipeLine<T, SettingsT> {

	protected PipeLine<T, SettingsT> next = null;

	public T processInternal(T input, SettingsT settings) {
		return input;
	}

	@Override
	public T process(T input, SettingsT settings) {
		T internal = this.processInternal(input, settings);
		if (this.next == null) {
			return internal;
		}
		return this.next.process(internal, settings);
	}

	@Override
	public void add(PipeLine<T, SettingsT> next) {
		if (this.next == null) {
			this.next = next;
		} else {
			this.next.add(next);
		}
	}
}

