# TP DSW

# INFO PARA CORRER EL PROYECTO_:

## En consola , en la carpeta donde vas a clonar el proyecto hace:
git clone https://github.com/nuriafornells/monorepoTP.git 

## luego (estando en la carpeta donde clonaste el proyecto):

### -primero nos paramos en la carpeta del frontend (monorepoTP/FRONTEND_Y_BACKEND_TP/frontend/)
#### instalamos para el frontend:
npm install

## luego nos paramos en la carpeta del backend (monorepoTP/FRONTEND_Y_BACKEND_TP/backend/)
### instalamos para el backend:
npm install


## EN MYSQL PARA CREAR BD DEL PROYECTO (viajes_db):

-- Crear base de datos
CREATE DATABASE IF NOT EXISTS viajes_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_general_ci;

USE viajes_db;

-- Tabla de usuarios
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) DEFAULT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL DEFAULT 'user',
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Tabla de destinos
CREATE TABLE IF NOT EXISTS destinos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(255) NOT NULL,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Tabla de hoteles
CREATE TABLE IF NOT EXISTS hotels (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(255) NOT NULL,
  ubicacion VARCHAR(255) NOT NULL,
  categoria VARCHAR(100) DEFAULT NULL,
  destino_id INT DEFAULT NULL,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_hotels_destino FOREIGN KEY (destino_id)
    REFERENCES destinos(id)
    ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB;

-- Tabla de paquetes
CREATE TABLE IF NOT EXISTS paquetes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(255) NOT NULL,
  descripcion TEXT DEFAULT NULL,
  duracion INT NOT NULL,
  precio DECIMAL(12,2) NOT NULL,
  fechaInicio DATE DEFAULT NULL,
  fechaFin DATE DEFAULT NULL,
  publicado TINYINT(1) NOT NULL DEFAULT 0,
  fotoURL VARCHAR(500) DEFAULT NULL,
  hotel_id INT NOT NULL,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_paquetes_hotel FOREIGN KEY (hotel_id)
    REFERENCES hotels(id)
    ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB;

-- Tabla de reservas
CREATE TABLE IF NOT EXISTS reservations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  fechaReserva DATE DEFAULT NULL,
  fechaInicio DATE DEFAULT NULL,
  fechaFin DATE DEFAULT NULL,
  cantidadPersonas INT NOT NULL,
  estado VARCHAR(50) NOT NULL DEFAULT 'pendiente',
  user_id INT NOT NULL,
  paquete_id INT NOT NULL,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_reservations_user FOREIGN KEY (user_id)
    REFERENCES users(id)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_reservations_paquete FOREIGN KEY (paquete_id)
    REFERENCES paquetes(id)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;


## crear un archivo llamado .env en la raíz de la carpeta del backend y utilizar esta base de código (completar con los datos de tu sql , el user y password)
DB_HOST=localhost
DB_USER=
DB_PASSWORD=
DB_NAME= viajes_db
JWT_SECRET=clavetokensecreta


## estando en la carpeta del backend, en consola correr src/scripts/seedUser.js para crear un admin y un user base

### ADMIN BASE
email: admin@admin.com
contraseña: admin123

### USER BASE
email: user@user.com
contraseña: user123

## CORRER PROGRAMA
### una consola para frontend en monorepoTP/FRONTEND_Y_BACKEND_TP/frontend/ 
#### ejecutar:
npm run dev

### una consola para el backend en monorepoTP/FRONTEND_Y_BACKEND_TP/backend/
#### ejecutar:
node src


## cambios respecto a las imagenes
Para que corra vas a necesitar crear el atributo fotoURL en mysql y ahi guardar la 
direccion entera de donde estan guardadas las fotos en la carpeta public del backend.
Aun hay que ver como hacer para editarla desde el admin