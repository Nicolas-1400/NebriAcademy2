-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 26-01-2026 a las 09:38:00
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
  `numTelefono` varchar(30) DEFAULT NULL,
  `redes` varchar(255) DEFAULT NULL,
  `pais` varchar(50) DEFAULT NULL,
  `localidad` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `administradores`
--

INSERT INTO `administradores` (`id`, `usuarioId`, `dni`, `nombre`, `apellidos`, `email`, `contrasena`, `numTelefono`, `redes`, `pais`, `localidad`) VALUES
(1, 1, '00000000A', 'Carlos', 'Ramírez López', 'admin@nebriacademy.com', 'admin123', '600000000', '@adminCarlos', 'España', 'Madrid'),
(5, 1, '12345678A', 'María', 'García Pérez', 'maria.garcia@example.com', 'pass1234', '+34600111222', 'twitter:@mgarcia', 'España', 'Madrid');

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
  `contrasena` varchar(255) DEFAULT NULL,
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
(1, 2, 'Nicolás', 'García-Sampedro', '12345678B', 'nico@example.com', 'pass123', '123', '432512', '', 'España', 'Madrid'),
(2, 3, 'María', 'López Díaz', '87654321C', 'maria@example.com', 'pass456', '4222222222222222', '622222222', '@marialopez', 'España', 'Valencia'),
(6, 2, 'Luis', 'Fernández Ruiz', '87654321B', 'luis.fernandez@example.com', 'alumno2025', '4000000000000002', '+34666777888', '{\"linkedin\":\"/in/luisfr\"}', 'España', 'Sevilla');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `apuntes`
--

CREATE TABLE `apuntes` (
  `id` int(11) NOT NULL,
  `autor` int(11) NOT NULL,
  `curso` int(11) NOT NULL,
  `contenido` text DEFAULT NULL,
  `valoracion` float DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `apuntes`
--

INSERT INTO `apuntes` (`id`, `autor`, `curso`, `contenido`, `valoracion`) VALUES
(1, 2, 1, 'Resumen de funciones en Python', 5),
(2, 4, 1, 'Apunte del profesor sobre listas y tuplas', 4),
(3, 3, 2, 'Notas sobre firewall y seguridad básica', 5),
(6, 2, 1, 'Resumen de la lección 1: fundamentos de Node.js', 4),
(7, 2, 1, 'Resumen de la lección 1: fundamentos de Node.js', 4),
(8, 2, 1, 'Resumen de la lección 1: fundamentos de Node.js', 4),
(10, 2, 1, 'Resumen de la lección 1: fundamentos de Node.js', 4);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `cursos`
--

CREATE TABLE `cursos` (
  `id` int(11) NOT NULL,
  `nombreCurso` varchar(100) NOT NULL,
  `categoria` varchar(100) DEFAULT NULL,
  `profesor` int(11) NOT NULL,
  `nivel` varchar(50) DEFAULT NULL,
  `valoracion` float DEFAULT 0,
  `comentarios` text DEFAULT NULL,
  `descripcion` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `cursos`
--

INSERT INTO `cursos` (`id`, `nombreCurso`, `categoria`, `profesor`, `nivel`, `valoracion`, `comentarios`, `descripcion`) VALUES
(1, 'Introducción a Python', 'Programación', 1, 'Principiante', 4.5, 'Muy buen curso', 'Curso básico para aprender Python.'),
(2, 'Redes y Seguridad', 'Ciberseguridad', 2, 'Intermedio', 4, 'Contenido útil', 'Curso sobre fundamentos de redes y seguridad informática.');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `cursosalumnos`
--

CREATE TABLE `cursosalumnos` (
  `id` int(11) NOT NULL,
  `cursoId` int(11) NOT NULL,
  `alumnoId` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `cursosalumnos`
--

INSERT INTO `cursosalumnos` (`id`, `cursoId`, `alumnoId`) VALUES
(13, 1, 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `ejercicios`
--

CREATE TABLE `ejercicios` (
  `id` int(11) NOT NULL,
  `autor` int(11) NOT NULL,
  `curso` int(11) NOT NULL,
  `valoracion` float DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `ejercicios`
--

INSERT INTO `ejercicios` (`id`, `autor`, `curso`, `valoracion`) VALUES
(1, 1, 1, 4.5),
(2, 2, 2, 4);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `incidencias`
--

CREATE TABLE `incidencias` (
  `id` int(11) NOT NULL,
  `tipo` varchar(50) NOT NULL,
  `descripcion` text DEFAULT NULL,
  `resuelto` tinyint(1) DEFAULT 0,
  `usuario` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `incidencias`
--

INSERT INTO `incidencias` (`id`, `tipo`, `descripcion`, `resuelto`, `usuario`) VALUES
(1, 'Error en plataforma', 'No carga el vídeo del módulo 2', 0, 2),
(2, 'Pago', 'Problema al registrar tarjeta', 1, 3),
(3, 'Sugerencia', 'Añadir más ejercicios prácticos', 0, 4),
(6, 'bug', 'No se puede acceder al curso 1 mediante la API', 0, 2),
(7, 'bug', 'No se puede acceder al curso 1 mediante la API', 0, 2),
(8, 'bug', 'No se puede acceder al curso 1 mediante la API', 0, 2),
(10, 'bug', 'No se puede acceder al curso 1 mediante la API', 0, 2);

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
  `contrasena` varchar(255) DEFAULT NULL,
  `numCuentaBancaria` varchar(50) DEFAULT NULL,
  `numTelefono` varchar(30) DEFAULT NULL,
  `redes` text DEFAULT NULL,
  `pais` varchar(50) DEFAULT NULL,
  `localidad` varchar(50) DEFAULT NULL,
  `especializacion` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `profesores`
--

INSERT INTO `profesores` (`id`, `usuarioId`, `nombre`, `apellidos`, `dni`, `email`, `contrasena`, `numCuentaBancaria`, `numTelefono`, `redes`, `pais`, `localidad`, `especializacion`) VALUES
(1, 4, 'Sofía', 'Martínez Ruiz', '11111111D', 'sofia@prof.com', 'prof123', 'ES9820385778983000760236', '633333333', '@profeSofia', 'España', 'Barcelona', 'Programación'),
(2, 5, 'Jorge', 'Pérez Torres', '22222222E', 'jorge@prof.com', 'prof456', 'ES6600190020961234567890', '644444444', '@profeJorge', 'España', 'Madrid', 'Ciberseguridad'),
(6, 3, 'Ana', 'López García', '23456789C', 'ana.lopez@example.com', 'prof!2025', 'ES7620770024003102575766', '+34900111233', '{\"twitter\":\"@analopez\"}', 'España', 'Barcelona', 'Programación Web'),
(13, 19, 'Hola', 'afafa', 'f32rf', 'elo@alo.com', 'pass123', NULL, NULL, NULL, 'eqwrq', 'rqrqr', NULL),
(14, 20, 'profesor', 'profesor', '1234', 'profesor@profesor.com', '1234', 'jiri32r1', NULL, NULL, 'España', 'Madrid', NULL);

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
(10, 1, 1);

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
(1, 1, 1, 9.5),
(2, 1, 2, 8),
(3, 2, 1, 7.5),
(6, 1, 2, 9.5),
(7, 1, 2, 9.5),
(8, 1, 2, 9.5),
(10, 1, 2, 9.5);

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
(1, 'administrador'),
(2, 'alumno'),
(3, 'alumno'),
(4, 'profesor'),
(5, 'profesor'),
(9, 'alumno'),
(10, 'alumno'),
(11, 'alumno'),
(12, 'alumno'),
(13, 'alumno'),
(18, 'alumno'),
(19, 'profesor'),
(20, 'profesor');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `videos`
--

CREATE TABLE `videos` (
  `id` int(11) NOT NULL,
  `autor` int(11) NOT NULL,
  `curso` int(11) NOT NULL,
  `duracion` int(11) DEFAULT NULL,
  `valoracion` float DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `videos`
--

INSERT INTO `videos` (`id`, `autor`, `curso`, `duracion`, `valoracion`) VALUES
(1, 1, 1, 600, 4.8),
(2, 2, 2, 900, 4.2);

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
-- Indices de la tabla `incidencias`
--
ALTER TABLE `incidencias`
  ADD PRIMARY KEY (`id`),
  ADD KEY `usuario` (`usuario`);

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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT de la tabla `alumnos`
--
ALTER TABLE `alumnos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT de la tabla `apuntes`
--
ALTER TABLE `apuntes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT de la tabla `cursos`
--
ALTER TABLE `cursos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT de la tabla `cursosalumnos`
--
ALTER TABLE `cursosalumnos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT de la tabla `ejercicios`
--
ALTER TABLE `ejercicios`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT de la tabla `incidencias`
--
ALTER TABLE `incidencias`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT de la tabla `profesores`
--
ALTER TABLE `profesores`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT de la tabla `profesorescursos`
--
ALTER TABLE `profesorescursos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT de la tabla `puntuacionesejercicios`
--
ALTER TABLE `puntuacionesejercicios`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT de la tabla `videos`
--
ALTER TABLE `videos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `administradores`
--
ALTER TABLE `administradores`
  ADD CONSTRAINT `administradores_ibfk_1` FOREIGN KEY (`usuarioId`) REFERENCES `usuarios` (`id`);

--
-- Filtros para la tabla `alumnos`
--
ALTER TABLE `alumnos`
  ADD CONSTRAINT `alumnos_ibfk_1` FOREIGN KEY (`usuarioId`) REFERENCES `usuarios` (`id`);

--
-- Filtros para la tabla `apuntes`
--
ALTER TABLE `apuntes`
  ADD CONSTRAINT `apuntes_ibfk_1` FOREIGN KEY (`autor`) REFERENCES `usuarios` (`id`),
  ADD CONSTRAINT `apuntes_ibfk_2` FOREIGN KEY (`curso`) REFERENCES `cursos` (`id`);

--
-- Filtros para la tabla `cursos`
--
ALTER TABLE `cursos`
  ADD CONSTRAINT `cursos_ibfk_1` FOREIGN KEY (`profesor`) REFERENCES `profesores` (`id`);

--
-- Filtros para la tabla `cursosalumnos`
--
ALTER TABLE `cursosalumnos`
  ADD CONSTRAINT `cursosalumnos_ibfk_1` FOREIGN KEY (`cursoId`) REFERENCES `cursos` (`id`),
  ADD CONSTRAINT `cursosalumnos_ibfk_2` FOREIGN KEY (`alumnoId`) REFERENCES `alumnos` (`id`);

--
-- Filtros para la tabla `ejercicios`
--
ALTER TABLE `ejercicios`
  ADD CONSTRAINT `ejercicios_ibfk_1` FOREIGN KEY (`autor`) REFERENCES `profesores` (`id`),
  ADD CONSTRAINT `ejercicios_ibfk_2` FOREIGN KEY (`curso`) REFERENCES `cursos` (`id`);

--
-- Filtros para la tabla `incidencias`
--
ALTER TABLE `incidencias`
  ADD CONSTRAINT `incidencias_ibfk_1` FOREIGN KEY (`usuario`) REFERENCES `usuarios` (`id`);

--
-- Filtros para la tabla `profesores`
--
ALTER TABLE `profesores`
  ADD CONSTRAINT `profesores_ibfk_1` FOREIGN KEY (`usuarioId`) REFERENCES `usuarios` (`id`);

--
-- Filtros para la tabla `profesorescursos`
--
ALTER TABLE `profesorescursos`
  ADD CONSTRAINT `profesorescursos_ibfk_1` FOREIGN KEY (`profesorId`) REFERENCES `profesores` (`id`),
  ADD CONSTRAINT `profesorescursos_ibfk_2` FOREIGN KEY (`cursoId`) REFERENCES `cursos` (`id`);

--
-- Filtros para la tabla `puntuacionesejercicios`
--
ALTER TABLE `puntuacionesejercicios`
  ADD CONSTRAINT `puntuacionesejercicios_ibfk_1` FOREIGN KEY (`ejercicioId`) REFERENCES `ejercicios` (`id`),
  ADD CONSTRAINT `puntuacionesejercicios_ibfk_2` FOREIGN KEY (`alumnoId`) REFERENCES `alumnos` (`id`);

--
-- Filtros para la tabla `videos`
--
ALTER TABLE `videos`
  ADD CONSTRAINT `videos_ibfk_1` FOREIGN KEY (`autor`) REFERENCES `profesores` (`id`),
  ADD CONSTRAINT `videos_ibfk_2` FOREIGN KEY (`curso`) REFERENCES `cursos` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
