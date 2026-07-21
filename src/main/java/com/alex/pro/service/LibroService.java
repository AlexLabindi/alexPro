package com.alex.pro.service;

import com.alex.pro.model.Libro;
import com.alex.pro.repository.AutoreRepository;
import com.alex.pro.repository.GenereRepository;
import com.alex.pro.repository.LibroRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class LibroService {



    @Autowired
    private LibroRepository libroRepository;
    @Autowired
    private GenereRepository genereRepository;
    @Autowired
    private AutoreRepository autoreRepository;


    public List<Libro> getAllLibri() {
        return libroRepository.findAll();
    }

    public Optional<Libro> getLibroById(Long id) {
        return libroRepository.findById(id);
    }

  

}