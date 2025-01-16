package eu.zavadil.ocr.api.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(value = HttpStatus.UNAUTHORIZED)
public class NotAuthorizedException extends RuntimeException {

	static String createMessage(String resourceName, String resourceId) {
		return String.format("Unauthorized access to %s/%s", resourceName, resourceId);
	}

	static String createMessage(String resourceName) {
		return String.format("Unauthorized access to %s", resourceName);
	}

	public NotAuthorizedException(String resourceName, String resourceId, Throwable cause) {
		super(createMessage(resourceName, resourceId), cause);
	}

	public NotAuthorizedException(String resourceName, String resourceId) {
		super(createMessage(resourceName, resourceId));
	}

	public NotAuthorizedException(String resourceName, Throwable cause) {
		super(createMessage(resourceName), cause);
	}

	public NotAuthorizedException(String resourceName) {
		super(createMessage(resourceName));
	}

}
