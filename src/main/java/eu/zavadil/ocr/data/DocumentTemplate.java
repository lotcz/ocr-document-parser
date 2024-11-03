package eu.zavadil.ocr.data;

import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Data
public class DocumentTemplate extends TemplateBase {

	private int width;

	private int height;

	private List<FragmentTemplate> fragments = new ArrayList<>();

}
