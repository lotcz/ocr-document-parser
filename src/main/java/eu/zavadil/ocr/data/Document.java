package eu.zavadil.ocr.data;

import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Data
public class Document {

	private DocumentTemplate documentTemplate;

	private String imagePath;

	private List<Fragment> fragments = new ArrayList<>();

}
