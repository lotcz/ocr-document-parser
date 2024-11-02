package eu.zavadil.ocr.core.probe;

import eu.zavadil.ocr.core.settings.Language;
import lombok.AllArgsConstructor;
import lombok.Data;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.IOException;
import java.io.InputStream;

@Data
@AllArgsConstructor
public class ProbeFile {
	private String path;
	private String text;
	private Language language;

	public InputStream getImageStream() {
		InputStream is = ProbeFile.class.getResourceAsStream(this.getPath());
		if (is == null)
			throw new RuntimeException(String.format("Error when opening resource file %s", this.getPath()));
		return is;
	}

	public BufferedImage getBufferedImage() {
		InputStream is = this.getImageStream();
		try {
			return ImageIO.read(is);
		} catch (IOException e) {
			throw new RuntimeException(String.format("Error when opening resource file %s", this.getPath()), e);
		}
	}
}
