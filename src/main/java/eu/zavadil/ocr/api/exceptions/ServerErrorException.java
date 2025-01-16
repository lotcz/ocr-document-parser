package eu.zavadil.ocr.api.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(value = HttpStatus.INTERNAL_SERVER_ERROR)
public class ServerErrorException extends RuntimeException {

	static String createMessage(String message) {
		return String.format("Server error: %s", message);
	}

	public ServerErrorException(String message, Throwable cause) {
		super(createMessage(message), cause);
	}

	public ServerErrorException(String message) {
		super(createMessage(message));
	}

	public ServerErrorException(Throwable throwable) {
		super(throwable);
	}

}
