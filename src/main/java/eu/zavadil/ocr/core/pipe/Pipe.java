package eu.zavadil.ocr.core.pipe;

import eu.zavadil.ocr.core.settings.ProcessingSettings;

public interface Pipe<InT, OutT> {

	OutT process(InT input, ProcessingSettings settings);

}
