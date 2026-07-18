package com.alex.pro.repository;

import com.alex.pro.model.Categoria;
import com.alex.pro.model.Prodotto;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CategoriaRepository extends JpaRepository<Categoria, Long> {
}
