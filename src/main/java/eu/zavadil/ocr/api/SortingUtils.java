package eu.zavadil.ocr.api;

import org.springframework.data.domain.Sort;

import java.util.Arrays;

public class SortingUtils {

	public static Sort.Order fieldFromString(String str) {
		String[] arr = str.split("-");
		String name = arr[0];
		String direction = arr.length > 1 ? arr[1] : "asc";
		return new Sort.Order(Sort.Direction.fromString(direction), name);
	}

	public static Sort fromString(String str) {
		if (str == null || str.isBlank()) {
			return Sort.unsorted();
		}
		return Sort.by(Arrays.stream(str.split("\\+")).map(SortingUtils::fieldFromString).toList());
	}
}
