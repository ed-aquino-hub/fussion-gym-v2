-- Script para agregar premios variados al sistema
-- Rango de puntos: 50 - 1000

-- Eliminar premios existentes (opcional, comentar si quieres mantener los actuales)
-- DELETE FROM premio;

-- Premios de rango bajo (50-200 pts)
INSERT INTO premio (nombre, descripcion, puntos_necesarios, stock) VALUES
('🍫 Barra de Proteína', 'Barra energética alta en proteínas, perfecta para después del entrenamiento', 50, 100),
('🧴 Shaker FUSSION', 'Shaker oficial de FUSSION GYM con capacidad de 700ml', 100, 50),
('🧢 Gorra FUSSION', 'Gorra deportiva con logo bordado, ajustable', 150, 40),
('🥤 Batido de Proteína', 'Batido de proteína sabor a elección (chocolate, vainilla, fresa)', 150, 80),
('🧖 Toalla Premium', 'Toalla de microfibra absorbente 60x120cm', 180, 30);

-- Premios de rango medio (200-500 pts)
INSERT INTO premio (nombre, descripcion, puntos_necesarios, stock) VALUES
('👕 Camiseta Deportiva', 'Camiseta técnica FUSSION GYM, tallas S-XXL', 250, 60),
('💪 Guantes de Entrenamiento', 'Guantes profesionales para levantamiento de pesas', 300, 25),
('🎧 Audífonos Deportivos', 'Audífonos inalámbricos resistentes al agua', 350, 20),
('🎟️ Clase Personal Gratis', 'Una sesión de entrenamiento personalizado con nuestros coaches', 400, 15),
('🎒 Mochila Deportiva', 'Mochila FUSSION con compartimentos para zapatos y botella', 500, 35);

-- Premios de rango alto (500-1000 pts)
INSERT INTO premio (nombre, descripcion, puntos_necesarios, stock) VALUES
('🧘 Mes de Yoga Gratis', 'Acceso ilimitado a clases de yoga durante 30 días', 600, 10),
('🏆 Plan Nutricional Personalizado', 'Plan de alimentación diseñado por nutricionista certificado', 750, 8),
('🏋️ Mes de Entrenamiento Personal', 'Mes completo con entrenador personal (3 sesiones/semana)', 800, 5),
('💼 Kit Deportivo Completo', 'Set completo: camiseta, short, toalla, shaker y mochila', 900, 12),
('🎁 Membresía Mes Extra', 'Extensión gratuita de membresía por 30 días adicionales', 1000, 20);
