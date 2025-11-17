package tarea_4.tarea_4.services;


import tarea_4.tarea_4.models.Nota;
import tarea_4.tarea_4.models.AvisoAdopcion;
import tarea_4.tarea_4.repository.NotaRepository;
import tarea_4.tarea_4.repository.AvisoRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class NotaService {
    private final NotaRepository notaRepo;
    private final AvisoRepository avisoRepo;

    public NotaService(NotaRepository notaRepo, AvisoRepository avisoRepo) {
        this.notaRepo = notaRepo;
        this.avisoRepo = avisoRepo;
    }

    @Transactional
    public Nota agregarNota(Integer avisoId, Integer valor) {
        if (valor == null || valor < 1 || valor > 7) {
            throw new IllegalArgumentException("La nota debe estar entre 1 y 7");
        }
        AvisoAdopcion aviso = avisoRepo.findById(avisoId)
                .orElseThrow(() -> new IllegalArgumentException("Aviso no existe"));
        Nota n = new Nota();
        n.setAviso(aviso);
        n.setValor(valor);
        return notaRepo.save(n);
    }

    public Double promedio(Integer avisoId) {
        return notaRepo.findAverageByAvisoId(avisoId);
    }

    public long contador(Integer avisoId) {
        return notaRepo.countByAvisoId(avisoId);
    }
}