package eu.zavadil.ocr.data.document;

import eu.zavadil.java.spring.common.entity.EntityBase;
import jakarta.persistence.MappedSuperclass;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.hibernate.annotations.JdbcType;
import org.hibernate.dialect.PostgreSQLEnumJdbcType;

@EqualsAndHashCode(callSuper = true)
@Data
@MappedSuperclass
public class DocumentBase extends EntityBase {

	private String imagePath;

	@JdbcType(PostgreSQLEnumJdbcType.class)
	private DocumentState state = DocumentState.Waiting;

}
