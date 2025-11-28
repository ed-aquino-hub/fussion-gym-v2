-- FUSSION GYM Database Schema
-- MySQL Database

CREATE DATABASE IF NOT EXISTS fussion_gym;
USE fussion_gym;

-- Usuario Table
CREATE TABLE usuario (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre_completo VARCHAR(200),
  dni VARCHAR(20),
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  telefono VARCHAR(20),
  edad INT,
  condiciones_medicas TEXT,
  rol ENUM('Cliente', 'Administrador') DEFAULT 'Cliente',
  puntos INT DEFAULT 0,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Membresía Table
CREATE TABLE membresia (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(255) NOT NULL,
  descripcion TEXT,
  precio_mensual DECIMAL(10,2),
  caracteristicas JSON,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Usuario-Membresía Relationship
CREATE TABLE usuario_membresia (
  id INT AUTO_INCREMENT PRIMARY KEY,
  usuarioId INT NOT NULL,
  membresiaId INT NOT NULL,
  fecha_inicio DATETIME NOT NULL,
  fecha_fin DATETIME NOT NULL,
  estado VARCHAR(50),
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (usuarioId) REFERENCES usuario(id),
  FOREIGN KEY (membresiaId) REFERENCES membresia(id)
);

-- Categoría Table
CREATE TABLE categoria (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(255) UNIQUE NOT NULL,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Ejercicio Table
CREATE TABLE ejercicio (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(255) NOT NULL,
  descripcion TEXT NOT NULL,
  video_url VARCHAR(255),
  puntos INT NOT NULL,
  dificultad VARCHAR(50),
  categoriaId INT NOT NULL,
  instructor VARCHAR(255),
  horario VARCHAR(255),
  capacidad_maxima INT,
  cupos_actuales INT,
  qr_code VARCHAR(255) UNIQUE,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (categoriaId) REFERENCES categoria(id)
);

-- Ejercicio-Usuario Relationship
CREATE TABLE ejercicio_usuario (
  id INT AUTO_INCREMENT PRIMARY KEY,
  usuarioId INT NOT NULL,
  ejercicioId INT NOT NULL,
  fecha_completado DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (usuarioId) REFERENCES usuario(id),
  FOREIGN KEY (ejercicioId) REFERENCES ejercicio(id)
);

-- Premio Table
CREATE TABLE premio (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(255) NOT NULL,
  descripcion TEXT,
  puntos_necesarios INT NOT NULL,
  stock INT NOT NULL,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Premio Reclamado Table
CREATE TABLE premio_reclamado (
  id INT AUTO_INCREMENT PRIMARY KEY,
  usuarioId INT NOT NULL,
  premioId INT NOT NULL,
  fecha_reclamo DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (usuarioId) REFERENCES usuario(id),
  FOREIGN KEY (premioId) REFERENCES premio(id)
);

-- Indexes for better performance
CREATE INDEX idx_usuario_email ON usuario(email);
CREATE INDEX idx_usuario_rol ON usuario(rol);
CREATE INDEX idx_ejercicio_qr ON ejercicio(qr_code);
CREATE INDEX idx_ejercicio_usuario_fecha ON ejercicio_usuario(fecha_completado);
CREATE INDEX idx_premio_reclamado_fecha ON premio_reclamado(fecha_reclamo);
