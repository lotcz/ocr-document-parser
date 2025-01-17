package eu.zavadil.ocr.data.fragment;

import eu.zavadil.ocr.data.EntityBase;
import eu.zavadil.ocr.data.document.Document;
import eu.zavadil.ocr.data.fragmentTemplate.FragmentTemplate;
import jakarta.persistence.Entity;
import jakarta.persistence.ManyToOne;
import lombok.Data;
import lombok.EqualsAndHashCode;

@EqualsAndHashCode(callSuper = true)
@Data
@Entity
public class Fragment extends EntityBase {

	@ManyToOne
	private Document document;

	@ManyToOne
	private FragmentTemplate fragmentTemplate;

	private String imagePath;

	private String text;

}
