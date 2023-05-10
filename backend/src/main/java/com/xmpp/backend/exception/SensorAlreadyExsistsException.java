package com.xmpp.backend.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(value = HttpStatus.CONFLICT)
public class SensorAlreadyExsistsException extends RuntimeException{
    private static final long serialVersionUID = 1L;
	
	public SensorAlreadyExsistsException(String message) {
		super(message);
	}
}