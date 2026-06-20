package com.victor.crudweb.controller;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import com.victor.crudweb.model.Usuario;
import com.victor.crudweb.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@Controller
public class DashboardController {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @GetMapping("/dashboard")
    public String dashboard(Model model) {
        model.addAttribute("usuarios", usuarioRepository.findAll());
        return "dashboard";
    }

    @GetMapping("/editar/{id}")
    public String editarUsuario(@PathVariable int id,
                                Model model) {

        Usuario usuario =
                usuarioRepository.findById(id).orElse(null);

        model.addAttribute("usuario", usuario);
        model.addAttribute("usuarios",
                usuarioRepository.findAll());

        return "dashboard";
    }



    @PostMapping("/guardar")
    public String guardarUsuario(
            @RequestParam String nombre,
            @RequestParam String password) {

        Usuario usuario = new Usuario();
        usuario.setNombre(nombre);
        usuario.setPassword(password);

        usuarioRepository.save(usuario);

        return "redirect:/dashboard";
    }
    @PostMapping("/actualizar")
    public String actualizarUsuario(
            @RequestParam int id,
            @RequestParam String nombre,
            @RequestParam String password) {

        Usuario usuario =
                usuarioRepository.findById(id).orElse(null);

        if (usuario != null) {

            usuario.setNombre(nombre);
            usuario.setPassword(password);

            usuarioRepository.save(usuario);
        }

        return "redirect:/dashboard";
    }

    @PostMapping("/eliminar/{id}")
    public String eliminarUsuario(@PathVariable int id) {

        usuarioRepository.deleteById(id);

        return "redirect:/dashboard";
    }
}


