package eu.zavadil.ocr.core.parser.img;

import eu.zavadil.ocr.core.pipe.PipeLineBase;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class ImagePreProcess extends PipeLineBase<ImageFileWrapper> {

	@Autowired
	public ImagePreProcess(
		Upscale upscale,
		Grayscale grayscale,
		BlackAndWhite blackAndWhite
	) {
		//this.add(grayscale);
		this.add(upscale);
		this.add(blackAndWhite);
	}

}
