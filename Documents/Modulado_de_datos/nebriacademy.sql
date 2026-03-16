-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 16-03-2026 a las 13:04:37
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `nebriacademy`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `administradores`
--

CREATE TABLE `administradores` (
  `id` int(11) NOT NULL,
  `usuarioId` int(11) NOT NULL,
  `dni` varchar(20) NOT NULL,
  `nombre` varchar(50) NOT NULL,
  `apellidos` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `contrasena` varchar(255) NOT NULL,
  `numCuentaBancaria` varchar(24) DEFAULT NULL,
  `numTelefono` varchar(30) DEFAULT NULL,
  `redes` varchar(255) DEFAULT NULL,
  `pais` varchar(50) DEFAULT NULL,
  `localidad` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `administradores`
--

INSERT INTO `administradores` (`id`, `usuarioId`, `dni`, `nombre`, `apellidos`, `email`, `contrasena`, `numCuentaBancaria`, `numTelefono`, `redes`, `pais`, `localidad`) VALUES
(1, 14, '00000000Z', 'Admin', 'Principal', 'admin@nebriacademy.com', 'admin123', 'ES1285556289048346478903', '600000000', '@admin', 'España', 'Madrid');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `alumnos`
--

CREATE TABLE `alumnos` (
  `id` int(11) NOT NULL,
  `usuarioId` int(11) NOT NULL,
  `nombre` varchar(50) DEFAULT NULL,
  `apellidos` varchar(100) DEFAULT NULL,
  `dni` varchar(20) DEFAULT NULL,
  `email` varchar(100) NOT NULL,
  `contrasena` varchar(255) NOT NULL,
  `numeroTarjeta` varchar(20) DEFAULT NULL,
  `numTelefono` varchar(30) DEFAULT NULL,
  `redes` text DEFAULT NULL,
  `pais` varchar(50) DEFAULT NULL,
  `localidad` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `alumnos`
--

INSERT INTO `alumnos` (`id`, `usuarioId`, `nombre`, `apellidos`, `dni`, `email`, `contrasena`, `numeroTarjeta`, `numTelefono`, `redes`, `pais`, `localidad`) VALUES
(1, 6, 'Juan', 'Fernández Gómez', '66666666F', 'juan.fernandez@alumnos.nebrija.es', 'alumno123', '4111111111111111', '600666777', '@juan_alum', 'España', 'Madrid'),
(2, 7, 'María', 'Rodríguez Díaz', '77777777G', 'maria.rodriguez@gmail.com', 'alumno456', '4222222222222222', '600777888', '@maria_alum', 'España', 'Sevilla'),
(3, 8, 'Pedro', 'López Torres', '88888888H', 'pedro.lopez@alumnos.nebrija.es', 'alumno789', '4333333333333333', '600888999', '@pedro_alum', 'España', 'Bilbao'),
(4, 9, 'Sofía', 'Gómez Ruiz', '99999999I', 'sofia.gomez@hotmail.com', 'alumno000', '4444444444444444', '600999000', '@sofia_alum', 'España', 'Zaragoza'),
(5, 10, 'David', 'Hernández Martín', '10101010J', 'david.hernandez@alumnos.nebrija.es', 'alumno111', '4555555555555555', '601010101', '@david_alum', 'España', 'Granada'),
(6, 11, 'Lucía', 'Pérez García', '11111112K', 'lucia.perez@outlook.com', 'alumno222', '4666666666666666', '601111112', '@lucia_alum', 'España', 'Valencia'),
(7, 12, 'Pablo', 'González Sánchez', '12121212L', 'pablo.gonzalez@yahoo.com', 'alumno333', '4777777777777777', '601212121', '@pablo_alum', 'España', 'Barcelona'),
(8, 13, 'Carmen', 'Díaz Navarro', '13131313M', 'carmen.diaz@alumnos.nebrija.es', 'alumno444', '4888888888888888', '601313131', '@carmen_alum', 'España', 'Málaga'),
(9, 16, 'Nico', 'Samp', '13672984F', 'nico@example.com', 'pass123', '4888888488888448', '720178890', '@nico_alum', 'Francia', 'Barcelona'),
(11, 19, NULL, NULL, NULL, 'prueba@gmail.com', 'ekHIGG5b', NULL, NULL, NULL, NULL, NULL),
(12, 21, NULL, NULL, NULL, 'pruebaalumneb@alumnos.nebrija.es', 'ithzjixy', NULL, NULL, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `apuntes`
--

CREATE TABLE `apuntes` (
  `id` int(11) NOT NULL,
  `autor` int(11) NOT NULL,
  `curso` int(11) DEFAULT NULL,
  `nombre` text NOT NULL,
  `archivo` varchar(1000) NOT NULL,
  `descripcion` text DEFAULT NULL,
  `categoria` enum('Programación','Diseño','Ciberseguridad','BDD','Marketing') NOT NULL,
  `valoracion` float DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `apuntes`
--

INSERT INTO `apuntes` (`id`, `autor`, `curso`, `nombre`, `archivo`, `descripcion`, `categoria`, `valoracion`) VALUES
(1, 15, 21, 'Fundamentos de las BDD', 'Fundamentos de Bases de Datos.pdf', 'Intruducción a las BDD, \r\nAutor: © Santiago Faci', 'BDD', 1),
(2, 9, 21, 'Prueba alumno', 'Fundamentos de Bases de Datos.pdf', NULL, 'BDD', 0);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `apuntesalumnos`
--

CREATE TABLE `apuntesalumnos` (
  `id` int(11) NOT NULL,
  `alumnoId` int(11) NOT NULL,
  `apunteId` int(11) NOT NULL,
  `megusta` tinyint(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `apuntesalumnos`
--

INSERT INTO `apuntesalumnos` (`id`, `alumnoId`, `apunteId`, `megusta`) VALUES
(1, 9, 1, 1),
(2, 6, 1, NULL),
(3, 6, 2, NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `comentarioalumnocurso`
--

CREATE TABLE `comentarioalumnocurso` (
  `id` int(11) NOT NULL,
  `usuarioId` int(11) NOT NULL,
  `cursoId` int(11) NOT NULL,
  `comentario` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `comentarioalumnocurso`
--

INSERT INTO `comentarioalumnocurso` (`id`, `usuarioId`, `cursoId`, `comentario`) VALUES
(1, 6, 1, 'Excelente curso, muy bien explicado.'),
(2, 7, 1, 'Me está ayudando mucho a aprender Python.'),
(3, 8, 4, 'Buen contenido sobre SQL.'),
(4, 9, 6, 'Interesante introducción a la ciberseguridad.'),
(5, 10, 12, 'Muy útil para mi negocio.'),
(6, 11, 15, 'JavaScript explicado de forma clara.'),
(7, 12, 16, 'Perfecto para empezar con React.'),
(8, 13, 20, 'Diseño responsive muy práctico.'),
(9, 9, 21, 'El vídeo se nota que es IA, no cuela. 😡');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `cursos`
--

CREATE TABLE `cursos` (
  `id` int(11) NOT NULL,
  `nombreCurso` varchar(255) DEFAULT NULL,
  `categoria` enum('Programación','Diseño','Ciberseguridad','BDD','Marketing') DEFAULT NULL,
  `profesor` int(11) DEFAULT NULL,
  `nivel` varchar(255) DEFAULT NULL,
  `valoracion` float DEFAULT NULL,
  `descripcion` text DEFAULT NULL,
  `imagen` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `cursos`
--

INSERT INTO `cursos` (`id`, `nombreCurso`, `categoria`, `profesor`, `nivel`, `valoracion`, `descripcion`, `imagen`) VALUES
(1, 'Python desde Cero', 'Programación', 1, 'Principiante', 0, 'Aprende Python desde cero. Curso ideal para iniciarse en la programación.', 'Foto1'),
(2, 'Python Avanzado', 'Programación', 1, 'Avanzado', 0, 'Programación avanzada con Python: decoradores, generadores y patrones de diseño.', 'Foto2'),
(3, 'Diseño Web con HTML/CSS', 'Diseño', 4, 'Intermedio', 0, 'Crea sitios web modernos con HTML5 y CSS3.', 'Foto3'),
(4, 'SQL y Bases de Datos', 'BDD', 2, 'Intermedio', 0, 'Domina SQL y gestiona bases de datos relacionales con MySQL y PostgreSQL.', 'Foto4'),
(5, 'Diseño de Bases de Datos', 'BDD', 2, 'Avanzado', 0, 'Modelado de datos, normalización y optimización de bases de datos.', 'Foto5'),
(6, 'Fundamentos de Ciberseguridad', 'Ciberseguridad', 3, 'Principiante', 0, 'Introducción a los conceptos básicos de seguridad informática.', 'Foto6'),
(7, 'Seguridad en Redes', 'Ciberseguridad', 3, 'Intermedio', 0, 'Protección de redes, firewalls y análisis de vulnerabilidades.', 'Foto7'),
(8, 'Machine Learning con Python', 'Programación', 1, 'Avanzado', 0, 'Aprende machine learning usando librerías como scikit-learn y TensorFlow.', 'Foto8'),
(9, 'NoSQL y MongoDB', 'BDD', 2, 'Intermedio', 0, 'Bases de datos NoSQL y MongoDB para aplicaciones modernas.', 'Foto9'),
(10, 'Ethical Hacking', 'Ciberseguridad', 3, 'Avanzado', 0, 'Técnicas de hacking ético para auditorías de seguridad.', 'Foto10'),
(11, 'Diseño Gráfico con Figma', 'Diseño', 4, 'Intermedio', 0, 'Aprende a crear interfaces y diseños profesionales con Figma.', 'Foto1'),
(12, 'Marketing Digital', 'Marketing', 5, 'Principiante', 0, 'Estrategias de marketing digital para redes sociales y SEO.', 'Foto2'),
(13, 'SEO Avanzado', 'Marketing', 5, 'Avanzado', 0, 'Optimización de motores de búsqueda para posicionar tu sitio web.', 'Foto3'),
(14, 'Diseño UI/UX', 'Diseño', 4, 'Avanzado', 0, 'Principios de experiencia de usuario y diseño de interfaces.', 'Foto4'),
(15, 'JavaScript Moderno', 'Programación', 1, 'Intermedio', 0, 'Aprende ES6+ y las últimas características de JavaScript.', 'Foto5'),
(16, 'React para Principiantes', 'Diseño', 4, 'Principiante', 0, 'Introducción al desarrollo de interfaces con React.js.', 'Foto6'),
(17, 'Análisis de Datos con SQL', 'BDD', 2, 'Avanzado', 0, 'Técnicas avanzadas de análisis y visualización de datos con SQL.', 'Foto7'),
(18, 'Protección de Datos GDPR', 'Ciberseguridad', 3, 'Intermedio', 0, 'Cumplimiento del Reglamento General de Protección de Datos.', 'Foto8'),
(19, 'Email Marketing', 'Marketing', 5, 'Intermedio', 0, 'Campañas efectivas de email marketing y automatización.', 'Foto9'),
(20, 'Diseño Responsive', 'Diseño', 4, 'Intermedio', 0, 'Crea diseños web adaptables a todos los dispositivos.', 'Foto10'),
(21, 'Iniciación a las BDD', 'BDD', 6, 'Básico', 1, 'Aquí aprendereis los principios básicos de las bases de datos ', 'Foto1'),
(24, 'Prueba', 'Ciberseguridad', 6, 'Intermedio', 0, 'Hola', 'Foto6');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `cursosalumnos`
--

CREATE TABLE `cursosalumnos` (
  `id` int(11) NOT NULL,
  `cursoId` int(11) NOT NULL,
  `alumnoId` int(11) NOT NULL,
  `favorito` tinyint(1) DEFAULT NULL,
  `apuntado` tinyint(1) DEFAULT NULL,
  `valoracion` tinyint(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `cursosalumnos`
--

INSERT INTO `cursosalumnos` (`id`, `cursoId`, `alumnoId`, `favorito`, `apuntado`, `valoracion`) VALUES
(1, 1, 1, 1, 1, NULL),
(2, 1, 2, 1, 1, NULL),
(3, 2, 1, 0, 1, NULL),
(4, 3, 3, 1, 1, NULL),
(5, 4, 3, 1, 1, NULL),
(6, 4, 4, 1, 1, NULL),
(7, 5, 5, 0, 1, NULL),
(8, 6, 2, 1, 1, NULL),
(9, 6, 3, 1, 1, NULL),
(10, 7, 4, 0, 1, NULL),
(11, 8, 1, 1, 1, NULL),
(12, 9, 5, 1, 1, NULL),
(13, 10, 2, 0, 1, NULL),
(14, 11, 4, 1, 1, NULL),
(15, 12, 5, 1, 1, NULL),
(16, 13, 3, 0, 1, NULL),
(17, 14, 1, 1, 1, NULL),
(18, 15, 6, 1, 1, NULL),
(19, 16, 7, 1, 1, NULL),
(20, 17, 8, 0, 1, NULL),
(21, 18, 6, 1, 1, NULL),
(22, 19, 7, 1, 1, NULL),
(23, 20, 8, 1, 1, NULL),
(24, 3, 6, 1, 1, NULL),
(25, 12, 8, 0, 1, NULL),
(26, 20, 1, 0, 0, 1),
(27, 21, 9, 0, 1, 1),
(28, 20, 9, 1, 1, 0),
(29, 24, 9, 0, 0, NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `ejercicios`
--

CREATE TABLE `ejercicios` (
  `id` int(11) NOT NULL,
  `autor` int(11) NOT NULL,
  `curso` int(11) NOT NULL,
  `nombre` text NOT NULL,
  `archivo` varchar(1000) NOT NULL,
  `descripcion` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `ejercicios`
--

INSERT INTO `ejercicios` (`id`, `autor`, `curso`, `nombre`, `archivo`, `descripcion`) VALUES
(1, 6, 21, 'Ejercicio_0', 'Actividad_0_a.pdf', 'Ejercicio para que useis lo aprendido en el curso');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `ejerciciosalumnos`
--

CREATE TABLE `ejerciciosalumnos` (
  `id` int(11) NOT NULL,
  `ejercicioId` int(11) NOT NULL,
  `alumnoId` int(11) NOT NULL,
  `archivo` varchar(1000) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `ejerciciosalumnos`
--

INSERT INTO `ejerciciosalumnos` (`id`, `ejercicioId`, `alumnoId`, `archivo`) VALUES
(1, 1, 9, 'Actividad 3 - Power BI.pdf');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `profesores`
--

CREATE TABLE `profesores` (
  `id` int(11) NOT NULL,
  `usuarioId` int(11) NOT NULL,
  `nombre` varchar(50) DEFAULT NULL,
  `apellidos` varchar(100) DEFAULT NULL,
  `dni` varchar(20) DEFAULT NULL,
  `email` varchar(100) NOT NULL,
  `contrasena` varchar(255) NOT NULL,
  `numCuentaBancaria` varchar(24) DEFAULT NULL,
  `numTelefono` varchar(30) DEFAULT NULL,
  `redes` text DEFAULT NULL,
  `pais` varchar(50) DEFAULT NULL,
  `localidad` varchar(50) DEFAULT NULL,
  `especializacion` enum('Programación','Diseño','Ciberseguridad','BDD','Marketing') DEFAULT NULL,
  `imagenPerfil` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `profesores`
--

INSERT INTO `profesores` (`id`, `usuarioId`, `nombre`, `apellidos`, `dni`, `email`, `contrasena`, `numCuentaBancaria`, `numTelefono`, `redes`, `pais`, `localidad`, `especializacion`, `imagenPerfil`) VALUES
(1, 1, 'Ana', 'García López', '11111111A', 'ana.garcia@nebriacademy.com', 'prof123', 'ES1234567890123456789012', '600111222', '@ana_prof', 'España', 'Madrid', 'Programación', NULL),
(2, 2, 'Carlos', 'Martínez Ruiz', '22222222B', 'carlos.martinez@profesores.nebrija.es', 'prof456', 'ES2345678901234567890123', '600222333', '@carlos_prof', 'España', 'Barcelona', 'BDD', NULL),
(3, 3, 'Laura', 'Sánchez Pérez', '33333333C', 'laura.sanchez@gmail.com', 'prof789', 'ES3456789012345678901234', '600333444', '@laura_prof', 'España', 'Valencia', 'Ciberseguridad', NULL),
(4, 4, 'Miguel', 'Rodríguez Gómez', '44444444D', 'miguel.rodriguez@outlook.com', 'prof000', 'ES4567890123456789012345', '600444555', '@miguel_prof', 'España', 'Sevilla', 'Diseño', NULL),
(5, 5, 'Elena', 'Fernández Torres', '55555555E', 'elena.fernandez@yahoo.com', 'prof111', 'ES5678901234567890123456', '600555666', '@elena_prof', 'España', 'Bilbao', 'Marketing', NULL),
(6, 15, 'Arturo', 'Arturez', '66666666F', 'a@a.com', 'a', 'ES5678911134562390133446', '', '', 'España', 'Madrid', 'Programación', 'hombre-7'),
(9, 20, NULL, NULL, NULL, 'pruebaprof@gmail.com', 'wEWXt5gF', NULL, NULL, NULL, NULL, NULL, '', NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `profesorescursos`
--

CREATE TABLE `profesorescursos` (
  `id` int(11) NOT NULL,
  `profesorId` int(11) NOT NULL,
  `cursoId` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `profesorescursos`
--

INSERT INTO `profesorescursos` (`id`, `profesorId`, `cursoId`) VALUES
(1, 1, 1),
(2, 1, 2),
(3, 1, 8),
(4, 1, 15),
(5, 2, 4),
(6, 2, 5),
(7, 2, 9),
(8, 2, 17),
(9, 3, 6),
(10, 3, 7),
(11, 3, 10),
(12, 3, 18),
(13, 4, 3),
(14, 4, 11),
(15, 4, 14),
(16, 4, 16),
(17, 4, 20),
(18, 5, 12),
(19, 5, 13),
(20, 5, 19),
(21, 6, 21),
(24, 6, 24);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `puntuacionesejercicios`
--

CREATE TABLE `puntuacionesejercicios` (
  `id` int(11) NOT NULL,
  `ejercicioId` int(11) NOT NULL,
  `alumnoId` int(11) NOT NULL,
  `puntuacion` float DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `puntuacionesejercicios`
--

INSERT INTO `puntuacionesejercicios` (`id`, `ejercicioId`, `alumnoId`, `puntuacion`) VALUES
(1, 1, 9, 6);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `id` int(11) NOT NULL,
  `tipo` enum('alumno','profesor','administrador') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`id`, `tipo`) VALUES
(1, 'profesor'),
(2, 'profesor'),
(3, 'profesor'),
(4, 'profesor'),
(5, 'profesor'),
(6, 'alumno'),
(7, 'alumno'),
(8, 'alumno'),
(9, 'alumno'),
(10, 'alumno'),
(11, 'alumno'),
(12, 'alumno'),
(13, 'alumno'),
(14, 'administrador'),
(15, 'profesor'),
(16, 'alumno'),
(19, 'alumno'),
(20, 'profesor'),
(21, 'alumno');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `videos`
--

CREATE TABLE `videos` (
  `id` int(11) NOT NULL,
  `autor` int(11) NOT NULL,
  `curso` int(11) NOT NULL,
  `nombre` varchar(1000) NOT NULL,
  `archivo` varchar(1000) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `videos`
--

INSERT INTO `videos` (`id`, `autor`, `curso`, `nombre`, `archivo`) VALUES
(1, 6, 21, 'Presentación del curso', 'PixVerse_V5.6_Image_Text_720P_Un_profesor_dand.mp4');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `administradores`
--
ALTER TABLE `administradores`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `dni` (`dni`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `usuarioId` (`usuarioId`);

--
-- Indices de la tabla `alumnos`
--
ALTER TABLE `alumnos`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `dni` (`dni`),
  ADD UNIQUE KEY `numeroTarjeta` (`numeroTarjeta`),
  ADD KEY `usuarioId` (`usuarioId`);

--
-- Indices de la tabla `apuntes`
--
ALTER TABLE `apuntes`
  ADD PRIMARY KEY (`id`),
  ADD KEY `autor` (`autor`),
  ADD KEY `curso` (`curso`);

--
-- Indices de la tabla `apuntesalumnos`
--
ALTER TABLE `apuntesalumnos`
  ADD PRIMARY KEY (`id`),
  ADD KEY `alumnoId` (`alumnoId`),
  ADD KEY `apunteId` (`apunteId`);

--
-- Indices de la tabla `comentarioalumnocurso`
--
ALTER TABLE `comentarioalumnocurso`
  ADD PRIMARY KEY (`id`),
  ADD KEY `usuarioId` (`usuarioId`),
  ADD KEY `cursoId` (`cursoId`);

--
-- Indices de la tabla `cursos`
--
ALTER TABLE `cursos`
  ADD PRIMARY KEY (`id`),
  ADD KEY `profesor` (`profesor`);

--
-- Indices de la tabla `cursosalumnos`
--
ALTER TABLE `cursosalumnos`
  ADD PRIMARY KEY (`id`),
  ADD KEY `cursoId` (`cursoId`),
  ADD KEY `alumnoId` (`alumnoId`);

--
-- Indices de la tabla `ejercicios`
--
ALTER TABLE `ejercicios`
  ADD PRIMARY KEY (`id`),
  ADD KEY `autor` (`autor`),
  ADD KEY `curso` (`curso`);

--
-- Indices de la tabla `ejerciciosalumnos`
--
ALTER TABLE `ejerciciosalumnos`
  ADD PRIMARY KEY (`id`),
  ADD KEY `ejercicioId` (`ejercicioId`),
  ADD KEY `alumnoId` (`alumnoId`);

--
-- Indices de la tabla `profesores`
--
ALTER TABLE `profesores`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `dni` (`dni`),
  ADD UNIQUE KEY `numCuentaBancaria` (`numCuentaBancaria`),
  ADD KEY `usuarioId` (`usuarioId`);

--
-- Indices de la tabla `profesorescursos`
--
ALTER TABLE `profesorescursos`
  ADD PRIMARY KEY (`id`),
  ADD KEY `profesorId` (`profesorId`),
  ADD KEY `cursoId` (`cursoId`);

--
-- Indices de la tabla `puntuacionesejercicios`
--
ALTER TABLE `puntuacionesejercicios`
  ADD PRIMARY KEY (`id`),
  ADD KEY `ejercicioId` (`ejercicioId`),
  ADD KEY `alumnoId` (`alumnoId`);

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `videos`
--
ALTER TABLE `videos`
  ADD PRIMARY KEY (`id`),
  ADD KEY `autor` (`autor`),
  ADD KEY `curso` (`curso`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `administradores`
--
ALTER TABLE `administradores`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `alumnos`
--
ALTER TABLE `alumnos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT de la tabla `apuntes`
--
ALTER TABLE `apuntes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `apuntesalumnos`
--
ALTER TABLE `apuntesalumnos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `comentarioalumnocurso`
--
ALTER TABLE `comentarioalumnocurso`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT de la tabla `cursos`
--
ALTER TABLE `cursos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=29;

--
-- AUTO_INCREMENT de la tabla `cursosalumnos`
--
ALTER TABLE `cursosalumnos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=30;

--
-- AUTO_INCREMENT de la tabla `ejercicios`
--
ALTER TABLE `ejercicios`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `ejerciciosalumnos`
--
ALTER TABLE `ejerciciosalumnos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `profesores`
--
ALTER TABLE `profesores`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT de la tabla `profesorescursos`
--
ALTER TABLE `profesorescursos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=29;

--
-- AUTO_INCREMENT de la tabla `puntuacionesejercicios`
--
ALTER TABLE `puntuacionesejercicios`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- AUTO_INCREMENT de la tabla `videos`
--
ALTER TABLE `videos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `administradores`
--
ALTER TABLE `administradores`
  ADD CONSTRAINT `administradores_ibfk_1` FOREIGN KEY (`usuarioId`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `alumnos`
--
ALTER TABLE `alumnos`
  ADD CONSTRAINT `alumnos_ibfk_1` FOREIGN KEY (`usuarioId`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `apuntes`
--
ALTER TABLE `apuntes`
  ADD CONSTRAINT `apuntes_ibfk_1` FOREIGN KEY (`autor`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `apuntes_ibfk_2` FOREIGN KEY (`curso`) REFERENCES `cursos` (`id`) ON DELETE SET NULL;

--
-- Filtros para la tabla `apuntesalumnos`
--
ALTER TABLE `apuntesalumnos`
  ADD CONSTRAINT `apuntesalumnos_ibfk_1` FOREIGN KEY (`alumnoId`) REFERENCES `alumnos` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `apuntesalumnos_ibfk_2` FOREIGN KEY (`apunteId`) REFERENCES `apuntes` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `comentarioalumnocurso`
--
ALTER TABLE `comentarioalumnocurso`
  ADD CONSTRAINT `comentarioalumnocurso_ibfk_1` FOREIGN KEY (`usuarioId`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `comentarioalumnocurso_ibfk_2` FOREIGN KEY (`cursoId`) REFERENCES `cursos` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `cursos`
--
ALTER TABLE `cursos`
  ADD CONSTRAINT `cursos_ibfk_1` FOREIGN KEY (`profesor`) REFERENCES `profesores` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `cursosalumnos`
--
ALTER TABLE `cursosalumnos`
  ADD CONSTRAINT `cursosalumnos_ibfk_1` FOREIGN KEY (`cursoId`) REFERENCES `cursos` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `cursosalumnos_ibfk_2` FOREIGN KEY (`alumnoId`) REFERENCES `alumnos` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `ejercicios`
--
ALTER TABLE `ejercicios`
  ADD CONSTRAINT `ejercicios_ibfk_1` FOREIGN KEY (`autor`) REFERENCES `profesores` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `ejercicios_ibfk_2` FOREIGN KEY (`curso`) REFERENCES `cursos` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `ejerciciosalumnos`
--
ALTER TABLE `ejerciciosalumnos`
  ADD CONSTRAINT `ejerciciosalumnos_ibfk_1` FOREIGN KEY (`ejercicioId`) REFERENCES `ejercicios` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `ejerciciosalumnos_ibfk_2` FOREIGN KEY (`alumnoId`) REFERENCES `alumnos` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `profesores`
--
ALTER TABLE `profesores`
  ADD CONSTRAINT `profesores_ibfk_1` FOREIGN KEY (`usuarioId`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `profesorescursos`
--
ALTER TABLE `profesorescursos`
  ADD CONSTRAINT `profesorescursos_ibfk_1` FOREIGN KEY (`profesorId`) REFERENCES `profesores` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `profesorescursos_ibfk_2` FOREIGN KEY (`cursoId`) REFERENCES `cursos` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `puntuacionesejercicios`
--
ALTER TABLE `puntuacionesejercicios`
  ADD CONSTRAINT `puntuacionesejercicios_ibfk_1` FOREIGN KEY (`ejercicioId`) REFERENCES `ejerciciosalumnos` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `puntuacionesejercicios_ibfk_2` FOREIGN KEY (`alumnoId`) REFERENCES `alumnos` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `videos`
--
ALTER TABLE `videos`
  ADD CONSTRAINT `videos_ibfk_1` FOREIGN KEY (`autor`) REFERENCES `profesores` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `videos_ibfk_2` FOREIGN KEY (`curso`) REFERENCES `cursos` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
