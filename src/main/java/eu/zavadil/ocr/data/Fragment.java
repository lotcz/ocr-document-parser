package eu.zavadil.ocr.data;

import lombok.Data;

@Data
public class Fragment {

	private FragmentTemplate fragmentTemplate;

	private String imagePath;

	private String text;

}
