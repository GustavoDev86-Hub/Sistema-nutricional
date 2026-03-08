package com.nutricao.sistema_sogra.repository;

import com.nutricao.sistema_sogra.model.Post;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PostRepository extends JpaRepository<Post, Long> {
}
