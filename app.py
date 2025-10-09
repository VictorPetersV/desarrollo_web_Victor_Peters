import os
from datetime import datetime
from werkzeug.utils import secure_filename

from flask import (
    Flask, render_template, request, redirect, url_for, flash, abort, send_from_directory
)
from flask_sqlalchemy import SQLAlchemy

# ------------------------------------------------------
# CONFIGURACIÓN INICIAL
# ------------------------------------------------------
app = Flask(__name__)
app.secret_key = "clave_secreta_flask"  # cámbiala para producción

# Ajusta la URI si tu host/puerto/credenciales difieren
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://cc5002:programacionweb@localhost/tarea2'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Carpeta para subir imágenes (asegúrate de que exista)
UPLOAD_FOLDER = os.path.join('static', 'uploads')
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

# Tamaños permitidos (por ejemplo): (opcional)
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}

db = SQLAlchemy(app)

# ---- FUNCIONES AUXILIARES ----
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def parse_datetime_local(dt_str):
    if not dt_str:
        return None
    try:
        return datetime.strptime(dt_str, "%Y-%m-%dT%H:%M")
    except ValueError:
        return None

# ------------------------------------------------------
# MODELOS (mapeo exacto al script SQL que compartiste)
# ------------------------------------------------------
class Region(db.Model):
    __tablename__ = 'region'
    id = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(200), nullable=False)
    comunas = db.relationship('Comuna', backref='region', lazy=True)

class Comuna(db.Model):
    __tablename__ = 'comuna'
    id = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(200), nullable=False)
    region_id = db.Column(db.Integer, db.ForeignKey('region.id'), nullable=False)

class AvisoAdopcion(db.Model):
    __tablename__ = 'aviso_adopcion'
    id = db.Column(db.Integer, primary_key=True)
    fecha_ingreso = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    comuna_id = db.Column(db.Integer, db.ForeignKey('comuna.id'), nullable=False)
    sector = db.Column(db.String(100))
    nombre = db.Column(db.String(200), nullable=False)  # nombre contacto
    email = db.Column(db.String(100), nullable=False)
    celular = db.Column(db.String(15))
    tipo = db.Column(db.Enum('gato', 'perro'), nullable=False)
    cantidad = db.Column(db.Integer, nullable=False)
    edad = db.Column(db.Integer, nullable=False)
    unidad_medida = db.Column(db.Enum('a', 'm'), nullable=False)  # 'a' años, 'm' meses
    fecha_entrega = db.Column(db.DateTime, nullable=False)
    descripcion = db.Column(db.Text)

    # relaciones
    fotos = db.relationship('Foto', backref='aviso', lazy=True, cascade='all, delete-orphan')
    contactos = db.relationship('ContactarPor', backref='aviso', lazy=True, cascade='all, delete-orphan')

class Foto(db.Model):
    __tablename__ = 'foto'
    id = db.Column(db.Integer, primary_key=True)
    ruta_archivo = db.Column(db.String(300), nullable=False)   # ruta en uploads (filename)
    nombre_archivo = db.Column(db.String(300), nullable=False)  # nombre original
    aviso_id = db.Column(db.Integer, db.ForeignKey('aviso_adopcion.id'), nullable=False)

class ContactarPor(db.Model):
    __tablename__ = 'contactar_por'
    id = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.Enum('whatsapp', 'telegram', 'X', 'instagram', 'tiktok', 'otra'), nullable=False)
    identificador = db.Column(db.String(150), nullable=False)
    aviso_id = db.Column(db.Integer, db.ForeignKey('aviso_adopcion.id'), nullable=False)

# ------------------------------------------------------
# RUTAS
# ------------------------------------------------------

# Helper: convertir string datetime ISO (HTML datetime-local) a datetime
def parse_datetime_local(value):
    if not value:
        return None
    try:
        # formato 'YYYY-MM-DDTHH:MM' o 'YYYY-MM-DDTHH:MM:SS'
        if len(value) == 16:
            return datetime.strptime(value, "%Y-%m-%dT%H:%M")
        return datetime.fromisoformat(value)
    except Exception:
        return None

# Inicio: últimos 5 avisos ordenados por fecha_ingreso descendente
@app.route('/')
def inicio():
    avisos = AvisoAdopcion.query.order_by(AvisoAdopcion.fecha_ingreso.desc()).limit(5).all()
    # las plantillas deben usar: for aviso in avisos: aviso.fotos -> lista de Foto
    return render_template('inicio.html', avisos=avisos)

# Listado: paginado (5 por página)
@app.route('/listado')
def listado():
    try:
        page = int(request.args.get('page', 1))
        if page < 1:
            page = 1
    except ValueError:
        page = 1
    per_page = 5
    pagination = AvisoAdopcion.query.order_by(AvisoAdopcion.fecha_ingreso.desc()).paginate(page=page, per_page=per_page, error_out=False)
    avisos = pagination.items
    return render_template('listado.html', avisos=avisos, pagination=pagination, page=page, total_pages=pagination.pages)

# Detalle: aviso + fotos + contactos
@app.route('/detalle/<int:id>')
def detalle(id):
    aviso = AvisoAdopcion.query.get_or_404(id)
    # aviso.fotos -> lista de Foto objects
    return render_template('detalle.html', aviso=aviso)

# Agregar aviso: GET muestra formulario; POST procesa y guarda en DB + archivos

@app.route('/agregar', methods=['GET', 'POST'])
def agregar_aviso():
    regiones = Region.query.order_by(Region.nombre).all()

    if request.method == 'POST':
        try:
            # Obtener directamente los IDs desde el formulario
            region_id = request.form.get('region')
            comuna_id = request.form.get('comuna')

            try:
                region_id = int(region_id) if region_id else None
                comuna_id = int(comuna_id) if comuna_id else None
            except ValueError:
                region_id = None
                comuna_id = None
            fecha_entrega = parse_datetime_local(request.form.get('availableDate'))

            aviso = AvisoAdopcion(
                fecha_ingreso=datetime.utcnow(),
                comuna_id=comuna_id,
                sector=request.form.get('sector') or None,
                nombre=request.form.get('contactName') or '',
                email=request.form.get('contactEmail') or '',
                celular=request.form.get('contactPhone') or None,
                tipo=request.form.get('petType') or None,
                cantidad=int(request.form.get('petCount')) if request.form.get('petCount') else 1,
                edad=int(request.form.get('petAge')) if request.form.get('petAge') else 0,
                unidad_medida=request.form.get('petAgeUnit') or None,
                fecha_entrega=fecha_entrega or datetime.utcnow(),
                descripcion=request.form.get('description') or None
            )

            db.session.add(aviso)
            db.session.flush()  # obtiene aviso.id antes del commit

            # ---- Subida de fotos ----
            files = request.files.getlist('photos')
            for f in files:
                if f and f.filename:
                    if not allowed_file(f.filename):
                        flash(f"Archivo {f.filename} no permitido (extensión inválida).", "warning")
                        continue
                    orig_name = secure_filename(f.filename)
                    timestamp = datetime.utcnow().strftime("%Y%m%d%H%M%S%f")
                    filename = f"{aviso.id}_{timestamp}_{orig_name}"
                    save_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
                    f.save(save_path)
                    foto = Foto(ruta_archivo=filename, nombre_archivo=orig_name, aviso_id=aviso.id)
                    db.session.add(foto)

            # ---- Red social / medio de contacto ----
            canal = request.form.get('contactChannel')
            identificador = request.form.get('channelInfo')
            if canal and identificador:
                contacto = ContactarPor(nombre=canal, identificador=identificador, aviso_id=aviso.id)
                db.session.add(contacto)

            db.session.commit()
            flash('Aviso registrado correctamente.', 'success')
            return redirect(url_for('detalle', id=aviso.id))

        except Exception as e:
            db.session.rollback()
            flash(f'Error al intentar guardar: {str(e)}', 'danger')
            print("ERROR guardar aviso:", e)

    return render_template('agregar-aviso.html', regiones=regiones)


# Estadísticas
@app.route('/estadisticas')
def estadisticas():
    # Total de avisos por tipo
    tipo_counts = (
        db.session.query(AvisoAdopcion.tipo, db.func.count(AvisoAdopcion.id))
        .group_by(AvisoAdopcion.tipo)
        .all()
    )
    tipos = [t[0] for t in tipo_counts]
    cantidades_tipos = [t[1] for t in tipo_counts]

    # Total de avisos por región
    region_counts = (
        db.session.query(Region.nombre, db.func.count(AvisoAdopcion.id))
        .join(Comuna, Region.id == Comuna.region_id)
        .join(AvisoAdopcion, Comuna.id == AvisoAdopcion.comuna_id)
        .group_by(Region.nombre)
        .all()
    )
    regiones = [r[0] for r in region_counts]
    cantidades_regiones = [r[1] for r in region_counts]

    # Avisos por mes (últimos 6 meses)
    mes_counts = (
        db.session.query(db.func.date_format(AvisoAdopcion.fecha_ingreso, '%Y-%m'), db.func.count(AvisoAdopcion.id))
        .group_by(db.func.date_format(AvisoAdopcion.fecha_ingreso, '%Y-%m'))
        .order_by(db.func.date_format(AvisoAdopcion.fecha_ingreso, '%Y-%m'))
        .all()
    )
    meses = [m[0] for m in mes_counts]
    cantidades_meses = [m[1] for m in mes_counts]

    return render_template(
        'estadisticas.html',
        tipos=tipos,
        cantidades_tipos=cantidades_tipos,
        regiones=regiones,
        cantidades_regiones=cantidades_regiones,
        meses=meses,
        cantidades_meses=cantidades_meses
    )

@app.route('/uploads/<path:filename>')
def uploaded_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

# ------------------------------------------------------
# INICIO DEL SERVIDOR
# ------------------------------------------------------

if __name__ == '__main__':
    app.run(debug=True)

