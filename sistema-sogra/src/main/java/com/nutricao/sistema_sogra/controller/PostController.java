package com.nutricao.sistema_sogra.controller;

import com.nutricao.sistema_sogra.model.Post;
import com.nutricao.sistema_sogra.repository.PostRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/posts")
public class PostController {
    @Autowired
    private PostRepository postRepository;

    // Rota para listar tudo o que ela já postou
    @GetMapping
    public List<Post> listar() {
        return postRepository.findAll();
    }

    // Rota para ela salvar um post novo
    @PostMapping
    public Post criar(@RequestBody Post post) {
        return postRepository.save(post);
    }
}
