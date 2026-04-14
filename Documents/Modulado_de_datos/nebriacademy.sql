-- MySQL dump 10.13  Distrib 8.0.38, for Win64 (x86_64)
--
-- Host: nebriacademy-2-nicolasgarciasampedrodocampo-2d00.i.aivencloud.com    Database: defaultdb
-- ------------------------------------------------------
-- Server version	8.0.45

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `administradores`
--

DROP TABLE IF EXISTS `administradores`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `administradores` (
  `id` int NOT NULL AUTO_INCREMENT,
  `usuarioId` int NOT NULL,
  `dni` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `nombre` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `apellidos` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `email` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `contrasena` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `numCuentaBancaria` varchar(24) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `numTelefono` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `redes` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `pais` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `localidad` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `dni` (`dni`),
  UNIQUE KEY `email` (`email`),
  KEY `usuarioId` (`usuarioId`),
  CONSTRAINT `administradores_ibfk_1` FOREIGN KEY (`usuarioId`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `administradores`
--

LOCK TABLES `administradores` WRITE;
/*!40000 ALTER TABLE `administradores` DISABLE KEYS */;
INSERT INTO `administradores` VALUES (1,14,'00000000Z','Admin','Principal','admin@nebriacademy.com','admin123','ES1285556289048346478903','600000000','@admin','España','Madrid');
/*!40000 ALTER TABLE `administradores` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `alumnos`
--

DROP TABLE IF EXISTS `alumnos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `alumnos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `usuarioId` int NOT NULL,
  `nombre` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `apellidos` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `dni` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `email` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `contrasena` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `numeroTarjeta` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `numTelefono` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `redes` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `pais` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `localidad` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `esVinculado` tinyint(1) DEFAULT '0',
  `profesorVinculadoId` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `dni` (`dni`),
  UNIQUE KEY `numeroTarjeta` (`numeroTarjeta`),
  KEY `usuarioId` (`usuarioId`),
  KEY `profesorVinculadoId` (`profesorVinculadoId`),
  CONSTRAINT `alumnos_ibfk_1` FOREIGN KEY (`usuarioId`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE,
  CONSTRAINT `alumnos_ibfk_2` FOREIGN KEY (`profesorVinculadoId`) REFERENCES `profesores` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=34 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `alumnos`
--

LOCK TABLES `alumnos` WRITE;
/*!40000 ALTER TABLE `alumnos` DISABLE KEYS */;
INSERT INTO `alumnos` VALUES (1,6,'Juan','Fernández Gómez','66666666F','juan.fernandez@alumnos.nebrija.es','alumno123','4111111111111111','600666777','@juan_alum','España','Madrid',0,NULL),(2,7,'María','Rodríguez Díaz','77777777G','maria.rodriguez@gmail.com','alumno456','4222222222222222','600777888','@maria_alum','España','Sevilla',0,NULL),(3,8,'Pedro','López Torres','88888888H','pedro.lopez@alumnos.nebrija.es','alumno789','4333333333333333','600888999','@pedro_alum','España','Bilbao',0,NULL),(4,9,'Sofía','Gómez Ruiz','99999999I','sofia.gomez@hotmail.com','alumno000','4444444444444444','600999000','@sofia_alum','España','Zaragoza',0,NULL),(5,10,'David','Hernández Martín','10101010J','david.hernandez@alumnos.nebrija.es','alumno111','4555555555555555','601010101','@david_alum','España','Granada',0,NULL),(6,11,'Lucía','Pérez García','11111112K','lucia.perez@outlook.com','alumno222','4666666666666666','601111112','@lucia_alum','España','Valencia',0,NULL),(7,12,'Pablo','González Sánchez','12121212L','pablo.gonzalez@yahoo.com','alumno333','4777777777777777','601212121','@pablo_alum','España','Barcelona',0,NULL),(8,13,'Carmen','Díaz Navarro','13131313M','carmen.diaz@alumnos.nebrija.es','alumno444','4888888888888888','601313131','@carmen_alum','España','Málaga',0,NULL),(9,16,'Nico','Samp','13672984F','nico@example.com','pass123','4888888488888448','720178890','@nico_alum','Francia','Barcelona',0,NULL),(13,22,'Ana','García López','11111111A',NULL,NULL,NULL,'600111222','@ana_prof','España','Madrid',1,1),(14,23,'Carlos','Martínez Ruiz','22222222B',NULL,NULL,NULL,'600222333','@carlos_prof','España','Barcelona',1,2),(15,24,'Laura','Sánchez Pérez','33333333C',NULL,NULL,NULL,'600333444','@laura_prof','España','Valencia',1,3),(16,25,'Miguel','Rodríguez Gómez','44444444D',NULL,NULL,NULL,'600444555','@miguel_prof','España','Sevilla',1,4),(17,26,'Elena','Fernández Torres','55555555E',NULL,NULL,NULL,'600555666','@elena_prof','España','Bilbao',1,5),(18,27,'Arturo','Arturez','66666660F',NULL,NULL,NULL,'','','España','Madrid',1,6),(19,28,'Luis','Martínez Soto','20202020L','luis.martinez@alumnos.nebrija.es','alumno555','4999999999999999','601234567','@luis_alum','España','Madrid',0,NULL),(20,29,'Sara','Gómez Navarro','21212121M','sara.gomez@gmail.com','alumno666','5000000000000000','601345678','@sara_alum','España','Sevilla',0,NULL),(21,30,'Miguel','Pérez López','22222223N','miguel.perez@alumnos.nebrija.es','alumno777','5111111111111111','601456789','@miguel_alum','España','Barcelona',0,NULL),(22,31,'Elena','Rodríguez Sánchez','23232323O','elena.rodriguez@hotmail.com','alumno888','5222222222222222','601567890','@elena_alum','España','Valencia',0,NULL),(23,32,'Javier','Fernández Díaz','24242424P','javier.fernandez@alumnos.nebrija.es','alumno999','5333333333333333','601678901','@javier_alum','España','Granada',0,NULL),(24,33,'Laura','Sánchez Ruiz','25252525Q','laura.sanchez@yahoo.com','alumno000','5444444444444444','601789012','@laura_alum','España','Bilbao',0,NULL),(25,34,'Carlos','García Martín','26262626R','carlos.garcia@alumnos.nebrija.es','alumno111','5555555555555555','601890123','@carlos_alum','España','Zaragoza',0,NULL),(26,35,'Isabel','López Torres','27272727S','isabel.lopez@outlook.com','alumno222','5666666666666666','601901234','@isabel_alum','España','Málaga',0,NULL),(27,36,'Pablo','Hernández Gómez','28282828T','pablo.hernandez@alumnos.nebrija.es','alumno333','5777777777777777','602012345','@pablo_alum','España','Madrid',0,NULL),(28,37,'Carmen','Díaz Pérez','29292929U','carmen.diaz@gmail.com','alumno444','5888888888888888','602123456','@carmen_alum','España','Sevilla',0,NULL),(29,38,'Raquel','López Vega','77000001G',NULL,NULL,NULL,'601111223','@raquel_prof','España','Madrid',1,7),(30,39,'Diego','Morales Ruiz','88000002H',NULL,NULL,NULL,'601222334','@diego_prof','España','Barcelona',1,8),(31,40,'Isabel','Torres Martín','99000003I',NULL,NULL,NULL,'601333445','@isabel_prof','España','Valencia',1,NULL),(32,41,'Javier','Ruiz Gómez','10100004J',NULL,NULL,NULL,'601444556','@javier_prof','España','Sevilla',1,NULL),(33,42,'Paula','Navarro Sánchez','11100005K',NULL,NULL,NULL,'601555667','@paula_prof','España','Bilbao',1,NULL);
/*!40000 ALTER TABLE `alumnos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `apuntes`
--

DROP TABLE IF EXISTS `apuntes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `apuntes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `autor` int NOT NULL,
  `curso` int DEFAULT NULL,
  `nombre` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `archivo` varchar(1000) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `descripcion` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `categoria` enum('Programación','BDD','Ciberseguridad','Diseño y UX','Inteligencia Artificial','Marketing','Desarrollo','Data Science') COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'Programación',
  `valoracion` float DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `autor` (`autor`),
  KEY `curso` (`curso`),
  CONSTRAINT `apuntes_ibfk_1` FOREIGN KEY (`autor`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE,
  CONSTRAINT `apuntes_ibfk_2` FOREIGN KEY (`curso`) REFERENCES `cursos` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `apuntes`
--

LOCK TABLES `apuntes` WRITE;
/*!40000 ALTER TABLE `apuntes` DISABLE KEYS */;
INSERT INTO `apuntes` VALUES (1,1,1,'Fundamentos de las BDD','Fundamentos de Bases de Datos.pdf','Introducción a las BDD, \r\nAutor: © Santiago Faci','BDD',1),(2,9,1,'Prueba alumno','Fundamentos de Bases de Datos.pdf',NULL,'BDD',0),(8,1,1,'hola','PROPUESTA UNIFICADA WEB GRADOS ONLINE.pdf','aaa','BDD',0);
/*!40000 ALTER TABLE `apuntes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `apuntesalumnos`
--

DROP TABLE IF EXISTS `apuntesalumnos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `apuntesalumnos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `alumnoId` int NOT NULL,
  `apunteId` int NOT NULL,
  `megusta` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `alumnoId` (`alumnoId`),
  KEY `apunteId` (`apunteId`),
  CONSTRAINT `apuntesalumnos_ibfk_1` FOREIGN KEY (`alumnoId`) REFERENCES `alumnos` (`id`) ON DELETE CASCADE,
  CONSTRAINT `apuntesalumnos_ibfk_2` FOREIGN KEY (`apunteId`) REFERENCES `apuntes` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `apuntesalumnos`
--

LOCK TABLES `apuntesalumnos` WRITE;
/*!40000 ALTER TABLE `apuntesalumnos` DISABLE KEYS */;
INSERT INTO `apuntesalumnos` VALUES (1,9,1,1),(2,6,1,NULL),(3,6,2,NULL),(4,19,1,1),(5,20,1,1),(6,21,2,1),(7,22,8,0),(8,23,1,1),(9,24,2,1),(10,25,1,1),(11,26,2,1),(12,27,8,1);
/*!40000 ALTER TABLE `apuntesalumnos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `comentarioalumnocurso`
--

DROP TABLE IF EXISTS `comentarioalumnocurso`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `comentarioalumnocurso` (
  `id` int NOT NULL AUTO_INCREMENT,
  `usuarioId` int NOT NULL,
  `cursoId` int NOT NULL,
  `comentario` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  PRIMARY KEY (`id`),
  KEY `usuarioId` (`usuarioId`),
  KEY `cursoId` (`cursoId`),
  CONSTRAINT `comentarioalumnocurso_ibfk_1` FOREIGN KEY (`usuarioId`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE,
  CONSTRAINT `comentarioalumnocurso_ibfk_2` FOREIGN KEY (`cursoId`) REFERENCES `cursos` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=40 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `comentarioalumnocurso`
--

LOCK TABLES `comentarioalumnocurso` WRITE;
/*!40000 ALTER TABLE `comentarioalumnocurso` DISABLE KEYS */;
INSERT INTO `comentarioalumnocurso` VALUES (25,6,1,'Excelente curso para empezar desde cero.'),(26,7,1,'Muy bien explicado el profesor, ritmo perfecto.'),(27,8,2,'Me encantó la parte de asincronía y promesas.'),(28,10,4,'SQL nunca fue tan fácil de entender.'),(29,12,7,'Conceptos claros y ejemplos muy prácticos.'),(30,22,10,'Figma es una herramienta increíble, gracias.'),(31,24,13,'Estrategias claras y aplicables a mi negocio.'),(32,26,16,'La IA está de moda y este curso la explica genial.'),(33,28,19,'Base sólida para luego saltar a frameworks.'),(34,30,22,'Data Science es el futuro, buenísimo el contenido.'),(35,9,5,'El modelado de datos cambió mi forma de trabajar.'),(36,11,17,'Machine learning explicado paso a paso, sin rodeos.'),(37,13,20,'SEO práctico y directo al grano. Lo recomiendo.'),(38,15,23,'Pandas imprescindible para análisis de datos.'),(39,17,24,'Spark potente, curso muy completo y actualizado.');
/*!40000 ALTER TABLE `comentarioalumnocurso` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cursos`
--

DROP TABLE IF EXISTS `cursos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cursos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombreCurso` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `categoria` enum('Programación','BDD','Ciberseguridad','Diseño y UX','Inteligencia Artificial','Marketing','Desarrollo','Data Science') COLLATE utf8mb4_general_ci DEFAULT NULL,
  `profesor` int DEFAULT NULL,
  `nivel` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `valoracion` float DEFAULT NULL,
  `descripcion` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `imagen` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `profesor` (`profesor`),
  CONSTRAINT `cursos_ibfk_1` FOREIGN KEY (`profesor`) REFERENCES `profesores` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=59 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cursos`
--

LOCK TABLES `cursos` WRITE;
/*!40000 ALTER TABLE `cursos` DISABLE KEYS */;
INSERT INTO `cursos` VALUES (1,'Python desde Cero','Programación',1,'Básico',0,'Aprende Python desde cero. Curso ideal para iniciarse.','Foto1'),(2,'JavaScript Moderno','Programación',1,'Intermedio',0,'ES6+, asincronía y patrones de diseño.','Foto2'),(3,'Arquitectura de Software','Programación',1,'Avanzado',0,'Microservicios y patrones avanzados.','Foto3'),(4,'SQL Fundamentos','BDD',2,'Básico',0,'Consultas básicas y diseño relacional.','Foto4'),(5,'Modelado de Bases de Datos','BDD',2,'Intermedio',0,'Normalización y diagramas ER avanzados.','Foto5'),(6,'Optimización y Tuning','BDD',2,'Avanzado',0,'Indexación y rendimiento en motores SQL.','Foto6'),(7,'Fundamentos de Ciberseguridad','Ciberseguridad',3,'Básico',0,'Conceptos esenciales de seguridad informática.','Foto7'),(8,'Seguridad en Redes','Ciberseguridad',3,'Intermedio',0,'Firewalls, VPNs y análisis de tráfico.','Foto8'),(9,'Hacking Ético Avanzado','Ciberseguridad',3,'Avanzado',0,'Pentesting profesional y explotación controlada.','Foto9'),(10,'Introducción al Diseño UI','Diseño y UX',4,'Básico',0,'Principios de diseño visual y tipografía.','Foto10'),(11,'Prototipado con Figma','Diseño y UX',4,'Intermedio',0,'Creación de wireframes y prototipos interactivos.','Foto1'),(12,'UX Research Avanzado','Diseño y UX',4,'Avanzado',0,'Tests de usabilidad, métricas y psicología del usuario.','Foto2'),(13,'Marketing Digital Básico','Marketing',5,'Básico',0,'Estrategias online, funnels y redes sociales.','Foto3'),(14,'SEO y SEM Intermedio','Marketing',5,'Intermedio',0,'Posicionamiento orgánico y campañas pagadas.','Foto4'),(15,'Growth Hacking y Analítica','Marketing',5,'Avanzado',0,'Métricas clave, A/B testing y experimentación.','Foto5'),(16,'IA para Principiantes','Inteligencia Artificial',6,'Básico',0,'Conceptos básicos de IA, ML y ética.','Foto6'),(17,'Machine Learning Práctico','Inteligencia Artificial',6,'Intermedio',0,'Scikit-learn, pipelines y evaluación de modelos.','Foto7'),(18,'Deep Learning y Redes Neuronales','Inteligencia Artificial',6,'Avanzado',0,'TensorFlow, CNNs y arquitecturas profundas.','Foto8'),(19,'HTML/CSS/JS Esencial','Desarrollo',7,'Básico',0,'Maquetación web semántica y DOM básico.','Foto9'),(20,'Frameworks Frontend','Desarrollo',7,'Intermedio',0,'React, Vue y herramientas de desarrollo modernas.','Foto10'),(21,'Desarrollo Full Stack MERN','Desarrollo',7,'Avanzado',0,'MongoDB, Express, React y Node.js integrados.','Foto1'),(22,'Introducción a Data Science','Data Science',8,'Básico',0,'Análisis exploratorio y estadística aplicada.','Foto2'),(23,'Análisis con Python y Pandas','Data Science',8,'Intermedio',0,'Manipulación, limpieza y visualización de datos.','Foto3'),(24,'Big Data y Spark','Data Science',8,'Avanzado',0,'Procesamiento distribuido y entornos Hadoop/Spark.','Foto4');
/*!40000 ALTER TABLE `cursos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cursosalumnos`
--

DROP TABLE IF EXISTS `cursosalumnos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cursosalumnos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `cursoId` int NOT NULL,
  `alumnoId` int NOT NULL,
  `favorito` tinyint(1) DEFAULT NULL,
  `apuntado` tinyint(1) DEFAULT NULL,
  `valoracion` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `cursoId` (`cursoId`),
  KEY `alumnoId` (`alumnoId`),
  CONSTRAINT `cursosalumnos_ibfk_1` FOREIGN KEY (`cursoId`) REFERENCES `cursos` (`id`) ON DELETE CASCADE,
  CONSTRAINT `cursosalumnos_ibfk_2` FOREIGN KEY (`alumnoId`) REFERENCES `alumnos` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=231 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cursosalumnos`
--

LOCK TABLES `cursosalumnos` WRITE;
/*!40000 ALTER TABLE `cursosalumnos` DISABLE KEYS */;
INSERT INTO `cursosalumnos` VALUES (182,1,1,1,1,NULL),(183,1,2,0,1,NULL),(184,2,3,1,1,1),(185,2,4,0,1,NULL),(186,3,5,1,1,NULL),(187,3,6,0,1,0),(188,4,7,1,1,NULL),(189,4,8,0,1,NULL),(190,5,9,1,1,1),(191,5,13,0,1,NULL),(192,6,14,1,1,NULL),(193,6,15,0,1,1),(194,7,16,1,1,NULL),(195,7,17,0,1,NULL),(196,8,18,1,1,0),(197,8,19,0,1,NULL),(198,9,20,1,1,NULL),(199,9,21,0,1,1),(200,10,22,1,1,NULL),(201,10,23,0,1,NULL),(202,11,24,1,1,1),(203,11,25,0,1,NULL),(204,12,26,1,1,NULL),(205,12,27,0,1,0),(206,13,28,1,1,NULL),(207,13,29,0,1,NULL),(208,14,30,1,1,1),(209,14,31,0,1,NULL),(210,15,32,1,1,NULL),(211,15,33,0,1,NULL),(212,16,1,1,1,0),(213,16,2,0,1,NULL),(214,17,3,1,1,NULL),(215,17,4,0,1,1),(216,18,5,1,1,NULL),(217,18,6,0,1,NULL),(218,19,7,1,1,1),(219,19,8,0,1,NULL),(220,20,9,1,1,NULL),(221,20,13,0,1,0),(222,21,14,1,1,NULL),(223,21,15,0,1,NULL),(224,22,16,1,1,1),(225,22,17,0,1,NULL),(226,23,18,1,1,NULL),(227,23,19,0,1,NULL),(228,24,20,1,1,0),(229,24,21,0,1,1),(230,1,9,NULL,1,NULL);
/*!40000 ALTER TABLE `cursosalumnos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ejercicios`
--

DROP TABLE IF EXISTS `ejercicios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ejercicios` (
  `id` int NOT NULL AUTO_INCREMENT,
  `autor` int NOT NULL,
  `curso` int NOT NULL,
  `nombre` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `archivo` varchar(1000) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `descripcion` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  PRIMARY KEY (`id`),
  KEY `autor` (`autor`),
  KEY `curso` (`curso`),
  CONSTRAINT `ejercicios_ibfk_1` FOREIGN KEY (`autor`) REFERENCES `profesores` (`id`) ON DELETE CASCADE,
  CONSTRAINT `ejercicios_ibfk_2` FOREIGN KEY (`curso`) REFERENCES `cursos` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ejercicios`
--

LOCK TABLES `ejercicios` WRITE;
/*!40000 ALTER TABLE `ejercicios` DISABLE KEYS */;
INSERT INTO `ejercicios` VALUES (1,6,1,'Ejercicio_0','Actividad_0_a.pdf','Ejercicio para que useis lo aprendido en el curso');
/*!40000 ALTER TABLE `ejercicios` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ejerciciosalumnos`
--

DROP TABLE IF EXISTS `ejerciciosalumnos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ejerciciosalumnos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `ejercicioId` int NOT NULL,
  `alumnoId` int NOT NULL,
  `archivo` varchar(1000) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  PRIMARY KEY (`id`),
  KEY `ejercicioId` (`ejercicioId`),
  KEY `alumnoId` (`alumnoId`),
  CONSTRAINT `ejerciciosalumnos_ibfk_1` FOREIGN KEY (`ejercicioId`) REFERENCES `ejercicios` (`id`) ON DELETE CASCADE,
  CONSTRAINT `ejerciciosalumnos_ibfk_2` FOREIGN KEY (`alumnoId`) REFERENCES `alumnos` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ejerciciosalumnos`
--

LOCK TABLES `ejerciciosalumnos` WRITE;
/*!40000 ALTER TABLE `ejerciciosalumnos` DISABLE KEYS */;
INSERT INTO `ejerciciosalumnos` VALUES (1,1,9,'Actividad 3 - Power BI.pdf');
/*!40000 ALTER TABLE `ejerciciosalumnos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `notificaciones`
--

DROP TABLE IF EXISTS `notificaciones`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `notificaciones` (
  `id` int NOT NULL AUTO_INCREMENT,
  `usuarioId` int NOT NULL,
  `tipoUsuario` varchar(255) DEFAULT NULL,
  `mensaje` varchar(255) NOT NULL,
  `enlace` varchar(255) DEFAULT NULL,
  `vista` tinyint(1) DEFAULT '0',
  `fecha` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notificaciones`
--

LOCK TABLES `notificaciones` WRITE;
/*!40000 ALTER TABLE `notificaciones` DISABLE KEYS */;
/*!40000 ALTER TABLE `notificaciones` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `profesores`
--

DROP TABLE IF EXISTS `profesores`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `profesores` (
  `id` int NOT NULL AUTO_INCREMENT,
  `usuarioId` int NOT NULL,
  `nombre` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `apellidos` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `dni` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `email` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `contrasena` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `numCuentaBancaria` varchar(24) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `numTelefono` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `redes` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `pais` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `localidad` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `especializacion` enum('Programación','BDD','Ciberseguridad','Diseño y UX','Inteligencia Artificial','Marketing','Desarrollo','Data Science') COLLATE utf8mb4_general_ci DEFAULT NULL,
  `imagenPerfil` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `alumnoVinculadoId` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `dni` (`dni`),
  UNIQUE KEY `numCuentaBancaria` (`numCuentaBancaria`),
  KEY `usuarioId` (`usuarioId`),
  KEY `alumnoVinculadoId` (`alumnoVinculadoId`),
  CONSTRAINT `profesores_ibfk_1` FOREIGN KEY (`usuarioId`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE,
  CONSTRAINT `profesores_ibfk_2` FOREIGN KEY (`alumnoVinculadoId`) REFERENCES `alumnos` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `profesores`
--

LOCK TABLES `profesores` WRITE;
/*!40000 ALTER TABLE `profesores` DISABLE KEYS */;
INSERT INTO `profesores` VALUES (1,1,'Ana','García López','11111111A','ana.garcia@nebriacademy.com','prof123','ES1234567890123456789012','600111222','@ana_prof','España','Madrid','Programación','mujer-1',13),(2,2,'Carlos','Martínez Ruiz','22222222B','carlos.martinez@profesores.nebrija.es','prof456','ES2345678901234567890123','600222333','@carlos_prof','España','Barcelona','BDD','hombre-1',14),(3,3,'Laura','Sánchez Pérez','33333333C','laura.sanchez@gmail.com','prof789','ES3456789012345678901234','600333444','@laura_prof','España','Valencia','Ciberseguridad','mujer-2',15),(4,4,'Miguel','Rodríguez Gómez','44444444D','miguel.rodriguez@outlook.com','prof000','ES4567890123456789012345','600444555','@miguel_prof','España','Sevilla','Diseño y UX','hombre-2',16),(5,5,'Elena','Fernández Torres','55555555E','elena.fernandez@yahoo.com','prof111','ES5678901234567890123456','600555666','@elena_prof','España','Bilbao','Marketing','mujer-3',17),(6,15,'Arturo','Arturez','66666666F','a@a.com','a','ES5678911134562390133446','','','España','Madrid','Inteligencia Artificial','hombre-3',18),(7,38,'Raquel','López Vega','77777777G','raquel.lopez@profesores.nebrija.es','prof777','ES7777777777777777777777','601111223','@raquel_prof','España','Madrid','Desarrollo','mujer-4',29),(8,39,'Diego','Morales Ruiz','88888888H','diego.morales@gmail.com','prof888','ES8888888888888888888888','601222334','@diego_prof','España','Barcelona','Data Science','hombre-4',30);
/*!40000 ALTER TABLE `profesores` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `profesorescursos`
--

DROP TABLE IF EXISTS `profesorescursos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `profesorescursos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `profesorId` int NOT NULL,
  `cursoId` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `profesorId` (`profesorId`),
  KEY `cursoId` (`cursoId`),
  CONSTRAINT `profesorescursos_ibfk_1` FOREIGN KEY (`profesorId`) REFERENCES `profesores` (`id`) ON DELETE CASCADE,
  CONSTRAINT `profesorescursos_ibfk_2` FOREIGN KEY (`cursoId`) REFERENCES `cursos` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=86 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `profesorescursos`
--

LOCK TABLES `profesorescursos` WRITE;
/*!40000 ALTER TABLE `profesorescursos` DISABLE KEYS */;
INSERT INTO `profesorescursos` VALUES (62,1,1),(63,1,2),(64,1,3),(65,2,4),(66,2,5),(67,2,6),(68,3,7),(69,3,8),(70,3,9),(71,4,10),(72,4,11),(73,4,12),(74,5,13),(75,5,14),(76,5,15),(77,6,16),(78,6,17),(79,6,18),(80,7,19),(81,7,20),(82,7,21),(83,8,22),(84,8,23),(85,8,24);
/*!40000 ALTER TABLE `profesorescursos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `puntuacionesejercicios`
--

DROP TABLE IF EXISTS `puntuacionesejercicios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `puntuacionesejercicios` (
  `id` int NOT NULL AUTO_INCREMENT,
  `ejercicioId` int NOT NULL,
  `alumnoId` int NOT NULL,
  `puntuacion` float DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `ejercicioId` (`ejercicioId`),
  KEY `alumnoId` (`alumnoId`),
  CONSTRAINT `puntuacionesejercicios_ibfk_1` FOREIGN KEY (`ejercicioId`) REFERENCES `ejerciciosalumnos` (`id`) ON DELETE CASCADE,
  CONSTRAINT `puntuacionesejercicios_ibfk_2` FOREIGN KEY (`alumnoId`) REFERENCES `alumnos` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `puntuacionesejercicios`
--

LOCK TABLES `puntuacionesejercicios` WRITE;
/*!40000 ALTER TABLE `puntuacionesejercicios` DISABLE KEYS */;
INSERT INTO `puntuacionesejercicios` VALUES (1,1,9,9);
/*!40000 ALTER TABLE `puntuacionesejercicios` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuarios`
--

DROP TABLE IF EXISTS `usuarios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuarios` (
  `id` int NOT NULL AUTO_INCREMENT,
  `tipo` enum('alumno','profesor','administrador') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=43 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuarios`
--

LOCK TABLES `usuarios` WRITE;
/*!40000 ALTER TABLE `usuarios` DISABLE KEYS */;
INSERT INTO `usuarios` VALUES (1,'profesor'),(2,'profesor'),(3,'profesor'),(4,'profesor'),(5,'profesor'),(6,'alumno'),(7,'alumno'),(8,'alumno'),(9,'alumno'),(10,'alumno'),(11,'alumno'),(12,'alumno'),(13,'alumno'),(14,'administrador'),(15,'profesor'),(16,'alumno'),(22,'alumno'),(23,'alumno'),(24,'alumno'),(25,'alumno'),(26,'alumno'),(27,'alumno'),(28,'alumno'),(29,'alumno'),(30,'alumno'),(31,'alumno'),(32,'alumno'),(33,'alumno'),(34,'alumno'),(35,'alumno'),(36,'alumno'),(37,'alumno'),(38,'profesor'),(39,'profesor'),(40,'profesor'),(41,'profesor'),(42,'profesor');
/*!40000 ALTER TABLE `usuarios` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `videos`
--

DROP TABLE IF EXISTS `videos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `videos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `autor` int NOT NULL,
  `curso` int NOT NULL,
  `nombre` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `archivo` varchar(1000) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  PRIMARY KEY (`id`),
  KEY `autor` (`autor`),
  KEY `curso` (`curso`),
  CONSTRAINT `videos_ibfk_1` FOREIGN KEY (`autor`) REFERENCES `profesores` (`id`) ON DELETE CASCADE,
  CONSTRAINT `videos_ibfk_2` FOREIGN KEY (`curso`) REFERENCES `cursos` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `videos`
--

LOCK TABLES `videos` WRITE;
/*!40000 ALTER TABLE `videos` DISABLE KEYS */;
INSERT INTO `videos` VALUES (1,1,1,'Video python','PixVerse_V5.6_Image_Text_720P_Un_profesor_dand.mp4');
/*!40000 ALTER TABLE `videos` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-04-14 11:32:27
