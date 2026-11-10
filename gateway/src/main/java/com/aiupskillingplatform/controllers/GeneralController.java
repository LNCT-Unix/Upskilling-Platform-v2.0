package com.aiupskillingplatform.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class GeneralController {
    //health api
        @GetMapping("/api/health")
    public ResponseEntity<String> checkHealth(){
        return ResponseEntity.ok("The server is live");
    }
}
