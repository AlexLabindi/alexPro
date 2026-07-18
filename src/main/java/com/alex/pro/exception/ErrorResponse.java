package com.alex.pro.exception;

import java.time.LocalDateTime;

/**
 * DTO immutabile (Record Java) che definisce il formato di risposta JSON
 * quando si verifica un errore nell'API.
 */
public record ErrorResponse(
        int status,           // Codice HTTP (es. 404, 400)
        String error,        // Nome sintetico dell'errore (es. "Not Found")
        String message,      // Messaggio descrittivo per il client
        LocalDateTime timestamp // Timestamp di quando si è verificato l'errore
) {
    // Factory method di comodo
    public static ErrorResponse of(int status, String error, String message) {
        return new ErrorResponse(status, error, message, LocalDateTime.now());
    }
}