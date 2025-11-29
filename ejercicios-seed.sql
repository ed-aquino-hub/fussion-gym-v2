-- Seed data for categorias and ejercicios tables
-- This script will populate both tables with sample data

-- ============================================
-- STEP 1: Insert Categories
-- ============================================
INSERT INTO categoria (nombre, createdAt) VALUES
('Cardio', NOW()),
('Musculación', NOW()),
('Yoga', NOW()),
('Funcional', NOW()),
('Boxeo', NOW()),
('Pilates', NOW()),
('Natación', NOW()),
('Ciclismo', NOW());

-- ============================================
-- STEP 2: Insert Exercises
-- ============================================
-- Insert sample exercises with various categories and difficulty levels
INSERT INTO ejercicio (nombre, descripcion, video_url, puntos, dificultad, categoriaId, instructor, horario, capacidad_maxima, cupos_actuales, qr_code, createdAt) VALUES
-- Cardio exercises
('Spinning Intenso', 'Clase de ciclismo indoor de alta intensidad con intervalos de velocidad. Mejora resistencia cardiovascular y quema calorías.', 'https://www.youtube.com/watch?v=S5YFCz9eW5k', 50, 'Difícil', 1, 'Juan Pérez', 'Lun/Mié/Vie 7:00 AM', 20, 0, 'EX-SPIN-001', NOW()),
('Cardio Dance', 'Baile aeróbico con música latina y ritmos modernos. Ejercicio cardiovascular divertido y energético.', 'https://www.youtube.com/watch?v=3aF9AJm0RFc', 30, 'Fácil', 1, 'María González', 'Mar/Jue 6:00 PM', 25, 0, 'EX-DANCE-002', NOW()),
('HIIT Training', 'Entrenamiento de intervalos de alta intensidad. Combina ejercicios de fuerza y cardio en sesiones cortas pero intensas.', 'https://www.youtube.com/watch?v=ml6cT4AZdqI', 60, 'Difícil', 1, 'Carlos Ramírez', 'Lun/Mié/Vie 6:30 PM', 15, 0, 'EX-HIIT-003', NOW()),

-- Strength/Musculación exercises
('Pesas Básico', 'Introducción al entrenamiento con pesas. Aprende las técnicas correctas para ejercicios fundamentales.', 'https://www.youtube.com/watch?v=IODxDxX7oi4', 40, 'Fácil', 2, 'Roberto Silva', 'Mar/Jue/Sáb 8:00 AM', 12, 0, 'EX-PESO-004', NOW()),
('Levantamiento Olímpico', 'Técnicas avanzadas de levantamiento de pesas olímpicas. Desarrolla fuerza explosiva y potencia.', 'https://www.youtube.com/watch?v=mPsxlNjv7Aw', 70, 'Difícil', 2, 'Andrea Torres', 'Lun/Mié/Vie 5:00 PM', 10, 0, 'EX-OLIMP-005', NOW()),
('CrossFit WOD', 'Workout of the Day de CrossFit. Entrenamiento funcional de alta intensidad combinando múltiples ejercicios.', 'https://www.youtube.com/watch?v=gfb978YfAY8', 65, 'Difícil', 2, 'Diego Vargas', 'Lun a Vie 7:00 AM', 18, 0, 'EX-CROSS-006', NOW()),

-- Yoga/Flexibility exercises  
('Yoga Para Principiantes', 'Clase de yoga suave enfocada en posturas básicas y respiración. Ideal para comenzar tu práctica.', 'https://www.youtube.com/watch?v=v7AYKMP6rOE', 25, 'Fácil', 3, 'Laura Mendoza', 'Mar/Jue 9:00 AM', 20, 0, 'EX-YOGA-007', NOW()),
('Vinyasa Flow', 'Yoga dinámico con secuencias fluidas. Mejora flexibilidad, fuerza y equilibrio.', 'https://www.youtube.com/watch?v=9kOCY0KNByw', 35, 'Intermedio', 3, 'Laura Mendoza', 'Lun/Mié/Vie 6:00 PM', 20, 0, 'EX-VINY-008', NOW()),
('Estiramientos y Movilidad', 'Sesión enfocada en mejorar flexibilidad y rango de movimiento. Previene lesiones y mejora recuperación.', 'https://www.youtube.com/watch?v=g_tea8ZNk5A', 20, 'Fácil', 3, 'Patricia Ruiz', 'Todos los días 8:00 PM', 15, 0, 'EX-ESTIR-009', NOW()),

-- Functional Training exercises
('Entrenamiento Funcional', 'Ejercicios que imitan movimientos cotidianos. Mejora fuerza, equilibrio y coordinación.', 'https://www.youtube.com/watch?v=4MbJjLVmI5o', 45, 'Intermedio', 4, 'Fernando López', 'Lun/Mié/Vie 5:30 PM', 15, 0, 'EX-FUNC-010', NOW()),
('TRX Suspension', 'Entrenamiento en suspensión con TRX. Trabaja todo el cuerpo usando tu propio peso corporal.', 'https://www.youtube.com/watch?v=VeqccPBJsZg', 50, 'Intermedio', 4, 'Ana Martínez', 'Mar/Jue 7:00 AM', 12, 0, 'EX-TRX-011', NOW()),
('Core y Abdominales', 'Fortalecimiento del núcleo con ejercicios variados. Mejora estabilidad y postura.', 'https://www.youtube.com/watch?v=DHD1-2P94DI', 30, 'Intermedio', 4, 'Miguel Santos', 'Lun a Vie 12:00 PM', 20, 0, 'EX-CORE-012', NOW()),

-- Boxing/Combat exercises
('Boxeo Fitness', 'Entrenamiento de boxeo para fitness. Combina técnica de golpeo con acondicionamiento físico.', 'https://www.youtube.com/watch?v=a_1A13PlFGI', 55, 'Intermedio', 5, 'José Herrera', 'Mar/Jue/Sáb 6:00 PM', 16, 0, 'EX-BOX-013', NOW()),
('Kickboxing', 'Artes marciales mixtas para fitness. Combina puñetazos y patadas con cardio intenso.', 'https://www.youtube.com/watch?v=K0Si9YWQdz8', 60, 'Difícil', 5, 'Carolina Rivas', 'Lun/Mié/Vie 7:00 PM', 15, 0, 'EX-KICK-014', NOW()),

-- Pilates exercises
('Pilates Mat', 'Pilates en colchoneta enfocado en control, respiración y movimientos precisos.', 'https://www.youtube.com/watch?v=K56Z12XNQ2s', 30, 'Fácil', 6, 'Gabriela Castro', 'Mar/Jue 10:00 AM', 18, 0, 'EX-PILAT-015', NOW()),
('Pilates Reformer', 'Pilates con máquina reformer. Entrenamiento de resistencia controlada para todo el cuerpo.', 'https://www.youtube.com/watch?v=qQnG-tWdYvc', 45, 'Intermedio', 6, 'Gabriela Castro', 'Lun/Mié/Vie 9:00 AM', 10, 0, 'EX-REFOR-016', NOW()),

-- Swimming/Aqua exercises
('Natación Técnica', 'Mejora tu técnica de nado en los cuatro estilos. Sesión guiada por instructor.', 'https://www.youtube.com/watch?v=rJpkYP4g-9o', 40, 'Intermedio', 7, 'Ricardo Flores', 'Lun/Mié/Vie 6:00 AM', 8, 0, 'EX-SWIM-017', NOW()),
('Aqua Aerobics', 'Aeróbicos en el agua. Ejercicio de bajo impacto ideal para todas las edades.', 'https://www.youtube.com/watch?v=OXLqR6wxoX4', 25, 'Fácil', 7, 'Sofía Morales', 'Mar/Jue 11:00 AM', 15, 0, 'EX-AQUA-018', NOW()),

-- Cycling exercises
('Ciclismo Ruta', 'Salida en bicicleta por rutas externas. Mejora resistencia cardiovascular y disfruta del aire libre.', 'https://www.youtube.com/watch?v=1VYlU_2hzp8', 50, 'Intermedio', 8, 'Alberto Jiménez', 'Sábados 7:00 AM', 12, 0, 'EX-CICLO-019', NOW()),
('Indoor Cycling', 'Clase de ciclismo estacionario con música motivadora. Intervalos de intensidad variable.', 'https://www.youtube.com/watch?v=S5YFCz9eW5k', 45, 'Intermedio', 8, 'Verónica Ortiz', 'Lun a Vier 6:30 AM', 25, 0, 'EX-INDOOR-020', NOW());

-- Note: Make sure categoriaId values match your actual categoria table IDs
-- Example categories:
-- 1 = Cardio
-- 2 = Musculación/Fuerza  
-- 3 = Yoga/Flexibilidad
-- 4 = Entrenamiento Funcional
-- 5 = Boxeo/Combate
-- 6 = Pilates
-- 7 = Natación/Aqua
-- 8 = Ciclismo

-- You can verify categories with: SELECT * FROM categoria;
