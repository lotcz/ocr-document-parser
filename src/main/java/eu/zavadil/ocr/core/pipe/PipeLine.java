package eu.zavadil.ocr.core.pipe;

public interface PipeLine<T, SettingsT> extends Pipe<T, T, SettingsT> {

	void add(PipeLine<T, SettingsT> next);

}
