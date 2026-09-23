package com.personaltracker.Personal.Task.Tracker.demo;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class DemoController {

    @GetMapping("/api/v1/demo-controller")
    public String sayHello() {
        return "Hello from a secured endpoint";
    }
}