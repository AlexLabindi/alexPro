package com.alex.pro.controller;

import com.alex.pro.dto.LibroResponseDTO;
import com.alex.pro.model.Libro;
import com.alex.pro.service.LibroService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/libri")
@CrossOrigin(origins = "http://localhost:5173")
public class LibroController {

    @Autowired
    private LibroService libroService;


    @GetMapping
    public ResponseEntity<List<LibroResponseDTO>> getAllLibri() {
        List<Libro> libri = libroService.getAllLibri();
        List<LibroResponseDTO> responseDTOS =  new ArrayList<>();
        for (Libro libro : libri) {
            LibroResponseDTO responseDTO =  new LibroResponseDTO(libro.getTitolo(), libro.getDescrizione(),
                    libro.getPrezzo(),libro.getAutore().getNome(),libro.getGenere().getNome());
            responseDTOS.add(responseDTO);

        }
        return ResponseEntity.ok(responseDTOS);
    }


    @GetMapping("/{id}")
    public ResponseEntity<Libro> getLibroById(@PathVariable Long id) {
        return libroService.getLibroById(id)
                .map(lib -> ResponseEntity.ok(lib))
                .orElse(ResponseEntity.notFound().build());
    }




}