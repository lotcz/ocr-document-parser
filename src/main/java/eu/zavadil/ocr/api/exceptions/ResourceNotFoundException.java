package eu.zavadil.ocr.api.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(value = HttpStatus.NOT_FOUND)
public class ResourceNotFoundException extends RuntimeException {

	public ResourceNotFoundException(String resourceName, String resourceId, Throwable cause) {
		super(createMessage(resourceName, resourceId), cause);
	}

	public ResourceNotFoundException(String resourceName, String resourceId) {
		super(createMessage(resourceName, resourceId));
	}

	public ResourceNotFoundException(String resourceName, Throwable cause) {
		super(createMessage(resourceName), cause);
	}

	public ResourceNotFoundException(String resourceName) {
		super(createMessage(resourceName));
	}

	static String createMessage(String resourceName, String resourceId) {
		return String.format("Resource '%s' not found by id '%s'", resourceName, resourceId);
	}

	static String createMessage(String resourceName) {
		return String.format("Resource '%s' not found", resourceName);
	}

}
