package tarea_4.tarea_4.controllers;


import tarea_4.tarea_4.models.AvisoAdopcion;
import tarea_4.tarea_4.repository.AvisoRepository;
import tarea_4.tarea_4.services.NotaService;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Controller
public class AvisoController {
    private final AvisoRepository avisoRepo;
    private final NotaService notaService;

    public AvisoController(AvisoRepository avisoRepo, NotaService notaService) {
        this.avisoRepo = avisoRepo;
        this.notaService = notaService;
    }

    @GetMapping({"/listado", "/avisos"})
    public String listado(Model model) {
        List<AvisoAdopcion> avisos = avisoRepo.findAll();
        Map<Integer, Double> promedios = new HashMap<>();
        Map<Integer, Long> totales = new HashMap<>();
        for (AvisoAdopcion a : avisos) {
            Double avg = notaService.promedio(a.getId());
            long cnt = notaService.contador(a.getId());
            promedios.put(a.getId(), avg);
            totales.put(a.getId(), cnt);
        }
        model.addAttribute("avisos", avisos);
        model.addAttribute("promedios", promedios);
        model.addAttribute("totales", totales);
        return "listado";
    }
}