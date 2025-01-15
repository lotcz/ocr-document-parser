package eu.zavadil.ocr.probe;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.InputStream;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProbeItem {
	private String path;

	@JsonIgnore
	public InputStream getImageStream() {
		InputStream is = ProbeItem.class.getResourceAsStream(this.getPath());
		if (is == null)
			throw new RuntimeException(String.format("Error when opening resource file %s", this.getPath()));
		return is;
	}

}
