package tarea_4.tarea_4.models;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "aviso_adopcion")
public class AvisoAdopcion {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name="fecha_ingreso", nullable=false)
    private LocalDateTime fechaIngreso;

    @ManyToOne
    @JoinColumn(name="comuna_id", nullable=false)
    private Comuna comuna;

    @Column(length=100)
    private String sector;

    @Column(name="nombre", length=200, nullable=false)
    private String nombre; // contacto

    @Column(name="email", length=100, nullable=false)
    private String email;

    @Column(name="celular", length=15)
    private String celular;

    @Column(name="tipo", nullable=false)
    private String tipo; // 'gato'/'perro'

    @Column(nullable=false)
    private Integer cantidad;

    @Column(nullable=false)
    private Integer edad;

    @Column(name="unidad_medida", nullable=false)
    private String unidadMedida; // 'a' o 'm'

    @Column(name="fecha_entrega", nullable=false)
    private LocalDateTime fechaEntrega;

    @Column(columnDefinition = "TEXT")
    private String descripcion;

    @OneToMany(mappedBy = "aviso", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    private List<Foto> fotos;

    @OneToMany(mappedBy = "aviso", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    private List<Comentario> comentarios;

    @OneToMany(mappedBy = "aviso", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    private List<Nota> notas;

        public AvisoAdopcion() {}

    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public LocalDateTime getFechaIngreso() { return fechaIngreso; }
    public void setFechaIngreso(LocalDateTime fechaIngreso) { this.fechaIngreso = fechaIngreso; }

    public Comuna getComuna() { return comuna; }
    public void setComuna(Comuna comuna) { this.comuna = comuna; }

    public String getSector() { return sector; }
    public void setSector(String sector) { this.sector = sector; }

    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getCelular() { return celular; }
    public void setCelular(String celular) { this.celular = celular; }

    public String getTipo() { return tipo; }
    public void setTipo(String tipo) { this.tipo = tipo; }

    public Integer getCantidad() { return cantidad; }
    public void setCantidad(Integer cantidad) { this.cantidad = cantidad; }

    public Integer getEdad() { return edad; }
    public void setEdad(Integer edad) { this.edad = edad; }

    public String getUnidadMedida() { return unidadMedida; }
    public void setUnidadMedida(String unidadMedida) { this.unidadMedida = unidadMedida; }

    public LocalDateTime getFechaEntrega() { return fechaEntrega; }
    public void setFechaEntrega(LocalDateTime fechaEntrega) { this.fechaEntrega = fechaEntrega; }

    public String getDescripcion() { return descripcion; }
    public void setDescripcion(String descripcion) { this.descripcion = descripcion; }

    public List<Foto> getFotos() { return fotos; }
    public void setFotos(List<Foto> fotos) { this.fotos = fotos; }

    public List<Comentario> getComentarios() { return comentarios; }
    public void setComentarios(List<Comentario> comentarios) { this.comentarios = comentarios; }

    public List<Nota> getNotas() { return notas; }
    public void setNotas(List<Nota> notas) { this.notas = notas; }
}
