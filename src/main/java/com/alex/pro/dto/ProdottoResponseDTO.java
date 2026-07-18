package com.alex.pro.dto;

public record ProdottoResponseDTO(
        Long id,
        String nome,
        double prezzo,
        int quantita,
        boolean disponibile,
        String nomeCategoria // Inviamo solo il nome della categoria, non tutta l'entità pesante!
) {}