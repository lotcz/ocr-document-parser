package eu.zavadil.ocr.data.parsed.page;

import eu.zavadil.ocr.data.parsed.fragment.FragmentStub;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.util.ArrayList;
import java.util.List;

@EqualsAndHashCode(callSuper = true)
@Data
@Entity
@Table(name = "page")
public class PageStubWithFragments extends PageStubBase {

	@OneToMany(mappedBy = "pageId", fetch = FetchType.EAGER)
	private List<FragmentStub> fragments = new ArrayList<>();

	@Override
	public String toString() {
		return String.format("[DocumentStubWithFragments][%d/%s][fragments:%d]", this.getId(), this.getImagePath(), this.fragments.size());
	}
}
