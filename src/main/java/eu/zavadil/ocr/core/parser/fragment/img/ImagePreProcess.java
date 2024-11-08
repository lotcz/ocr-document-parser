package eu.zavadil.ocr.core.parser.fragment.img;

import eu.zavadil.ocr.core.parser.fragment.FragmentPipeLine;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class ImagePreProcess extends FragmentPipeLine<ImageFileWrapper> {

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
