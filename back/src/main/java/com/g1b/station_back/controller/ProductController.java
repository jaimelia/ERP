package com.g1b.station_back.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;

@RestController
@RequestMapping("/products")
public class ProductController {

    @GetMapping("/{productId}")
    public Long getProduct(@PathVariable Long productId) {
        return productId;
    }

    @GetMapping("/all")
    public void getAllProducts() {

    }

    @GetMapping("/ping")
    public String pong() {
        return "I\'m alive !";
    }
}
