package eu.zavadil.ocr.data.template;

import jakarta.persistence.Entity;
import jakarta.persistence.Index;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.hibernate.annotations.Cascade;
import org.hibernate.annotations.CascadeType;

import java.util.ArrayList;
import java.util.List;

@EqualsAndHashCode(callSuper = true, exclude = "fragments")
@Data
@Entity
@Table(indexes = {
	@Index(columnList = "name")
})
public class DocumentTemplate extends TemplateBase {

	private int width;

	private int height;

	@OneToMany(mappedBy = "documentTemplate")
	@Cascade(CascadeType.ALL)
	private List<FragmentTemplate> fragments = new ArrayList<>();

}
