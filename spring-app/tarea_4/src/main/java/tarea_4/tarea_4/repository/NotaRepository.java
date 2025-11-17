package tarea_4.tarea_4.repository;

import tarea_4.tarea_4.models.Nota;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface NotaRepository extends JpaRepository<Nota, Integer> {
    @Query("SELECT AVG(n.valor) FROM Nota n WHERE n.aviso.id = :avisoId")
    Double findAverageByAvisoId(@Param("avisoId") Integer avisoId);

    long countByAvisoId(Integer avisoId);
}