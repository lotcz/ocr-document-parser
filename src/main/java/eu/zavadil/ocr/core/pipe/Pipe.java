package eu.zavadil.ocr.core.pipe;

public interface Pipe<InT, OutT, SettingsT> {

	OutT process(InT input, SettingsT settings);

}
