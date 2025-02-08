package eu.zavadil.ocr.api;

import org.springframework.data.domain.PageRequest;

public class PagingUtils {

	public static PageRequest of(int page, int size, String sorting) {
		return PageRequest.of(page, size, SortingUtils.fromString(sorting));
	}

}
