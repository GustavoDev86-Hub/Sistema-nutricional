package com.nutricao.sistema_sogra.controller;

import com.nutricao.sistema_sogra.model.Post;
import com.nutricao.sistema_sogra.repository.PostRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.List;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/posts")
public class PostController {
    @Autowired
    private PostRepository postRepository;

    @GetMapping
    public List<Post> listar() {
        return postRepository.findAll();
    }

    @PostMapping
    public Post criar(@RequestParam("titulo") String titulo,
                      @RequestParam("conteudo") String conteudo,
                      @RequestParam("tipo") String tipo,
                      @RequestParam("imagem") MultipartFile arquivo) {

        String CAMINHO_IMAGENS = "uploads/";
        
        Post post = new Post();
        post.setTitulo(titulo);
        post.setConteudo(conteudo);
        post.setTipo(tipo);
        post.setDataPublicacao(LocalDateTime.now());

        try {
            if (!arquivo.isEmpty()) {
                Path diretorio = Paths.get(CAMINHO_IMAGENS);
                if (!Files.exists(diretorio)) {
                    Files.createDirectories(diretorio);
                }

                String nomeImagem = System.currentTimeMillis() + "_" + arquivo.getOriginalFilename();
                Path caminhoCompleto = diretorio.resolve(nomeImagem);

                Files.write(caminhoCompleto, arquivo.getBytes());

                post.setImagemUrl(nomeImagem);
            }
        } catch (IOException e) {
            e.printStackTrace();
        }

        return postRepository.save(post);
    }
}
