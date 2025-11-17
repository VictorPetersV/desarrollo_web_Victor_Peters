package tarea_4.tarea_4.repository;


import tarea_4.tarea_4.models.AvisoAdopcion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AvisoRepository extends JpaRepository<AvisoAdopcion, Integer> {
}