package eu.zavadil.ocr.data.parsed.folder;

import com.fasterxml.jackson.annotation.JsonIgnore;
import eu.zavadil.java.util.FileNameUtils;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.nio.file.Path;
import java.util.ArrayList;
import java.util.List;

@EqualsAndHashCode(callSuper = true)
@Data
@Entity
@Table(name = "folder")
public class FolderChain extends FolderBase {

	@ManyToOne
	private FolderChain parent;

	@Column(name = "document_template_id")
	private Integer documentTemplateId;

	@JsonIgnore
	public List<String> toPathParts() {
		//List<String> parts = (this.parent == null) ? new ArrayList<>() : this.parent.toPathParts();
		List<String> parts = new ArrayList<>();
		parts.add(String.format("%d-%s", this.getId(), FileNameUtils.slugify(this.getName())));
		return parts;
	}

	@JsonIgnore
	public Path toPath() {
		return Path.of(String.join("/", this.toPathParts()));
	}
}
