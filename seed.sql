-- FUSSION GYM Seed Data
USE fussion_gym;

-- Insert Admin and Client Users (password is 'password123' hashed with bcrypt)
INSERT INTO usuario (nombre_completo, dni, email, password, telefono, edad, condiciones_medicas, rol, puntos) VALUES
('Admin FUSSION', '12345678', 'admin@fussion.gym', '$2b$10$YQiLt3LZeWN5jH.rT4gCNOZ8o8KvfJ/gQJ9p9X9X9X9X9X9X9X9Xe', '555-0000', 30, NULL, 'Administrador', 0),
('Carlos Ramírez', '23456789', 'carlos@email.com', '$2b$10$YQiLt3LZeWN5jH.rT4gCNOZ8o8KvfJ/gQJ9p9X9X9X9X9X9X9X9Xe', '555-0001', 25, NULL, 'Cliente', 450),
('María González', '34567890', 'maria@email.com', '$2b$10$YQiLt3LZeWN5jH.rT4gCNOZ8o8KvfJ/gQJ9p9X9X9X9X9X9X9X9Xe', '555-0002', 28, 'Asma leve', 'Cliente', 780),
('Juan Pérez', '45678901', 'juan@email.com', '$2b$10$YQiLt3LZeWN5jH.rT4gCNOZ8o8KvfJ/gQJ9p9X9X9X9X9X9X9X9Xe', '555-0003', 32, NULL, 'Cliente', 1200),
('Ana Torres', '56789012', 'ana@email.com', '$2b$10$YQiLt3LZeWN5jH.rT4gCNOZ8o8KvfJ/gQJ9p9X9X9X9X9X9X9X9Xe', '555-0004', 22, NULL, 'Cliente', 320);

-- Insert Memberships
INSERT INTO membresia (nombre, descripcion, precio_mensual, caracteristicas) VALUES
('Básica', 'Acceso a todas las máquinas del gimnasio', 29.99, '["Acceso 24/7", "Zona de pesas", "Área cardio"]'),
('Premium', 'Incluye clases grupales y entrenador personal', 49.99, '["Todo de Básica", "Clases grupales ilimitadas", "1 sesión personal/mes", "Zona funcional"]'),
('Elite', 'Experiencia completa con beneficios exclusivos', 79.99, '["Todo de Premium", "4 sesiones personales/mes", "Acceso a spa", "Estacionamiento VIP", "Nutricionista"]');

-- Insert User-Membership Relationships
INSERT INTO usuario_membresia (usuarioId, membresiaId, fecha_inicio, fecha_fin, estado) VALUES
(2, 1, '2024-01-01 00:00:00', '2025-01-01 00:00:00', 'activa'),
(3, 2, '2024-02-15 00:00:00', '2025-02-15 00:00:00', 'activa'),
(4, 3, '2024-01-10 00:00:00', '2025-01-10 00:00:00', 'activa'),
(5, 1, '2024-03-01 00:00:00', '2025-03-01 00:00:00', 'activa');

-- Insert Categories
INSERT INTO categoria (nombre) VALUES
('Cardio'),
('Fuerza'),
('Funcional'),
('Yoga y Flexibilidad'),
('Clases Grupales');

-- Insert Exercises with QR codes
INSERT INTO ejercicio (nombre, descripcion, video_url, puntos, dificultad, categoriaId, instructor, horario, capacidad_maxima, cupos_actuales, qr_code) VALUES
-- Cardio
('Cinta de Correr', 'Ejercicio cardiovascular en cinta', 'https://example.com/videos/cinta', 10, 'Principiante', 1, NULL, NULL, NULL, NULL, 'QR-CINTA-001'),
('Bicicleta Estática', 'Entrenamiento de resistencia en bicicleta', 'https://example.com/videos/bici', 10, 'Principiante', 1, NULL, NULL, NULL, NULL, 'QR-BICI-001'),
('Elíptica', 'Ejercicio de bajo impacto', 'https://example.com/videos/eliptica', 15, 'Intermedio', 1, NULL, NULL, NULL, NULL, 'QR-ELIPTICA-001'),

-- Fuerza
('Press de Banca', 'Desarrollo de pecho y tríceps', 'https://example.com/videos/press', 20, 'Intermedio', 2, NULL, NULL, NULL, NULL, 'QR-PRESS-001'),
('Sentadillas', 'Fortalecimiento de piernas', 'https://example.com/videos/sentadillas', 25, 'Intermedio', 2, NULL, NULL, NULL, NULL, 'QR-SENTADILLAS-001'),
('Peso Muerto', 'Ejercicio compuesto de espalda y piernas', 'https://example.com/videos/pesomuerto', 30, 'Avanzado', 2, NULL, NULL, NULL, NULL, 'QR-PESOMUERTO-001'),

-- Funcional
('TRX Suspension', 'Entrenamiento con peso corporal', 'https://example.com/videos/trx', 20, 'Intermedio', 3, NULL, NULL, NULL, NULL, 'QR-TRX-001'),
('Battle Ropes', 'Ejercicio de alta intensidad', 'https://example.com/videos/ropes', 25, 'Avanzado', 3, NULL, NULL, NULL, NULL, 'QR-ROPES-001'),

-- Yoga
('Yoga Matutino', 'Sesión de yoga para comenzar el día', NULL, 15, 'Principiante', 4, 'Laura Meditation', 'Lun-Mie-Vie 7:00 AM', 20, 15, 'QR-YOGA-MAT-001'),
('Stretching Avanzado', 'Estiramiento profundo y flexibilidad', NULL, 20, 'Avanzado', 4, 'Carlos Flex', 'Mar-Jue 6:00 PM', 15, 10, 'QR-STRETCH-001'),

-- Clases Grupales
('Spinning', 'Clase de ciclismo indoor de alta intensidad', NULL, 30, 'Intermedio', 5, 'Marta Cycle', 'Lun-Mie-Vie 6:00 PM', 25, 20, 'QR-SPINNING-001'),
('CrossFit', 'Entrenamiento funcional de alta intensidad', NULL, 40, 'Avanzado', 5, 'Roberto Strong', 'Mar-Jue-Sab 5:00 PM', 15, 12, 'QR-CROSSFIT-001'),
('Zumba', 'Baile fitness al ritmo de música latina', NULL, 25, 'Principiante', 5, 'Sofia Dance', 'Lun-Mie-Vie 7:00 PM', 30, 25, 'QR-ZUMBA-001'),

-- Special: Attendance (used by admin to register attendance)
('Asistencia Regular', 'Registro de asistencia al gimnasio', NULL, 50, 'Principiante', 1, NULL, NULL, NULL, NULL, 'QR-ASISTENCIA-ESPECIAL');

-- Insert Rewards with emoji representations
INSERT INTO premio (nombre, descripcion, puntos_necesarios, stock) VALUES
('🧴 Shaker FUSSION', 'Botella mezcladora deportiva con logo FUSSION', 100, 50),
('👕 Camiseta Deportiva', 'Camiseta técnica transpirable FUSSION GYM', 250, 30),
('🧢 Gorra FUSSION', 'Gorra deportiva con logo bordado', 200, 40),
('💪 Guantes de Entrenamiento', 'Guantes profesionales para levantamiento', 300, 25),
('🎒 Mochila Deportiva', 'Mochila grande con compartimentos', 500, 15),
('🎟️ Clase Personal Gratis', 'Una sesión de entrenamiento personal', 400, 20),
('🥤 Batido de Proteína', 'Batido post-entrenamiento premium', 150, 100),
('🧘 Mes de Yoga Gratis', 'Acceso ilimitado a clases de yoga por 1 mes', 600, 10),
('🏆 Toalla Premium', 'Toalla de microfibra FUSSION de alta calidad', 180, 35),
('📱 Brazalete Deportivo', 'Brazalete para smartphone con logo FUSSION', 220, 30);

-- Insert Sample Exercise Completions
INSERT INTO ejercicio_usuario (usuarioId, ejercicioId, fecha_completado) VALUES
(2, 1, '2024-11-20 08:00:00'),
(2, 5, '2024-11-21 08:30:00'),
(2, 11, '2024-11-22 18:00:00'),
(3, 9, '2024-11-18 07:00:00'),
(3, 13, '2024-11-19 19:00:00'),
(3, 2, '2024-11-20 08:00:00'),
(3, 6, '2024-11-21 09:00:00'),
(4, 12, '2024-11-15 17:00:00'),
(4, 6, '2024-11-16 18:00:00'),
(4, 8, '2024-11-17 19:00:00'),
(4, 14, '2024-11-18 08:00:00'),
(4, 5, '2024-11-19 18:30:00'),
(5, 1, '2024-11-22 09:00:00'),
(5, 13, '2024-11-23 19:00:00');

-- Insert Sample Redemptions
INSERT INTO premio_reclamado (usuarioId, premioId, fecha_reclamo) VALUES
(4, 1, '2024-11-10 10:00:00'),
(4, 7, '2024-11-15 11:00:00'),
(3, 1, '2024-11-12 14:00:00'),
(3, 9, '2024-11-20 15:00:00');
