package eu.zavadil.ocr.data;

import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.MappedSuperclass;
import lombok.Data;

@Data
@MappedSuperclass
public class EntityBase {

	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private Integer id;

}
