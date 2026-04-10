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
SET @MYSQLDUMP_TEMP_LOG_BIN = @@SESSION.SQL_LOG_BIN;
SET @@SESSION.SQL_LOG_BIN= 0;

--
-- GTID state at the beginning of the backup 
--

SET @@GLOBAL.GTID_PURGED=/*!80000 '+'*/ '30fb175e-33f7-11f1-8461-a693a0a5af93:1-15,
b24c7247-33ed-11f1-a111-4ed8722d7942:1-15,
bc1a2150-3356-11f1-aff8-621a46c7c30c:1-27,
c0df0eae-33e5-11f1-a408-a27b3c8d632d:1-85,
c87b417b-34ae-11f1-b6b2-72df6d2ad353:1-35';

--
-- Table structure for table `administradores`
--

DROP TABLE IF EXISTS `administradores`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `administradores` (
  `id` int NOT NULL AUTO_INCREMENT,
  `usuarioId` int NOT NULL,
  `dni` varchar(20) COLLATE utf8mb4_general_ci NOT NULL,
  `nombre` varchar(50) COLLATE utf8mb4_general_ci NOT NULL,
  `apellidos` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `email` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `contrasena` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `numCuentaBancaria` varchar(24) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `numTelefono` varchar(30) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `redes` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `pais` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `localidad` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
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
  `nombre` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `apellidos` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `dni` varchar(20) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `email` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `contrasena` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `numeroTarjeta` varchar(20) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `numTelefono` varchar(30) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `redes` text COLLATE utf8mb4_general_ci,
  `pais` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `localidad` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
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
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `alumnos`
--

LOCK TABLES `alumnos` WRITE;
/*!40000 ALTER TABLE `alumnos` DISABLE KEYS */;
INSERT INTO `alumnos` VALUES (1,6,'Juan','Fernández Gómez','66666666F','juan.fernandez@alumnos.nebrija.es','alumno123','4111111111111111','600666777','@juan_alum','España','Madrid',0,NULL),(2,7,'María','Rodríguez Díaz','77777777G','maria.rodriguez@gmail.com','alumno456','4222222222222222','600777888','@maria_alum','España','Sevilla',0,NULL),(3,8,'Pedro','López Torres','88888888H','pedro.lopez@alumnos.nebrija.es','alumno789','4333333333333333','600888999','@pedro_alum','España','Bilbao',0,NULL),(4,9,'Sofía','Gómez Ruiz','99999999I','sofia.gomez@hotmail.com','alumno000','4444444444444444','600999000','@sofia_alum','España','Zaragoza',0,NULL),(5,10,'David','Hernández Martín','10101010J','david.hernandez@alumnos.nebrija.es','alumno111','4555555555555555','601010101','@david_alum','España','Granada',0,NULL),(6,11,'Lucía','Pérez García','11111112K','lucia.perez@outlook.com','alumno222','4666666666666666','601111112','@lucia_alum','España','Valencia',0,NULL),(7,12,'Pablo','González Sánchez','12121212L','pablo.gonzalez@yahoo.com','alumno333','4777777777777777','601212121','@pablo_alum','España','Barcelona',0,NULL),(8,13,'Carmen','Díaz Navarro','13131313M','carmen.diaz@alumnos.nebrija.es','alumno444','4888888888888888','601313131','@carmen_alum','España','Málaga',0,NULL),(9,16,'Nico','Samp','13672984F','nico@example.com','pass123','4888888488888448','720178890','@nico_alum','Francia','Barcelona',0,NULL),(11,19,NULL,NULL,NULL,'prueba@gmail.com','ekHIGG5b',NULL,NULL,NULL,NULL,NULL,0,NULL),(12,21,NULL,NULL,NULL,'pruebaalumneb@alumnos.nebrija.es','ithzjixy',NULL,NULL,NULL,NULL,NULL,0,NULL),(13,22,'Ana','García López','11111111A',NULL,NULL,NULL,'600111222','@ana_prof','España','Madrid',1,1),(14,23,'Carlos','Martínez Ruiz','22222222B',NULL,NULL,NULL,'600222333','@carlos_prof','España','Barcelona',1,2),(15,24,'Laura','Sánchez Pérez','33333333C',NULL,NULL,NULL,'600333444','@laura_prof','España','Valencia',1,3),(16,25,'Miguel','Rodríguez Gómez','44444444D',NULL,NULL,NULL,'600444555','@miguel_prof','España','Sevilla',1,4),(17,26,'Elena','Fernández Torres','55555555E',NULL,NULL,NULL,'600555666','@elena_prof','España','Bilbao',1,5),(18,27,'Arturo','Arturez','66666660F',NULL,NULL,NULL,'','','España','Madrid',1,6),(19,28,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,9);
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
  `nombre` text COLLATE utf8mb4_general_ci NOT NULL,
  `archivo` varchar(1000) COLLATE utf8mb4_general_ci NOT NULL,
  `descripcion` text COLLATE utf8mb4_general_ci,
  `categoria` enum('Programación','Diseño','Ciberseguridad','BDD','Marketing') COLLATE utf8mb4_general_ci NOT NULL,
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
INSERT INTO `apuntes` VALUES (1,15,21,'Fundamentos de las BDD','Fundamentos de Bases de Datos.pdf','Introducción a las BDD, \r\nAutor: © Santiago Faci','BDD',1),(2,9,21,'Prueba alumno','Fundamentos de Bases de Datos.pdf',NULL,'BDD',0),(8,15,21,'hola','PROPUESTA UNIFICADA WEB GRADOS ONLINE.pdf','aaa','BDD',0);
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
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `apuntesalumnos`
--

LOCK TABLES `apuntesalumnos` WRITE;
/*!40000 ALTER TABLE `apuntesalumnos` DISABLE KEYS */;
INSERT INTO `apuntesalumnos` VALUES (1,9,1,1),(2,6,1,NULL),(3,6,2,NULL);
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
  `comentario` text COLLATE utf8mb4_general_ci,
  PRIMARY KEY (`id`),
  KEY `usuarioId` (`usuarioId`),
  KEY `cursoId` (`cursoId`),
  CONSTRAINT `comentarioalumnocurso_ibfk_1` FOREIGN KEY (`usuarioId`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE,
  CONSTRAINT `comentarioalumnocurso_ibfk_2` FOREIGN KEY (`cursoId`) REFERENCES `cursos` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `comentarioalumnocurso`
--

LOCK TABLES `comentarioalumnocurso` WRITE;
/*!40000 ALTER TABLE `comentarioalumnocurso` DISABLE KEYS */;
INSERT INTO `comentarioalumnocurso` VALUES (1,6,1,'Excelente curso, muy bien explicado.'),(2,7,1,'Me está ayudando mucho a aprender Python.'),(3,8,4,'Buen contenido sobre SQL.'),(4,9,6,'Interesante introducción a la ciberseguridad.'),(5,10,12,'Muy útil para mi negocio.'),(6,11,15,'JavaScript explicado de forma clara.'),(7,12,16,'Perfecto para empezar con React.'),(8,13,20,'Diseño responsive muy práctico.'),(9,9,21,'El vídeo se nota que es IA, no cuela. ?');
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
  `nombreCurso` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `categoria` enum('Programación','Diseño','Ciberseguridad','BDD','Marketing') COLLATE utf8mb4_general_ci DEFAULT NULL,
  `profesor` int DEFAULT NULL,
  `nivel` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `valoracion` float DEFAULT NULL,
  `descripcion` text COLLATE utf8mb4_general_ci,
  `imagen` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `profesor` (`profesor`),
  CONSTRAINT `cursos_ibfk_1` FOREIGN KEY (`profesor`) REFERENCES `profesores` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=29 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cursos`
--

LOCK TABLES `cursos` WRITE;
/*!40000 ALTER TABLE `cursos` DISABLE KEYS */;
INSERT INTO `cursos` VALUES (1,'Python desde Cero','Programación',1,'Principiante',0,'Aprende Python desde cero. Curso ideal para iniciarse en la programación.','Foto1'),(2,'Python Avanzado','Programación',1,'Avanzado',0,'Programación avanzada con Python: decoradores, generadores y patrones de diseño.','Foto2'),(3,'Diseño Web con HTML/CSS','Diseño',4,'Intermedio',0,'Crea sitios web modernos con HTML5 y CSS3.','Foto3'),(4,'SQL y Bases de Datos','BDD',2,'Intermedio',0,'Domina SQL y gestiona bases de datos relacionales con MySQL y PostgreSQL.','Foto4'),(5,'Diseño de Bases de Datos','BDD',2,'Avanzado',0,'Modelado de datos, normalización y optimización de bases de datos.','Foto5'),(6,'Fundamentos de Ciberseguridad','Ciberseguridad',3,'Principiante',0,'Introducción a los conceptos básicos de seguridad informática.','Foto6'),(7,'Seguridad en Redes','Ciberseguridad',3,'Intermedio',0,'Protección de redes, firewalls y análisis de vulnerabilidades.','Foto7'),(8,'Machine Learning con Python','Programación',1,'Avanzado',0,'Aprende machine learning usando librerías como scikit-learn y TensorFlow.','Foto8'),(9,'NoSQL y MongoDB','BDD',2,'Intermedio',0,'Bases de datos NoSQL y MongoDB para aplicaciones modernas.','Foto9'),(10,'Ethical Hacking','Ciberseguridad',3,'Avanzado',0,'Técnicas de hacking ético para auditorías de seguridad.','Foto10'),(11,'Diseño Gráfico con Figma','Diseño',4,'Intermedio',0,'Aprende a crear interfaces y diseños profesionales con Figma.','Foto1'),(12,'Marketing Digital','Marketing',5,'Principiante',0,'Estrategias de marketing digital para redes sociales y SEO.','Foto2'),(13,'SEO Avanzado','Marketing',5,'Avanzado',0,'Optimización de motores de búsqueda para posicionar tu sitio web.','Foto3'),(14,'Diseño UI/UX','Diseño',4,'Avanzado',0,'Principios de experiencia de usuario y diseño de interfaces.','Foto4'),(15,'JavaScript Moderno','Programación',1,'Intermedio',0,'Aprende ES6+ y las últimas características de JavaScript.','Foto5'),(16,'React para Principiantes','Diseño',4,'Principiante',0,'Introducción al desarrollo de interfaces con React.js.','Foto6'),(17,'Análisis de Datos con SQL','BDD',2,'Avanzado',0,'Técnicas avanzadas de análisis y visualización de datos con SQL.','Foto7'),(18,'Protección de Datos GDPR','Ciberseguridad',3,'Intermedio',0,'Cumplimiento del Reglamento General de Protección de Datos.','Foto8'),(19,'Email Marketing','Marketing',5,'Intermedio',0,'Campañas efectivas de email marketing y automatización.','Foto9'),(20,'Diseño Responsive','Diseño',4,'Intermedio',0,'Crea diseños web adaptables a todos los dispositivos.','Foto10'),(21,'Iniciación a las BDD','BDD',6,'Básico',1,'Aquí aprendereis los principios básicos de las bases de datos ','Foto1'),(24,'Prueba','Ciberseguridad',6,'Intermedio',0,'Hola','Foto6');
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
) ENGINE=InnoDB AUTO_INCREMENT=30 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cursosalumnos`
--

LOCK TABLES `cursosalumnos` WRITE;
/*!40000 ALTER TABLE `cursosalumnos` DISABLE KEYS */;
INSERT INTO `cursosalumnos` VALUES (1,1,1,1,1,NULL),(2,1,2,1,1,NULL),(3,2,1,0,1,NULL),(4,3,3,1,1,NULL),(5,4,3,1,1,NULL),(6,4,4,1,1,NULL),(7,5,5,0,1,NULL),(8,6,2,1,1,NULL),(9,6,3,1,1,NULL),(10,7,4,0,1,NULL),(11,8,1,1,1,NULL),(12,9,5,1,1,NULL),(13,10,2,0,1,NULL),(14,11,4,1,1,NULL),(15,12,5,1,1,NULL),(16,13,3,0,1,NULL),(17,14,1,1,1,NULL),(18,15,6,1,1,NULL),(19,16,7,1,1,NULL),(20,17,8,0,1,NULL),(21,18,6,1,1,NULL),(22,19,7,1,1,NULL),(23,20,8,1,1,NULL),(24,3,6,1,1,NULL),(25,12,8,0,1,NULL),(26,20,1,0,0,1),(27,21,9,0,1,1),(28,20,9,1,1,0),(29,24,9,0,0,NULL);
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
  `nombre` text COLLATE utf8mb4_general_ci NOT NULL,
  `archivo` varchar(1000) COLLATE utf8mb4_general_ci NOT NULL,
  `descripcion` text COLLATE utf8mb4_general_ci,
  PRIMARY KEY (`id`),
  KEY `autor` (`autor`),
  KEY `curso` (`curso`),
  CONSTRAINT `ejercicios_ibfk_1` FOREIGN KEY (`autor`) REFERENCES `profesores` (`id`) ON DELETE CASCADE,
  CONSTRAINT `ejercicios_ibfk_2` FOREIGN KEY (`curso`) REFERENCES `cursos` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ejercicios`
--

LOCK TABLES `ejercicios` WRITE;
/*!40000 ALTER TABLE `ejercicios` DISABLE KEYS */;
INSERT INTO `ejercicios` VALUES (1,6,21,'Ejercicio_0','Actividad_0_a.pdf','Ejercicio para que useis lo aprendido en el curso');
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
  `archivo` varchar(1000) COLLATE utf8mb4_general_ci NOT NULL,
  PRIMARY KEY (`id`),
  KEY `ejercicioId` (`ejercicioId`),
  KEY `alumnoId` (`alumnoId`),
  CONSTRAINT `ejerciciosalumnos_ibfk_1` FOREIGN KEY (`ejercicioId`) REFERENCES `ejercicios` (`id`) ON DELETE CASCADE,
  CONSTRAINT `ejerciciosalumnos_ibfk_2` FOREIGN KEY (`alumnoId`) REFERENCES `alumnos` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
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
  `tipoUsuario` varchar(255) DEFAULT NULL COMMENT 'Si es profesor, alumno, o administrador al que pertenece la notificación',
  `mensaje` varchar(255) NOT NULL,
  `enlace` varchar(255) DEFAULT NULL,
  `vista` tinyint(1) DEFAULT '0',
  `fecha` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notificaciones`
--

LOCK TABLES `notificaciones` WRITE;
/*!40000 ALTER TABLE `notificaciones` DISABLE KEYS */;
INSERT INTO `notificaciones` VALUES (1,16,'alumno','Nuevo apunte subido en el curso Iniciación a las BDD','/Home/Cursos/21',1,'2026-04-10 08:16:02'),(2,16,'alumno','Se ha actualizado la corrección de tu respuesta del ejercicio Ejercicio_0','/Home/Apuntes',1,'2026-04-10 08:17:39'),(3,16,'alumno','Se ha actualizado la corrección de tu respuesta del ejercicio Ejercicio_0','/Home/Cursos/21',1,'2026-04-10 08:24:23');
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
  `nombre` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `apellidos` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `dni` varchar(20) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `email` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `contrasena` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `numCuentaBancaria` varchar(24) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `numTelefono` varchar(30) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `redes` text COLLATE utf8mb4_general_ci,
  `pais` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `localidad` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `especializacion` enum('Programación','Diseño','Ciberseguridad','BDD','Marketing') COLLATE utf8mb4_general_ci DEFAULT NULL,
  `imagenPerfil` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `alumnoVinculadoId` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `dni` (`dni`),
  UNIQUE KEY `numCuentaBancaria` (`numCuentaBancaria`),
  KEY `usuarioId` (`usuarioId`),
  KEY `alumnoVinculadoId` (`alumnoVinculadoId`),
  CONSTRAINT `profesores_ibfk_1` FOREIGN KEY (`usuarioId`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE,
  CONSTRAINT `profesores_ibfk_2` FOREIGN KEY (`alumnoVinculadoId`) REFERENCES `alumnos` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `profesores`
--

LOCK TABLES `profesores` WRITE;
/*!40000 ALTER TABLE `profesores` DISABLE KEYS */;
INSERT INTO `profesores` VALUES (1,1,'Ana','García López','11111111A','ana.garcia@nebriacademy.com','prof123','ES1234567890123456789012','600111222','@ana_prof','España','Madrid','Programación',NULL,13),(2,2,'Carlos','Martínez Ruiz','22222222B','carlos.martinez@profesores.nebrija.es','prof456','ES2345678901234567890123','600222333','@carlos_prof','España','Barcelona','BDD',NULL,14),(3,3,'Laura','Sánchez Pérez','33333333C','laura.sanchez@gmail.com','prof789','ES3456789012345678901234','600333444','@laura_prof','España','Valencia','Ciberseguridad',NULL,15),(4,4,'Miguel','Rodríguez Gómez','44444444D','miguel.rodriguez@outlook.com','prof000','ES4567890123456789012345','600444555','@miguel_prof','España','Sevilla','Diseño',NULL,16),(5,5,'Elena','Fernández Torres','55555555E','elena.fernandez@yahoo.com','prof111','ES5678901234567890123456','600555666','@elena_prof','España','Bilbao','Marketing',NULL,17),(6,15,'Arturo','Arturez','66666666F','a@a.com','a','ES5678911134562390133446','','','España','Madrid','Programación','hombre-7',18),(9,20,NULL,NULL,NULL,'pruebaprof@gmail.com','wEWXt5gF',NULL,NULL,NULL,NULL,NULL,'',NULL,19);
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
) ENGINE=InnoDB AUTO_INCREMENT=29 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `profesorescursos`
--

LOCK TABLES `profesorescursos` WRITE;
/*!40000 ALTER TABLE `profesorescursos` DISABLE KEYS */;
INSERT INTO `profesorescursos` VALUES (1,1,1),(2,1,2),(3,1,8),(4,1,15),(5,2,4),(6,2,5),(7,2,9),(8,2,17),(9,3,6),(10,3,7),(11,3,10),(12,3,18),(13,4,3),(14,4,11),(15,4,14),(16,4,16),(17,4,20),(18,5,12),(19,5,13),(20,5,19),(21,6,21),(24,6,24);
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
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `puntuacionesejercicios`
--

LOCK TABLES `puntuacionesejercicios` WRITE;
/*!40000 ALTER TABLE `puntuacionesejercicios` DISABLE KEYS */;
INSERT INTO `puntuacionesejercicios` VALUES (1,1,9,7);
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
  `tipo` enum('alumno','profesor','administrador') COLLATE utf8mb4_general_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=29 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuarios`
--

LOCK TABLES `usuarios` WRITE;
/*!40000 ALTER TABLE `usuarios` DISABLE KEYS */;
INSERT INTO `usuarios` VALUES (1,'profesor'),(2,'profesor'),(3,'profesor'),(4,'profesor'),(5,'profesor'),(6,'alumno'),(7,'alumno'),(8,'alumno'),(9,'alumno'),(10,'alumno'),(11,'alumno'),(12,'alumno'),(13,'alumno'),(14,'administrador'),(15,'profesor'),(16,'alumno'),(19,'alumno'),(20,'profesor'),(21,'alumno'),(22,'alumno'),(23,'alumno'),(24,'alumno'),(25,'alumno'),(26,'alumno'),(27,'alumno'),(28,'alumno');
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
  `nombre` varchar(1000) COLLATE utf8mb4_general_ci NOT NULL,
  `archivo` varchar(1000) COLLATE utf8mb4_general_ci NOT NULL,
  PRIMARY KEY (`id`),
  KEY `autor` (`autor`),
  KEY `curso` (`curso`),
  CONSTRAINT `videos_ibfk_1` FOREIGN KEY (`autor`) REFERENCES `profesores` (`id`) ON DELETE CASCADE,
  CONSTRAINT `videos_ibfk_2` FOREIGN KEY (`curso`) REFERENCES `cursos` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `videos`
--

LOCK TABLES `videos` WRITE;
/*!40000 ALTER TABLE `videos` DISABLE KEYS */;
INSERT INTO `videos` VALUES (1,6,21,'Presentación del curso','PixVerse_V5.6_Image_Text_720P_Un_profesor_dand.mp4');
/*!40000 ALTER TABLE `videos` ENABLE KEYS */;
UNLOCK TABLES;
SET @@SESSION.SQL_LOG_BIN = @MYSQLDUMP_TEMP_LOG_BIN;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-04-10 10:33:55
