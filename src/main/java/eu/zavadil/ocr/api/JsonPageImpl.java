package eu.zavadil.ocr.api;

import org.springframework.data.domain.Page;

import java.util.List;

public class JsonPageImpl<T> implements JsonPage<T> {

	private final Page<T> page;

	public JsonPageImpl(Page<T> page) {
		this.page = page;
	}

	@Override
	public List<T> getContent() {
		return this.page.getContent();
	}

	@Override
	public int getTotalItems() {
		return this.page.getNumberOfElements();
	}

	@Override
	public int getPageSize() {
		return this.page.getSize();
	}

	@Override
	public int getPageNumber() {
		return this.page.getNumber();
	}
}
