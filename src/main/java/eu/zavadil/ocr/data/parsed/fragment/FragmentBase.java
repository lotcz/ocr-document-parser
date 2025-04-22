package eu.zavadil.ocr.data.parsed.fragment;

import eu.zavadil.java.spring.common.entity.EntityBase;
import jakarta.persistence.Column;
import jakarta.persistence.MappedSuperclass;
import lombok.Data;
import lombok.EqualsAndHashCode;

@EqualsAndHashCode(callSuper = true)
@Data
@MappedSuperclass
public class FragmentBase extends EntityBase {

	private String imagePath;

	@Column(columnDefinition = "TEXT")
	private String text;

}
