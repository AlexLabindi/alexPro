package com.alex.pro.repository;

import com.alex.pro.dto.LibroRequestDTO;
import com.alex.pro.dto.LibroResponseDTO;
import com.alex.pro.model.Libro;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LibroRepository extends JpaRepository<Libro, Long> {

   // List<Libro> findLibrosByTitolo(String titolo, Sort sort);

    List<Libro> findByGenere_Id(Long Id);

    List<Libro> findLibrosByTitolo(String titolo, Sort sort);



}