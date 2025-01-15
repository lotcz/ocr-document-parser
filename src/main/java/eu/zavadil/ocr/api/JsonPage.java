package eu.zavadil.ocr.api;

import org.springframework.data.domain.Page;

import java.util.List;

public interface JsonPage<T> {

	List<T> getContent();

	int getTotalItems();

	int getPageSize();

	int getPageNumber();

	static <T> JsonPage<T> of(Page<T> page) {
		return new JsonPageImpl<>(page);
	}

}
