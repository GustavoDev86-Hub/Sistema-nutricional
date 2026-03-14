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

@RestController
@RequestMapping("/api/posts")
@CrossOrigin(origins = "*")
public class PostController {
    @Autowired
    private PostRepository postRepository;

    @GetMapping
    public List<Post> listar() {
        return postRepository.findAll();
    }

    @PostMapping
public Post criar(@RequestBody Post post) { // @RequestBody faz a mágica
    post.setDataPublicacao(LocalDateTime.now());
    return postRepository.save(post);
    } 
}
