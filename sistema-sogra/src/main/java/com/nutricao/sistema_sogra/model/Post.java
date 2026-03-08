package com.nutricao.sistema_sogra.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "posts")
@Data

public class Post {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String titulo;

    @Column(columnDefinition = "TEXT")
    private String conteudo;

    private String imagemUrl;

    private String tipo; // Pode ser 'artigo' ou 'imagem'

    private LocalDateTime dataPublicacao = LocalDateTime.now();
}
