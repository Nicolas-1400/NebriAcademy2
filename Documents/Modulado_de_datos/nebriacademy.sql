-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 12-02-2026 a las 10:11:48
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
(6, 2, 'Luis', 'Fernández Ruiz', '87654321B', 'luis.fernandez@example.com', 'alumno2025', '4000000000000002', '+34666777888', '{\"linkedin\":\"/in/luisfr\"}', 'España', 'Sevilla'),
(13, 22, 'prueba', 'Proba', '12346', 'pruebaa@alumnos.nebrija.es', 'a', NULL, NULL, NULL, 'España', 'Madrid');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `apuntes`
--

CREATE TABLE `apuntes` (
  `id` int(11) NOT NULL,
  `autor` int(11) NOT NULL,
  `curso` int(11) NOT NULL,
  `nombre` text NOT NULL,
  `archivo` varchar(1000) NOT NULL,
  `descripcion` text DEFAULT NULL,
  `categoria` varchar(100) NOT NULL,
  `valoracion` float DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `apuntes`
--

INSERT INTO `apuntes` (`id`, `autor`, `curso`, `nombre`, `archivo`, `descripcion`, `categoria`, `valoracion`) VALUES
(19, 21, 32, 'Prueba video', '1769770901951.pdf', 'Prueba video', 'Programación', 0),
(20, 21, 33, 'jeje', '1769771262323.pdf', 'jeje', 'BDD', 0),
(21, 21, 34, 'sfsdgs', '1769771360844.pdf', 'sfsdgs', 'Marketing', 0),
(22, 21, 35, 'sgdsgds', '1769771456223.pdf', 'sgdsgds', 'Diseño', 0),
(23, 1, 35, 'Prueba2', '1770284606795.pdf', 'Prueba', 'Diseño', 0),
(24, 21, 35, 'Prueba', '1770566205261.pdf', 'shiufhasbfo', 'Diseño', 0),
(25, 1, 35, 'prueeeeba', '1770653475536.pdf', 'dasdad', 'Diseño', 1),
(26, 21, 35, 'dadha', '1770653505192.pdf', 'dadadadadadada', 'Diseño', 1),
(27, 21, 35, 'otra más ', '1770653680835.txt', 'fdgnjdwkvnkdnv', 'Diseño', 1),
(28, 1, 35, 'pruebaa estudiante', '1770654013086.pdf', 'by8giygiy', 'Diseño', 0),
(29, 21, 35, 'afdaf', '1770801445385.pdf', 'adfasf', 'Diseño', 0),
(30, 21, 35, 'Prueba tarjeta', '1770803749679.jpg', 'sjads', 'Diseño', 0),
(31, 1, 35, 'Prueba tarjeta', '1770803774213.png', 'fadqwrq', 'Diseño', 0),
(32, 1, 35, 'dshuigsg', '1770812314315.docx', 'gfsgdds', 'Diseño', 0),
(33, 1, 35, 'Prueba nombre', 'Red local MV.pdf', 'Hoal', 'Diseño', 0);

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
(1, 1, 19, NULL),
(2, 1, 23, NULL),
(3, 1, 27, 1),
(4, 1, 25, 1),
(5, 1, 26, 1);

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
(1, 2, 1, 'Hola'),
(3, 1, 1, 'Prueba'),
(4, 1, 1, 'Prueba 2');

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
  `descripcion` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `cursos`
--

INSERT INTO `cursos` (`id`, `nombreCurso`, `categoria`, `profesor`, `nivel`, `valoracion`, `descripcion`) VALUES
(1, 'Introducción a Python', 'Programación', 1, 'Intermedio', 4.5, 'Curso básico para aprender Python.'),
(2, 'Redes y Seguridad', 'Ciberseguridad', 2, 'Intermedio', 4, 'Curso sobre fundamentos de redes y seguridad informática.'),
(22, 'a', 'BDD', 15, 'Avanzado', 0, 'a'),
(23, 'Prueba', 'Programación', 15, 'Intermedio', 0, 'Prueba'),
(32, 'Prueba video', 'Programacion', 15, 'Intermedio', 1, 'Prueba video'),
(33, 'alo', 'BDD', 15, 'Intermedio', 0, 'ola'),
(34, 'fdsfs', 'Marketing', 15, 'Intermedio', 0, 'sfsdf'),
(35, 'gsgds', 'Diseño', 15, 'Avanzado', 2, 'gsgsg');

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
  `valoración` tinyint(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `cursosalumnos`
--

INSERT INTO `cursosalumnos` (`id`, `cursoId`, `alumnoId`, `favorito`, `apuntado`, `valoración`) VALUES
(13, 1, 1, 1, 1, NULL),
(14, 1, 2, 1, 1, 1),
(16, 35, 1, 1, 1, 1),
(17, 2, 1, 0, 0, NULL),
(18, 34, 1, 1, NULL, NULL),
(23, 35, 2, 1, 1, 1),
(24, 2, 2, NULL, NULL, NULL),
(25, 33, 1, 1, NULL, NULL),
(26, 32, 1, 0, 0, 1);

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
(25, 15, 35, 'bdfbfdb', '1770801717418.pdf', 'dfdfd'),
(26, 15, 35, 'Nombre', '1770802135236.docx', 'Desc'),
(27, 15, 35, 'fewfwe', '1770885815168.jpg', 'fwefewf');

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
(1, 25, 1, '1770887006728-Actividad 2 Power BI.pdf');

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
(14, 20, 'profesor', 'profesor', '1234', 'profesor@profesor.com', '1234', 'jiri32r1', NULL, NULL, 'España', 'Madrid', NULL),
(15, 21, 'a', 'a', 'asa', 'a@a.com', 'a', 'a', 'a', 'a', 'a', 'a', 'a');

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
(24, 1, 1),
(25, 2, 2),
(26, 15, 22),
(27, 15, 23),
(28, 15, 32),
(29, 15, 33),
(30, 15, 34),
(31, 15, 35);

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
(20, 'profesor'),
(21, 'profesor'),
(22, 'alumno');

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
(13, 15, 35, 'prueba', '1769771456245.mp4'),
(15, 15, 35, 'fadsfadsf', '1770801543967.mp4');

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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT de la tabla `apuntes`
--
ALTER TABLE `apuntes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=34;

--
-- AUTO_INCREMENT de la tabla `apuntesalumnos`
--
ALTER TABLE `apuntesalumnos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `comentarioalumnocurso`
--
ALTER TABLE `comentarioalumnocurso`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT de la tabla `cursos`
--
ALTER TABLE `cursos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=36;

--
-- AUTO_INCREMENT de la tabla `cursosalumnos`
--
ALTER TABLE `cursosalumnos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=45;

--
-- AUTO_INCREMENT de la tabla `ejercicios`
--
ALTER TABLE `ejercicios`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=28;

--
-- AUTO_INCREMENT de la tabla `ejerciciosalumnos`
--
ALTER TABLE `ejerciciosalumnos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `incidencias`
--
ALTER TABLE `incidencias`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT de la tabla `profesores`
--
ALTER TABLE `profesores`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT de la tabla `profesorescursos`
--
ALTER TABLE `profesorescursos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=32;

--
-- AUTO_INCREMENT de la tabla `puntuacionesejercicios`
--
ALTER TABLE `puntuacionesejercicios`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- AUTO_INCREMENT de la tabla `videos`
--
ALTER TABLE `videos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

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
-- Filtros para la tabla `apuntesalumnos`
--
ALTER TABLE `apuntesalumnos`
  ADD CONSTRAINT `apuntesalumnos_ibfk_1` FOREIGN KEY (`alumnoId`) REFERENCES `alumnos` (`id`),
  ADD CONSTRAINT `apuntesalumnos_ibfk_2` FOREIGN KEY (`apunteId`) REFERENCES `apuntes` (`id`);

--
-- Filtros para la tabla `comentarioalumnocurso`
--
ALTER TABLE `comentarioalumnocurso`
  ADD CONSTRAINT `comentarioalumnocurso_ibfk_1` FOREIGN KEY (`usuarioId`) REFERENCES `usuarios` (`id`),
  ADD CONSTRAINT `comentarioalumnocurso_ibfk_2` FOREIGN KEY (`cursoId`) REFERENCES `cursos` (`id`);

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
-- Filtros para la tabla `ejerciciosalumnos`
--
ALTER TABLE `ejerciciosalumnos`
  ADD CONSTRAINT `ejerciciosalumnos_ibfk_1` FOREIGN KEY (`ejercicioId`) REFERENCES `ejercicios` (`id`),
  ADD CONSTRAINT `ejerciciosalumnos_ibfk_2` FOREIGN KEY (`alumnoId`) REFERENCES `alumnos` (`id`);

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
  ADD CONSTRAINT `puntuacionesejercicios_ibfk_1` FOREIGN KEY (`ejercicioId`) REFERENCES `ejerciciosalumnos` (`id`),
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
