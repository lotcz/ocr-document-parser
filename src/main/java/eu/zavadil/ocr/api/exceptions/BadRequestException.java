package eu.zavadil.ocr.api.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(value = HttpStatus.BAD_REQUEST)
public class BadRequestException extends RuntimeException {

	static String createMessage(String message) {
		return String.format("Bad request: %s", message);
	}

	public BadRequestException(String message, Throwable cause) {
		super(createMessage(message), cause);
	}

	public BadRequestException(String message) {
		super(createMessage(message));
	}

	public BadRequestException(Throwable throwable) {
		super(throwable);
	}

}
