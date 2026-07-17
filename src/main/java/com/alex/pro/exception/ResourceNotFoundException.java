package com.alex.pro.exception;

/**
 * Eccezione lanciata dai Service quando un'entità cercata nel Database non esiste.
 */
public class ResourceNotFoundException extends RuntimeException {

    public ResourceNotFoundException(String message) {
        super(message);
    }
}