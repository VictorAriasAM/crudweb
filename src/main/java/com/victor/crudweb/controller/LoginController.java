package com.victor.crudweb.controller;

import com.victor.crudweb.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

@Controller
public class LoginController {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @GetMapping("/")
    public String login() {
        return "login";
    }

    @PostMapping("/login")
    public String validarLogin(
            @RequestParam String nombre,
            @RequestParam String password,
            Model model) {

        var usuario = usuarioRepository.findByNombreAndPassword(nombre, password);

        if (usuario.isPresent()) {
            model.addAttribute("mensaje", "✅ Login correcto");
        } else {
            model.addAttribute("mensaje", "❌ Usuario incorrecto");
        }

        return "redirect:/music";
    }
}