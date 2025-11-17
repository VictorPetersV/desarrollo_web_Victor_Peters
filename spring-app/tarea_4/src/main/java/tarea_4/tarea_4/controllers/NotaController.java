package tarea_4.tarea_4.controllers;

import tarea_4.tarea_4.services.NotaService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/notas")
public class NotaController {
    private final NotaService notaService;

    public NotaController(NotaService notaService) {
        this.notaService = notaService;
    }

    @PostMapping("/agregar")
    public ResponseEntity<?> agregar(@RequestBody Map<String, Object> payload) {
        try {
            Integer avisoId = (Integer) payload.get("avisoId");
            Integer nota = (Integer) payload.get("nota");
            if (avisoId == null || nota == null) {
                return ResponseEntity.badRequest().body(Map.of("ok", false, "error", "Faltan campos"));
            }
            if (nota < 1 || nota > 7) {
                return ResponseEntity.badRequest().body(Map.of("ok", false, "error", "Nota fuera de rango"));
            }
            notaService.agregarNota(avisoId, nota);
            Double promedio = notaService.promedio(avisoId);
            long total = notaService.contador(avisoId);
            return ResponseEntity.ok(Map.of("ok", true, "promedio", promedio, "total", total));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("ok", false, "error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("ok", false, "error", "Error interno"));
        }
    }
}