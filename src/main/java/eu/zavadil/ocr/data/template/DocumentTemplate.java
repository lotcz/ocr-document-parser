package eu.zavadil.ocr.data.template;

import jakarta.persistence.Entity;
import jakarta.persistence.OneToMany;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.util.ArrayList;
import java.util.List;

@EqualsAndHashCode(callSuper = true, exclude = "fragments")
@Data
@Entity
public class DocumentTemplate extends TemplateBase {

	private int width;

	private int height;

	@OneToMany(mappedBy = "documentTemplate")
	private List<FragmentTemplate> fragments = new ArrayList<>();

}
