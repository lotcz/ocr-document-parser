package eu.zavadil.ocr.data.fragment;

import eu.zavadil.ocr.data.EntityBase;
import jakarta.persistence.MappedSuperclass;
import lombok.Data;
import lombok.EqualsAndHashCode;

@EqualsAndHashCode(callSuper = true)
@Data
@MappedSuperclass
public class FragmentBase extends EntityBase {

	private String imagePath;

	private String text;

}
