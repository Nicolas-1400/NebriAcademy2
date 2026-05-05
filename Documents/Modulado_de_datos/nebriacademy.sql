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
) ENGINE=InnoDB AUTO_INCREMENT=45 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `alumnos`
--

LOCK TABLES `alumnos` WRITE;
/*!40000 ALTER TABLE `alumnos` DISABLE KEYS */;
INSERT INTO `alumnos` VALUES (1,6,'Juan','Fernández Gómez','66666666F','juan.fernandez@alumnos.nebrija.es','alumno123','4111111111111111','600666777','@juan_alum','España','Madrid',0,NULL),(2,7,'María','Rodríguez Díaz','77777777G','maria.rodriguez@gmail.com','alumno456','4222222222222222','600777888','@maria_alum','España','Sevilla',0,NULL),(3,8,'Pedro','López Torres','88888888H','pedro.lopez@alumnos.nebrija.es','alumno789','4333333333333333','600888999','@pedro_alum','España','Bilbao',0,NULL),(4,9,'Sofía','Gómez Ruiz','99999999I','sofia.gomez@hotmail.com','alumno000','4444444444444444','600999000','@sofia_alum','España','Zaragoza',0,NULL),(5,10,'David','Hernández Martín','10101010J','david.hernandez@alumnos.nebrija.es','alumno111','4555555555555555','601010101','@david_alum','España','Granada',0,NULL),(6,11,'Lucía','Pérez García','11111112K','lucia.perez@outlook.com','alumno222','4666666666666666','601111112','@lucia_alum','España','Valencia',0,NULL),(7,12,'Pablo','González Sánchez','12121212L','pablo.gonzalez@yahoo.com','alumno333','4777777777777777','601212121','@pablo_alum','España','Barcelona',0,NULL),(8,13,'Carmen','Díaz Navarro','13131313M','carmen.diaz@alumnos.nebrija.es','alumno444','4888888888888888','601313131','@carmen_alum','España','Málaga',0,NULL),(9,16,'Nico','Samp','13672984F','nico@example.com','pass123','4888888488888448','720178890','@nico_alum','Francia','Barcelona',0,NULL),(13,22,'Ana','García López','11111111A',NULL,NULL,NULL,'600111222','@ana_prof','España','Madrid',1,1),(14,23,'Carlos','Martínez Ruiz','22222222B',NULL,NULL,NULL,'600222333','@carlos_prof','España','Barcelona',1,2),(15,24,'Laura','Sánchez Pérez','33333333C',NULL,NULL,NULL,'600333444','@laura_prof','España','Valencia',1,3),(16,25,'Miguel','Rodríguez Gómez','44444444D',NULL,NULL,NULL,'600444555','@miguel_prof','España','Sevilla',1,4),(17,26,'Elena','Fernández Torres','55555555E',NULL,NULL,NULL,'600555666','@elena_prof','España','Bilbao',1,5),(18,27,'Arturo','Arturez','66666660F',NULL,NULL,NULL,'','','España','Madrid',1,6),(19,28,'Luis','Martínez Soto','20202020L','luis.martinez@alumnos.nebrija.es','alumno555','4999999999999999','601234567','@luis_alum','España','Madrid',0,NULL),(20,29,'Sara','Gómez Navarro','21212121M','sara.gomez@gmail.com','alumno666','5000000000000000','601345678','@sara_alum','España','Sevilla',0,NULL),(21,30,'Miguel','Pérez López','22222223N','miguel.perez@alumnos.nebrija.es','alumno777','5111111111111111','601456789','@miguel_alum','España','Barcelona',0,NULL),(22,31,'Elena','Rodríguez Sánchez','23232323O','elena.rodriguez@hotmail.com','alumno888','5222222222222222','601567890','@elena_alum','España','Valencia',0,NULL),(23,32,'Javier','Fernández Díaz','24242424P','javier.fernandez@alumnos.nebrija.es','alumno999','5333333333333333','601678901','@javier_alum','España','Granada',0,NULL),(24,33,'Laura','Sánchez Ruiz','25252525Q','laura.sanchez@yahoo.com','alumno000','5444444444444444','601789012','@laura_alum','España','Bilbao',0,NULL),(25,34,'Carlos','García Martín','26262626R','carlos.garcia@alumnos.nebrija.es','alumno111','5555555555555555','601890123','@carlos_alum','España','Zaragoza',0,NULL),(26,35,'Isabel','López Torres','27272727S','isabel.lopez@outlook.com','alumno222','5666666666666666','601901234','@isabel_alum','España','Málaga',0,NULL),(27,36,'Pablo','Hernández Gómez','28282828T','pablo.hernandez@alumnos.nebrija.es','alumno333','5777777777777777','602012345','@pablo_alum','España','Madrid',0,NULL),(28,37,'Carmen','Díaz Pérez','29292929U','carmen.diaz@gmail.com','alumno444','5888888888888888','602123456','@carmen_alum','España','Sevilla',0,NULL),(29,38,'Raquel','López Vega','77000001G',NULL,NULL,NULL,'601111223','@raquel_prof','España','Madrid',1,7),(30,39,'Diego','Morales Ruiz','88000002H',NULL,NULL,NULL,'601222334','@diego_prof','España','Barcelona',1,8);
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
) ENGINE=InnoDB AUTO_INCREMENT=35 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `apuntes`
--

LOCK TABLES `apuntes` WRITE;
/*!40000 ALTER TABLE `apuntes` DISABLE KEYS */;
INSERT INTO `apuntes` VALUES (20,15,16,'Prueba','https://res.cloudinary.com/dge59jbqb/image/upload/v1777017423/nebriacademy/apuntes/5.2_-_Pinia_con_TypeScript.pdf','Holaalo','Inteligencia Artificial',1),(21,16,16,'Prueba 2','https://res.cloudinary.com/dge59jbqb/image/upload/v1777017631/nebriacademy/apuntes/5.3_-_Mejores_pr__cticas_y_patrones_de_dise__o.pdf','fafaf','Inteligencia Artificial',2),(22,16,16,'Ola','https://res.cloudinary.com/dge59jbqb/image/upload/v1777017423/nebriacademy/apuntes/5.2_-_Pinia_con_TypeScript.pdf','adfa','Inteligencia Artificial',2),(23,15,16,'vcxzv','https://res.cloudinary.com/dge59jbqb/image/upload/v1777017423/nebriacademy/apuntes/5.2_-_Pinia_con_TypeScript.pdf','vczxcvz','Inteligencia Artificial',1),(24,22,16,'ngn','https://res.cloudinary.com/dge59jbqb/raw/upload/v1777536107/nebriacademy/apuntes/Readme','ngnc','Inteligencia Artificial',2),(25,22,16,'GNN','https://res.cloudinary.com/dge59jbqb/image/upload/v1777536364/nebriacademy/apuntes/Modelo_145.pdf','BFF','Inteligencia Artificial',0),(27,16,16,'gds','https://res.cloudinary.com/dge59jbqb/image/upload/v1777536987/nebriacademy/apuntes/English_Podcast_-_Future_in_Debate__1_.pdf','gsg','Inteligencia Artificial',1),(28,6,16,'mh','https://res.cloudinary.com/dge59jbqb/raw/upload/v1777537026/nebriacademy/apuntes/message__6_','mhmgh','Inteligencia Artificial',1),(29,15,16,'xcbz','https://res.cloudinary.com/dge59jbqb/raw/upload/v1777537258/nebriacademy/apuntes/aaa','xbzbz','Inteligencia Artificial',1),(31,16,NULL,'Una prueba de apunte','https://res.cloudinary.com/dge59jbqb/image/upload/v1777017423/nebriacademy/apuntes/5.2_-_Pinia_con_TypeScript.pdf','Lorem ipsum dolor sit amet consectetur adipisicing elit.plica?','BDD',0),(32,16,NULL,'Un titulo muuuuy largo de apunte','https://res.cloudinary.com/dge59jbqb/image/upload/v1777017631/nebriacademy/apuntes/5.3_-_Mejores_pr__cticas_y_patrones_de_dise__o.pdf','Lorem iam labore natus, earum laudantium. Dolor ipsum explicabo iste perferendis tempora?','Ciberseguridad',0),(34,16,16,'prueba notif','https://res.cloudinary.com/dge59jbqb/image/upload/v1777017423/nebriacademy/apuntes/5.2_-_Pinia_con_TypeScript.pdf','aaa','Inteligencia Artificial',0);
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
) ENGINE=InnoDB AUTO_INCREMENT=33 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `apuntesalumnos`
--

LOCK TABLES `apuntesalumnos` WRITE;
/*!40000 ALTER TABLE `apuntesalumnos` DISABLE KEYS */;
INSERT INTO `apuntesalumnos` VALUES (20,9,21,1),(21,9,20,1),(22,9,22,1),(23,13,22,1),(24,13,21,1),(25,9,23,1),(26,9,24,1),(27,9,25,NULL),(29,9,27,1),(30,9,28,1),(31,9,29,1),(32,18,24,1);
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
) ENGINE=InnoDB AUTO_INCREMENT=54 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `comentarioalumnocurso`
--

LOCK TABLES `comentarioalumnocurso` WRITE;
/*!40000 ALTER TABLE `comentarioalumnocurso` DISABLE KEYS */;
INSERT INTO `comentarioalumnocurso` VALUES (25,6,1,'Excelente curso para empezar desde cero.'),(26,7,1,'Muy bien explicado el profesor, ritmo perfecto.'),(27,8,2,'Me encantó la parte de asincronía y promesas.'),(28,10,4,'SQL nunca fue tan fácil de entender.'),(29,12,7,'Conceptos claros y ejemplos muy prácticos.'),(30,22,10,'Figma es una herramienta increíble, gracias.'),(31,24,13,'Estrategias claras y aplicables a mi negocio.'),(32,26,16,'La IA está de moda y este curso la explica genial.'),(33,28,19,'Base sólida para luego saltar a frameworks.'),(34,30,22,'Data Science es el futuro, buenísimo el contenido.'),(35,9,5,'El modelado de datos cambió mi forma de trabajar.'),(36,11,17,'Machine learning explicado paso a paso, sin rodeos.'),(37,13,20,'SEO práctico y directo al grano. Lo recomiendo.'),(38,15,23,'Pandas imprescindible para análisis de datos.'),(39,17,24,'Spark potente, curso muy completo y actualizado.'),(40,16,16,'Buenos días'),(41,22,16,'a'),(42,22,16,'a'),(43,22,16,'a'),(44,22,16,'a'),(45,22,16,'a'),(46,22,16,'a'),(47,22,16,'a'),(48,22,16,'a'),(49,22,16,'a'),(50,22,16,'a');
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
) ENGINE=InnoDB AUTO_INCREMENT=65 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cursos`
--

LOCK TABLES `cursos` WRITE;
/*!40000 ALTER TABLE `cursos` DISABLE KEYS */;
INSERT INTO `cursos` VALUES (1,'Python desde Cero','Programación',1,'Básico',0,'Aprende Python desde cero. Curso ideal para iniciarse.','Foto1'),(2,'JavaScript Moderno','Programación',1,'Intermedio',0,'ES6+, asincronía y patrones de diseño.','Foto2'),(3,'Arquitectura de Software','Programación',1,'Avanzado',0,'Microservicios y patrones avanzados.','Foto3'),(4,'SQL Fundamentos','BDD',2,'Básico',0,'Consultas básicas y diseño relacional.','Foto4'),(5,'Modelado de Bases de Datos','BDD',2,'Intermedio',0,'Normalización y diagramas ER avanzados.','Foto5'),(6,'Optimización y Tuning','BDD',2,'Avanzado',0,'Indexación y rendimiento en motores SQL.','Foto6'),(7,'Fundamentos de Ciberseguridad','Ciberseguridad',3,'Básico',0,'Conceptos esenciales de seguridad informática.','Foto7'),(8,'Seguridad en Redes','Ciberseguridad',3,'Intermedio',0,'Firewalls, VPNs y análisis de tráfico.','Foto8'),(9,'Hacking Ético Avanzado','Ciberseguridad',3,'Avanzado',0,'Pentesting profesional y explotación controlada.','Foto9'),(10,'Introducción al Diseño UI','Diseño y UX',4,'Básico',0,'Principios de diseño visual y tipografía.','Foto10'),(11,'Prototipado con Figma','Diseño y UX',4,'Intermedio',0,'Creación de wireframes y prototipos interactivos.','Foto1'),(12,'UX Research Avanzado','Diseño y UX',4,'Avanzado',0,'Tests de usabilidad, métricas y psicología del usuario.','Foto2'),(13,'Marketing Digital Básico','Marketing',5,'Básico',0,'Estrategias online, funnels y redes sociales.','Foto3'),(14,'SEO y SEM Intermedio','Marketing',5,'Intermedio',0,'Posicionamiento orgánico y campañas pagadas.','Foto4'),(15,'Growth Hacking y Analítica','Marketing',5,'Avanzado',0,'Métricas clave, A/B testing y experimentación.','Foto5'),(16,'IA para Principiantes','Inteligencia Artificial',6,'Básico',1,'Conceptos básicos de IA, ML y ética.','Foto6'),(17,'Machine Learning Práctico','Inteligencia Artificial',6,'Intermedio',0,'Scikit-learn, pipelines y evaluación de modelos.','Foto7'),(18,'Deep Learning y Redes Neuronales','Inteligencia Artificial',6,'Avanzado',0,'TensorFlow, CNNs y arquitecturas profundas.','Foto8'),(19,'HTML/CSS/JS Esencial','Desarrollo',7,'Básico',0,'Maquetación web semántica y DOM básico.','Foto9'),(20,'Frameworks Frontend','Desarrollo',7,'Intermedio',2,'React, Vue y herramientas de desarrollo modernas.','Foto10'),(21,'Desarrollo Full Stack MERN','Desarrollo',7,'Avanzado',1,'MongoDB, Express, React y Node.js integrados.','Foto1'),(22,'Introducción a Data Science','Data Science',8,'Básico',1,'Análisis exploratorio y estadística aplicada.','Foto2'),(23,'Análisis con Python y Pandas','Data Science',8,'Intermedio',1,'Manipulación, limpieza y visualización de datos.','Foto3'),(24,'Big Data y Spark','Data Science',8,'Avanzado',2,'Procesamiento distribuido y entornos Hadoop/Spark.','Foto4'),(62,'cdscvsd','BDD',6,'Intermedio',0,'Hola','Foto7'),(63,'aaa','Programación',6,'Básico',0,'aaaaaaaaaaaaaaaaaaaaaaaa\naaaaaaaaaaaaaaaaaaaaaaa\naaaaaaaaaaaaaaaaaaaaaaaaaaa','Foto9'),(64,'Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola Hola ','Diseño y UX',6,'Intermedio',0,'dadada','Foto3');
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
) ENGINE=InnoDB AUTO_INCREMENT=247 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cursosalumnos`
--

LOCK TABLES `cursosalumnos` WRITE;
/*!40000 ALTER TABLE `cursosalumnos` DISABLE KEYS */;
INSERT INTO `cursosalumnos` VALUES (182,1,1,1,1,NULL),(183,1,2,0,1,NULL),(184,2,3,1,1,1),(185,2,4,0,1,NULL),(186,3,5,1,1,NULL),(187,3,6,0,1,0),(188,4,7,1,1,NULL),(189,4,8,0,1,NULL),(190,5,9,1,1,1),(191,5,13,0,1,NULL),(192,6,14,1,1,NULL),(193,6,15,0,1,1),(194,7,16,1,1,NULL),(195,7,17,0,1,NULL),(196,8,18,1,1,0),(197,8,19,0,1,NULL),(198,9,20,1,1,NULL),(199,9,21,0,1,1),(200,10,22,1,1,NULL),(201,10,23,0,1,NULL),(202,11,24,1,1,1),(203,11,25,0,1,NULL),(204,12,26,1,1,NULL),(205,12,27,0,1,0),(206,13,28,1,1,NULL),(207,13,29,0,1,NULL),(208,14,30,1,1,1),(212,16,1,1,1,0),(213,16,2,0,1,NULL),(214,17,3,1,1,NULL),(215,17,4,0,1,1),(216,18,5,1,1,NULL),(217,18,6,0,1,NULL),(218,19,7,1,1,1),(219,19,8,0,1,NULL),(220,20,9,1,1,1),(221,20,13,0,1,0),(222,21,14,1,1,NULL),(223,21,15,0,1,NULL),(224,22,16,1,1,1),(225,22,17,0,1,NULL),(226,23,18,0,1,1),(227,23,19,0,1,NULL),(228,24,20,1,1,0),(229,24,21,0,1,1),(230,1,9,NULL,1,NULL),(231,16,9,1,1,1),(232,17,9,NULL,1,NULL),(233,1,18,NULL,1,NULL),(234,1,18,1,NULL,NULL),(235,24,18,1,NULL,1),(236,24,18,NULL,1,NULL),(237,22,18,1,1,1),(238,21,18,NULL,1,1),(239,21,18,1,NULL,NULL),(240,21,9,NULL,0,NULL),(241,22,9,NULL,0,NULL),(242,18,9,NULL,1,NULL),(243,23,9,0,0,NULL),(244,16,13,NULL,1,NULL),(245,24,9,NULL,0,1),(246,20,18,0,0,1);
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
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ejercicios`
--

LOCK TABLES `ejercicios` WRITE;
/*!40000 ALTER TABLE `ejercicios` DISABLE KEYS */;
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
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ejerciciosalumnos`
--

LOCK TABLES `ejerciciosalumnos` WRITE;
/*!40000 ALTER TABLE `ejerciciosalumnos` DISABLE KEYS */;
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
) ENGINE=InnoDB AUTO_INCREMENT=110 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notificaciones`
--

LOCK TABLES `notificaciones` WRITE;
/*!40000 ALTER TABLE `notificaciones` DISABLE KEYS */;
INSERT INTO `notificaciones` VALUES (20,7,'alumno','Nuevo ejercicio subido en el curso IA para Principiantes','/Home/Cursos/16',0,'2026-04-22 08:07:18'),(24,9,NULL,'Tienes 5 respuesta(s) nueva(s) en tu ticket KAN-16','/Home/MisTickets/KAN-16',0,'2026-04-22 08:30:25'),(26,7,'alumno','Nuevo apunte subido en el curso IA para Principiantes','/Home/Cursos/16',0,'2026-04-22 08:30:49'),(29,7,'alumno','Nuevo ejercicio subido en el curso IA para Principiantes','/Home/Cursos/16',0,'2026-04-22 08:31:10'),(32,7,'alumno','Nuevo ejercicio subido en el curso IA para Principiantes','/Home/Cursos/16',0,'2026-04-22 08:32:13'),(38,1,NULL,'Tienes 1 respuesta(s) nueva(s) en tu ticket KAN-17','/Home/MisTickets/KAN-17',0,'2026-04-22 08:33:47'),(43,7,'alumno','Nuevo vídeo subido en el curso IA para Principiantes','/Home/Cursos/16',0,'2026-04-22 08:35:22'),(46,7,'alumno','Nuevo ejercicio subido en el curso IA para Principiantes','/Home/Cursos/16',0,'2026-04-22 08:35:52'),(48,1,'alumno','Tienes 3 respuesta(s) nueva(s) en tu ticket KAN-17','/Home/MisTickets/KAN-17',0,'2026-04-22 08:39:42'),(49,1,'alumno','Tienes 1 respuesta(s) nueva(s) en tu ticket KAN-17','/Home/MisTickets/KAN-17',0,'2026-04-22 08:43:42'),(51,10,'alumno','Nuevo apunte subido en el curso Deep Learning y Redes Neuronales','/Home/Cursos/18',0,'2026-04-23 09:06:08'),(52,11,'alumno','Nuevo apunte subido en el curso Deep Learning y Redes Neuronales','/Home/Cursos/18',0,'2026-04-23 09:06:08'),(53,10,'alumno','Nuevo ejercicio subido en el curso Deep Learning y Redes Neuronales','/Home/Cursos/18',0,'2026-04-23 09:10:56'),(54,11,'alumno','Nuevo ejercicio subido en el curso Deep Learning y Redes Neuronales','/Home/Cursos/18',0,'2026-04-23 09:10:56'),(55,10,'alumno','Nuevo ejercicio subido en el curso Deep Learning y Redes Neuronales','/Home/Cursos/18',0,'2026-04-23 09:16:43'),(56,11,'alumno','Nuevo ejercicio subido en el curso Deep Learning y Redes Neuronales','/Home/Cursos/18',0,'2026-04-23 09:16:43'),(57,10,'alumno','Nuevo vídeo subido en el curso Deep Learning y Redes Neuronales','/Home/Cursos/18',0,'2026-04-23 09:17:48'),(58,11,'alumno','Nuevo vídeo subido en el curso Deep Learning y Redes Neuronales','/Home/Cursos/18',0,'2026-04-23 09:17:48'),(59,10,'alumno','Nuevo ejercicio subido en el curso Deep Learning y Redes Neuronales','/Home/Cursos/18',0,'2026-04-23 09:33:02'),(60,11,'alumno','Nuevo ejercicio subido en el curso Deep Learning y Redes Neuronales','/Home/Cursos/18',0,'2026-04-23 09:33:02'),(61,10,'alumno','Nuevo apunte subido en el curso Deep Learning y Redes Neuronales','/Home/Cursos/18',0,'2026-04-23 09:33:54'),(62,11,'alumno','Nuevo apunte subido en el curso Deep Learning y Redes Neuronales','/Home/Cursos/18',0,'2026-04-23 09:33:54'),(63,10,'alumno','Nuevo ejercicio subido en el curso Deep Learning y Redes Neuronales','/Home/Cursos/18',0,'2026-04-23 09:37:42'),(64,11,'alumno','Nuevo ejercicio subido en el curso Deep Learning y Redes Neuronales','/Home/Cursos/18',0,'2026-04-23 09:37:42'),(65,10,'alumno','Nuevo ejercicio subido en el curso Deep Learning y Redes Neuronales','/Home/Cursos/18',0,'2026-04-23 09:43:20'),(66,11,'alumno','Nuevo ejercicio subido en el curso Deep Learning y Redes Neuronales','/Home/Cursos/18',0,'2026-04-23 09:43:20'),(68,7,'alumno','Nuevo apunte subido en el curso IA para Principiantes','/Home/Cursos/16',0,'2026-04-24 07:39:01'),(71,7,'alumno','Nuevo apunte subido en el curso IA para Principiantes','/Home/Cursos/16',0,'2026-04-24 07:40:31'),(74,7,'alumno','Nuevo apunte subido en el curso IA para Principiantes','/Home/Cursos/16',0,'2026-04-24 07:41:24'),(77,7,'alumno','Nuevo apunte subido en el curso IA para Principiantes','/Home/Cursos/16',0,'2026-04-24 07:57:05'),(80,7,'alumno','Nuevo apunte subido en el curso IA para Principiantes','/Home/Cursos/16',0,'2026-04-24 07:58:39'),(83,7,'alumno','Nuevo ejercicio subido en el curso IA para Principiantes','/Home/Cursos/16',0,'2026-04-24 07:59:04'),(86,7,'alumno','Nuevo apunte subido en el curso IA para Principiantes','/Home/Cursos/16',0,'2026-04-24 08:00:07'),(91,7,'alumno','Nuevo apunte subido en el curso IA para Principiantes','/Home/Cursos/16',0,'2026-04-24 08:02:28'),(94,7,'alumno','Nuevo vídeo subido en el curso IA para Principiantes','/Home/Cursos/16',0,'2026-04-24 08:04:41'),(101,6,'alumno','Nuevo apunte subido en el curso IA para Principiantes','/Home/Cursos/16',0,'2026-04-30 08:20:58'),(102,7,'alumno','Nuevo apunte subido en el curso IA para Principiantes','/Home/Cursos/16',0,'2026-04-30 08:20:58'),(104,22,'alumno','Nuevo apunte subido en el curso IA para Principiantes','/Home/Cursos/16',0,'2026-04-30 08:20:58'),(105,6,'alumno','Nuevo apunte subido en el curso IA para Principiantes','/Home/Cursos/16',0,'2026-04-30 08:21:09'),(106,7,'alumno','Nuevo apunte subido en el curso IA para Principiantes','/Home/Cursos/16',0,'2026-04-30 08:21:09'),(108,22,'alumno','Nuevo apunte subido en el curso IA para Principiantes','/Home/Cursos/16',0,'2026-04-30 08:21:09'),(109,15,'profesor','El alumno Nico ha subido un apunte al curso IA para Principiantes','/Home/Cursos/16',0,'2026-05-04 11:26:42');
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
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
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
) ENGINE=InnoDB AUTO_INCREMENT=92 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `profesorescursos`
--

LOCK TABLES `profesorescursos` WRITE;
/*!40000 ALTER TABLE `profesorescursos` DISABLE KEYS */;
INSERT INTO `profesorescursos` VALUES (62,1,1),(63,1,2),(64,1,3),(65,2,4),(66,2,5),(67,2,6),(68,3,7),(69,3,8),(70,3,9),(71,4,10),(72,4,11),(73,4,12),(74,5,13),(75,5,14),(76,5,15),(77,6,16),(78,6,17),(79,6,18),(80,7,19),(81,7,20),(82,7,21),(83,8,22),(84,8,23),(85,8,24),(89,6,62),(90,6,63),(91,6,64);
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
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `puntuacionesejercicios`
--

LOCK TABLES `puntuacionesejercicios` WRITE;
/*!40000 ALTER TABLE `puntuacionesejercicios` DISABLE KEYS */;
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
) ENGINE=InnoDB AUTO_INCREMENT=63 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuarios`
--

LOCK TABLES `usuarios` WRITE;
/*!40000 ALTER TABLE `usuarios` DISABLE KEYS */;
INSERT INTO `usuarios` VALUES (1,'profesor'),(2,'profesor'),(3,'profesor'),(4,'profesor'),(5,'profesor'),(6,'alumno'),(7,'alumno'),(8,'alumno'),(9,'alumno'),(10,'alumno'),(11,'alumno'),(12,'alumno'),(13,'alumno'),(14,'administrador'),(15,'profesor'),(16,'alumno'),(22,'alumno'),(23,'alumno'),(24,'alumno'),(25,'alumno'),(26,'alumno'),(27,'alumno'),(28,'alumno'),(29,'alumno'),(30,'alumno'),(31,'alumno'),(32,'alumno'),(33,'alumno'),(34,'alumno'),(35,'alumno'),(36,'alumno'),(37,'alumno'),(38,'profesor'),(39,'profesor');
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
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `videos`
--

LOCK TABLES `videos` WRITE;
/*!40000 ALTER TABLE `videos` DISABLE KEYS */;
INSERT INTO `videos` VALUES (4,6,16,'Video prueba','https://res.cloudinary.com/dge59jbqb/video/upload/v1777017879/nebriacademy/videos/WhatsApp_Video_2025-11-25_at_13.42.22.mp4');
/*!40000 ALTER TABLE `videos` ENABLE KEYS */;
UNLOCK TABLES;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-05-05  9:13:44
