package com.alex.pro.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;

public record ProdottoRequestDTO(
        @NotBlank(message = "Il nome non può essere vuoto")
        String nome,

        @Min(value = 0, message = "Il prezzo deve essere maggiore o uguale a 0")
        double prezzo,

        int quantita,
        boolean disponibile,

        Long categoriaId // Il frontend ci passa solo l'ID della categoria associata
) {}