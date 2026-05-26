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
INSERT INTO `administradores` VALUES (1,14,'00000000Z','Admin','Principal','admin@nebriacademy.com','admin123','ES1285556289048346478903','600008439323840243536226','@admin','España','Madrid');
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
) ENGINE=InnoDB AUTO_INCREMENT=81 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `alumnos`
--

LOCK TABLES `alumnos` WRITE;
/*!40000 ALTER TABLE `alumnos` DISABLE KEYS */;
INSERT INTO `alumnos` VALUES (1,6,'Juan','Fernández Gómez','66666666F','juan.fernandez@alumnos.nebrija.es','alumno123','4111111111111111','600666777','@juan_alum','España','Madrid',0,NULL),(2,7,'María','Rodríguez Díaz','77777777G','maria.rodriguez@gmail.com','alumno456','4222222222222222','600777888','@maria_alum','España','Sevilla',0,NULL),(3,8,'Pedro','López Torres','88888888H','pedro.lopez@alumnos.nebrija.es','alumno789','4333333333333333','600888999','@pedro_alum','España','Bilbao',0,NULL),(4,9,'Sofía','Gómez Ruiz','99999999I','sofia.gomez@hotmail.com','alumno000','4444444444444444','600999000','@sofia_alum','España','Zaragoza',0,NULL),(5,10,'David','Hernández Martín','10101010J','david.hernandez@alumnos.nebrija.es','alumno111','4555555555555555','601010101','@david_alum','España','Granada',0,NULL),(6,11,'Lucía','Pérez García','11111112K','lucia.perez@outlook.com','alumno222','4666666666666666','601111112','@lucia_alum','España','Valencia',0,NULL),(7,12,'Pablo','González Sánchez','12121212L','pablo.gonzalez@yahoo.com','alumno333','4777777777777777','601212121','@pablo_alum','España','Barcelona',0,NULL),(8,13,'Carmen','Díaz Navarro','13131313M','carmen.diaz@alumnos.nebrija.es','alumno444','4888888888888888','601313131','@carmen_alum','España','Málaga',0,NULL),(9,16,'Nico','Samp','13672984F','nico@example.com','pass123','488888848853221','720178056','@nico_alum','España','Bilbao',0,NULL),(13,22,'Ana','García López','11111111A',NULL,NULL,NULL,'600111222','@ana_prof','España','Madrid',1,1),(14,23,'Carlos','Martínez Ruiz','22222222B',NULL,NULL,NULL,'600222333','@carlos_prof','España','Barcelona',1,2),(15,24,'Laura','Sánchez Pérez','33333333C',NULL,NULL,NULL,'600333444','@laura_prof','España','Valencia',1,3),(16,25,'Miguel','Rodríguez Gómez','44444444D',NULL,NULL,NULL,'600444555','@miguel_prof','España','Sevilla',1,4),(17,26,'Elena','Fernández Torres','55555555E',NULL,NULL,NULL,'600555666','@elena_prof','España','Bilbao',1,5),(18,27,'Arturo','Arturez','66666660F',NULL,NULL,NULL,'','','España','Madrid',1,6),(19,28,'Luis','Martínez Soto','20202020L','luis.martinez@alumnos.nebrija.es','alumno555','4999999999999999','601234567','@luis_alum','España','Madrid',0,NULL),(20,29,'Sara','Gómez Navarro','21212121M','sara.gomez@gmail.com','alumno666','5000000000000000','601345678','@sara_alum','España','Sevilla',0,NULL),(21,30,'Miguel','Pérez López','22222223N','miguel.perez@alumnos.nebrija.es','alumno777','5111111111111111','601456789','@miguel_alum','España','Barcelona',0,NULL),(22,31,'Elena','Rodríguez Sánchez','23232323O','elena.rodriguez@hotmail.com','alumno888','5222222222222222','601567890','@elena_alum','España','Valencia',0,NULL),(23,32,'Javier','Fernández Díaz','24242424P','javier.fernandez@alumnos.nebrija.es','alumno999','5333333333333333','601678901','@javier_alum','España','Granada',0,NULL),(24,33,'Laura','Sánchez Ruiz','25252525Q','laura.sanchez@yahoo.com','alumno000','5444444444444444','601789012','@laura_alum','España','Bilbao',0,NULL),(25,34,'Carlos','García Martín','26262626R','carlos.garcia@alumnos.nebrija.es','alumno111','5555555555555555','601890123','@carlos_alum','España','Zaragoza',0,NULL),(26,35,'Isabel','López Torres','27272727S','isabel.lopez@outlook.com','alumno222','5666666666666666','601901234','@isabel_alum','España','Málaga',0,NULL),(27,36,'Pablo','Hernández Gómez','28282828T','pablo.hernandez@alumnos.nebrija.es','alumno333','5777777777777777','602012345','@pablo_alum','España','Madrid',0,NULL),(28,37,'Carmen','Díaz Pérez','29292929U','carmen.diaz@gmail.com','alumno444','5888888888888888','602123456','@carmen_alum','España','Sevilla',0,NULL),(29,38,'Raquel','López Vega','77000001G',NULL,NULL,NULL,'601111223','@raquel_prof','España','Madrid',1,7),(30,39,'Diego','Morales Ruiz','88000002H',NULL,NULL,NULL,'601222334','@diego_prof','España','Barcelona',1,8),(46,64,'Hola','Adios','fsfafda32r','hola@alumnos.nebrija.es','Messi',NULL,NULL,NULL,'Alemania','Madrid',0,NULL),(52,72,'Carl','Martinez','09370353G','carlos.martinez@profesores.nebrija.es','prof456','029832e3627e3',NULL,NULL,'Alemania','Sevilla',0,NULL),(54,75,'Alumnos','Nebrija','12345678L','alumno@alumnos.nebrija.es','hola','','','','España','Madrid',0,NULL),(56,78,NULL,NULL,NULL,'alumDF@alumnos.nebrija.es','AbPR98PP',NULL,NULL,NULL,NULL,NULL,0,NULL),(57,80,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,1,25),(70,100,'Alejandro','Castro Romero','70707070A','alejandro.castro@alumnos.nebrija.es','demo1234','6000000000000001','611000001','@ale_alum','España','Madrid',0,NULL),(71,101,'Natalia','Jiménez Blanco','71717171B','natalia.jimenez@alumnos.nebrija.es','demo1234','6000000000000002','611000002','@nat_alum','España','Valencia',0,NULL),(72,102,'Rodrigo','Serrano Fuentes','72727272C','rodrigo.serrano@alumnos.nebrija.es','demo1234','6000000000000003','611000003','@rod_alum','España','Bilbao',0,NULL),(73,103,'Claudia','Reyes Iglesias','73737373D','claudia.reyes@alumnos.nebrija.es','demo1234','6000000000000004','611000004','@clau_alum','España','Sevilla',0,NULL),(74,104,'Iván','Medina Ortega','74747474E','ivan.medina@alumnos.nebrija.es','demo1234','6000000000000005','611000005','@ivan_alum','España','Barcelona',0,NULL),(75,105,'Marta','Cano Delgado','75757575F','marta.cano@alumnos.nebrija.es','demo1234','6000000000000006','611000006','@marta_alum','España','Granada',0,NULL),(76,106,'Sergio','Ibáñez Mora','76767676G','sergio.ibanez@alumnos.nebrija.es','demo1234','6000000000000007','611000007','@sergio_alum','España','Málaga',0,NULL),(77,107,'Patricia','Vargas Leal','77777070H','patricia.vargas@alumnos.nebrija.es','demo1234','6000000000000008','611000008','@patri_alum','España','Zaragoza',0,NULL),(78,108,'Roberto','Vega Molina','30303031R',NULL,NULL,NULL,'600300400','@roberto_prof','España','Madrid',1,30),(79,109,'Patricia','Núñez Castillo','31313132S',NULL,NULL,NULL,'600300401','@patricia_prof','España','Zaragoza',1,31);
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
) ENGINE=InnoDB AUTO_INCREMENT=111 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `apuntes`
--

LOCK TABLES `apuntes` WRITE;
/*!40000 ALTER TABLE `apuntes` DISABLE KEYS */;
INSERT INTO `apuntes` VALUES (21,16,16,'Prueba 2-','https://res.cloudinary.com/dge59jbqb/image/upload/v1777017631/nebriacademy/apuntes/5.3_-_Mejores_pr__cticas_y_patrones_de_dise__o.pdf','Prueba 2-','Inteligencia Artificial',3),(31,16,NULL,'Una prueba de apunte','https://res.cloudinary.com/dge59jbqb/image/upload/v1777017423/nebriacademy/apuntes/5.2_-_Pinia_con_TypeScript.pdf','Lorem ipsum dolor sit amet consectetur adipisicing elit.plica?','BDD',2),(32,16,NULL,'Un titulo muuuuy largo de apunte','https://res.cloudinary.com/dge59jbqb/image/upload/v1777017631/nebriacademy/apuntes/5.3_-_Mejores_pr__cticas_y_patrones_de_dise__o.pdf','Lorem iam labore natus, earum laudantium. Dolor ipsum explicabo iste perferendis tempora?','Ciberseguridad',1),(47,15,16,'Apunte prueba notificaciones ','https://res.cloudinary.com/dge59jbqb/raw/upload/v1779695406/nebriacademy/apuntes/Texto_DAFO','Prueba','Inteligencia Artificial',2),(48,16,16,'Prueba','https://res.cloudinary.com/dge59jbqb/raw/upload/v1779696611/nebriacademy/apuntes/Credenciales_cuenta_nebrija_practicas','faaf','Inteligencia Artificial',4),(49,16,NULL,'Un apunte','https://res.cloudinary.com/dge59jbqb/raw/upload/v1779699400/nebriacademy/apuntes/Tecnolog__as_utilizadas','Un apunte de ejemplo','Programación',1),(51,15,16,'Prueba apunte 1','https://res.cloudinary.com/dge59jbqb/image/upload/v1779702076/nebriacademy/apuntes/Actividad_1_Power_Bi.pdf','Descripción apunte 1','Inteligencia Artificial',4),(52,15,16,'Prueba apunte 2','https://res.cloudinary.com/dge59jbqb/raw/upload/v1779702121/nebriacademy/apuntes/Tecnolog__as_utilizadas','Descripción prueba apunte 2','Inteligencia Artificial',3),(53,22,16,'Prueba apunte desde versión alumno','https://res.cloudinary.com/dge59jbqb/image/upload/v1779714877/nebriacademy/apuntes/manual-identidad-nebrija.pdf','Prueba a subir un apunte desde la versión de alumno','Inteligencia Artificial',3),(54,107,NULL,'Inicio en Diseño y UX','https://res.cloudinary.com/dge59jbqb/raw/upload/v1779716289/nebriacademy/apuntes/Paso_a_tablas_nebriAcademy','Este es el primer tema del curso de Diseño y UX de hace unos años ','Diseño y UX',4),(55,6,NULL,'Apuntes clase Lunes de Desarrollo','https://res.cloudinary.com/dge59jbqb/raw/upload/v1779716365/nebriacademy/apuntes/Population','Apuntes de la clase de Desarrollo de Juan Antonio','Desarrollo',1),(56,36,16,'Como usar la IA de manera eficiente','https://res.cloudinary.com/dge59jbqb/image/upload/v1779719157/nebriacademy/apuntes/Servidor_Apache_estatico.pdf','Con estas instrucciones aprenderás a hacer peticiones a cualquier inteligencia artificial y recibirás una respuesta optima','Inteligencia Artificial',2),(57,1,1,'Apuntes Python 1','https://res.cloudinary.com/dge59jbqb/image/upload/v1779738450/nebriacademy/apuntes/Mercury-Tasky_Panfleto.pdf','Tema 1 Python 2023','Programación',0),(58,1,1,'Apuntes Python 2','https://res.cloudinary.com/dge59jbqb/raw/upload/v1779738497/nebriacademy/apuntes/Diagrama_de_Gantt','Tema 2 Python 2023','Programación',0),(59,1,2,'Javascript 2026 parte 1','https://res.cloudinary.com/dge59jbqb/raw/upload/v1779739267/nebriacademy/apuntes/Texto_DAFO__1_','Cambios en Javascript respecto a versiones antiguas','Programación',0),(60,1,2,'Javascript 2026 parte 2','https://res.cloudinary.com/dge59jbqb/image/upload/v1779739778/nebriacademy/apuntes/EJERCICIO_ENTORNO_LABORAL.pdf','Cambios en Javascript respecto a versiones antiguas parte 2','Programación',0),(61,1,3,'Técnicas avanzadas de software','https://res.cloudinary.com/dge59jbqb/raw/upload/v1779741054/nebriacademy/apuntes/Presentaci__n_ingl__s','','Programación',0),(62,1,3,'Técnicas avanzadas de software 2','https://res.cloudinary.com/dge59jbqb/image/upload/v1779741265/nebriacademy/apuntes/ACTIVIDADES_CLASE_UNIDAD_1_PRL.pdf','','Programación',0),(63,111,28,'Introducción al curso','https://res.cloudinary.com/dge59jbqb/image/upload/v1779741829/nebriacademy/apuntes/PROPUESTA_UNIFICADA_WEB_GRADOS_ONLINE.pdf','¿Que se va ha aprender en este curso?','Ciberseguridad',0),(64,111,28,'Tema 2 Forense Digital y Respuesta a Inc.','https://res.cloudinary.com/dge59jbqb/raw/upload/v1779702121/nebriacademy/apuntes/Tecnolog__as_utilizadas','','Ciberseguridad',0),(65,111,27,'Teoría de la ciberseguridad 1','https://res.cloudinary.com/dge59jbqb/image/upload/v1779744275/nebriacademy/apuntes/DATOS_PROPUESTA_BECARIO_rellenable.pdf','Tema 1','Ciberseguridad',0),(66,111,27,'Teoría de la ciberseguridad  2','https://res.cloudinary.com/dge59jbqb/raw/upload/v1779744296/nebriacademy/apuntes/Countries','Tema 2','Ciberseguridad',0),(67,2,4,'SQL Fundamentos: SELECT, WHERE y JOINs','https://res.cloudinary.com/dge59jbqb/raw/upload/nebriacademy/apuntes/sql_fundamentos_t1','Tema 1: consultas básicas y operadores de filtrado','BDD',0),(68,2,4,'SQL Fundamentos: Diseño Relacional y Claves','https://res.cloudinary.com/dge59jbqb/raw/upload/nebriacademy/apuntes/sql_fundamentos_t2','Tema 2: claves primarias, foráneas y normalización básica','BDD',0),(69,2,5,'Modelado ER: Entidades, Relaciones y Atributos','https://res.cloudinary.com/dge59jbqb/raw/upload/nebriacademy/apuntes/modelado_er_t1','Tema 1: diagramas entidad-relación desde cero','BDD',0),(70,2,5,'Normalización: 1FN, 2FN y 3FN','https://res.cloudinary.com/dge59jbqb/raw/upload/nebriacademy/apuntes/modelado_er_t2','Tema 2: formas normales y reducción de redundancias','BDD',0),(71,2,6,'Optimización SQL: Índices y Planes de Ejecución','https://res.cloudinary.com/dge59jbqb/raw/upload/nebriacademy/apuntes/tuning_t1','Tema 1: tipos de índices y cómo mejorar el rendimiento','BDD',0),(72,2,6,'Tuning Avanzado: Particionado y Caché','https://res.cloudinary.com/dge59jbqb/raw/upload/nebriacademy/apuntes/tuning_t2','Tema 2: estrategias avanzadas de optimización en producción','BDD',0),(73,3,7,'Conceptos Esenciales de Ciberseguridad','https://res.cloudinary.com/dge59jbqb/raw/upload/nebriacademy/apuntes/ciberseg_fund_t1','Tema 1: amenazas, vectores de ataque y defensa básica','Ciberseguridad',0),(74,3,7,'Criptografía y Protocolos Seguros','https://res.cloudinary.com/dge59jbqb/raw/upload/nebriacademy/apuntes/ciberseg_fund_t2','Tema 2: SSL/TLS, cifrado simétrico y asimétrico','Ciberseguridad',0),(75,3,8,'Seguridad en Redes: Firewalls y DMZ','https://res.cloudinary.com/dge59jbqb/raw/upload/nebriacademy/apuntes/seg_redes_t1','Tema 1: arquitecturas de red seguras y configuración de firewalls','Ciberseguridad',0),(76,3,8,'VPNs, IDS e IPS: Monitorización del Tráfico','https://res.cloudinary.com/dge59jbqb/raw/upload/nebriacademy/apuntes/seg_redes_t2','Tema 2: detección de intrusiones y túneles cifrados','Ciberseguridad',0),(77,3,9,'Hacking Ético: Fases del Pentesting','https://res.cloudinary.com/dge59jbqb/raw/upload/nebriacademy/apuntes/hacking_etico_t1','Tema 1: reconocimiento, escaneo y explotación controlada','Ciberseguridad',0),(78,3,9,'Herramientas de Pentesting: Metasploit y Burp Suite','https://res.cloudinary.com/dge59jbqb/raw/upload/nebriacademy/apuntes/hacking_etico_t2','Tema 2: uso ético de las principales herramientas de seguridad ofensiva','Ciberseguridad',0),(79,4,10,'Fundamentos de Diseño UI: Teoría del Color','https://res.cloudinary.com/dge59jbqb/raw/upload/nebriacademy/apuntes/diseno_ui_t1','Tema 1: paletas, contraste y accesibilidad visual','Diseño y UX',0),(80,4,10,'Tipografía y Jerarquía Visual en UI','https://res.cloudinary.com/dge59jbqb/raw/upload/nebriacademy/apuntes/diseno_ui_t2','Tema 2: tipografías, ritmo vertical y legibilidad','Diseño y UX',0),(81,4,11,'Figma: Componentes, Auto Layout y Variables','https://res.cloudinary.com/dge59jbqb/raw/upload/nebriacademy/apuntes/figma_t1','Tema 1: estructura de un proyecto en Figma y sistema de diseño','Diseño y UX',0),(82,4,11,'Prototipado Interactivo con Figma','https://res.cloudinary.com/dge59jbqb/raw/upload/nebriacademy/apuntes/figma_t2','Tema 2: conexiones, transiciones y presentación de prototipos','Diseño y UX',0),(83,4,12,'UX Research: Entrevistas y Card Sorting','https://res.cloudinary.com/dge59jbqb/raw/upload/nebriacademy/apuntes/ux_research_t1','Tema 1: métodos cualitativos de investigación con usuarios','Diseño y UX',0),(84,4,12,'Tests de Usabilidad y Métricas UX','https://res.cloudinary.com/dge59jbqb/raw/upload/nebriacademy/apuntes/ux_research_t2','Tema 2: SUS, NPS y análisis de resultados de tests','Diseño y UX',0),(85,5,13,'Marketing Digital: Funnels y Buyer Persona','https://res.cloudinary.com/dge59jbqb/raw/upload/nebriacademy/apuntes/marketing_t1','Tema 1: estrategia de contenidos y definición del cliente ideal','Marketing',0),(86,5,13,'Redes Sociales y Email Marketing','https://res.cloudinary.com/dge59jbqb/raw/upload/nebriacademy/apuntes/marketing_t2','Tema 2: planificación de publicaciones y campañas de email','Marketing',0),(87,5,14,'SEO On-Page: Keywords y Estructura Web','https://res.cloudinary.com/dge59jbqb/raw/upload/nebriacademy/apuntes/seo_sem_t1','Tema 1: investigación de palabras clave y optimización técnica','Marketing',0),(88,5,14,'SEM con Google Ads: Campañas y Pujas','https://res.cloudinary.com/dge59jbqb/raw/upload/nebriacademy/apuntes/seo_sem_t2','Tema 2: estructura de campañas, grupos de anuncios y estrategias de puja','Marketing',0),(89,5,15,'Growth Hacking: North Star Metric y OKRs','https://res.cloudinary.com/dge59jbqb/raw/upload/nebriacademy/apuntes/growth_t1','Tema 1: definir métricas clave y objetivos de crecimiento','Marketing',0),(90,5,15,'A/B Testing y Experimentación en Marketing','https://res.cloudinary.com/dge59jbqb/raw/upload/nebriacademy/apuntes/growth_t2','Tema 2: diseño de experimentos y análisis estadístico de resultados','Marketing',0),(91,15,17,'Machine Learning: Algoritmos Supervisados','https://res.cloudinary.com/dge59jbqb/raw/upload/nebriacademy/apuntes/ml_practico_t1','Tema 1: regresión, clasificación y evaluación de modelos','Inteligencia Artificial',0),(92,15,17,'Pipelines con Scikit-learn y Validación Cruzada','https://res.cloudinary.com/dge59jbqb/raw/upload/nebriacademy/apuntes/ml_practico_t2','Tema 2: pipelines de preprocesamiento y estrategias de validación','Inteligencia Artificial',0),(93,15,18,'Deep Learning: Redes Neuronales y Backpropagation','https://res.cloudinary.com/dge59jbqb/raw/upload/nebriacademy/apuntes/deep_learning_t1','Tema 1: fundamentos matemáticos y arquitectura de una red neuronal','Inteligencia Artificial',0),(94,15,18,'CNNs con TensorFlow: Clasificación de Imágenes','https://res.cloudinary.com/dge59jbqb/raw/upload/nebriacademy/apuntes/deep_learning_t2','Tema 2: redes convolucionales y entrenamiento con datos reales','Inteligencia Artificial',0),(95,38,19,'HTML5 Semántico y Accesibilidad Web','https://res.cloudinary.com/dge59jbqb/raw/upload/nebriacademy/apuntes/html_css_js_t1','Tema 1: etiquetas semánticas, ARIA y buenas prácticas','Desarrollo',0),(96,38,19,'CSS Moderno: Flexbox, Grid y Animaciones','https://res.cloudinary.com/dge59jbqb/raw/upload/nebriacademy/apuntes/html_css_js_t2','Tema 2: maquetación responsive y transiciones CSS','Desarrollo',0),(97,38,20,'React: Componentes, Hooks y Estado Global','https://res.cloudinary.com/dge59jbqb/raw/upload/nebriacademy/apuntes/frameworks_t1','Tema 1: arquitectura de aplicaciones React con Context y Zustand','Desarrollo',0),(98,38,20,'Vue 3: Composition API y Pinia','https://res.cloudinary.com/dge59jbqb/raw/upload/nebriacademy/apuntes/frameworks_t2','Tema 2: reactividad en Vue 3 y gestión del estado con Pinia','Desarrollo',0),(99,38,21,'MERN Stack: MongoDB y Express REST API','https://res.cloudinary.com/dge59jbqb/raw/upload/nebriacademy/apuntes/mern_t1','Tema 1: diseño de APIs RESTful con Node, Express y MongoDB','Desarrollo',0),(100,38,21,'MERN Stack: React Frontend y Despliegue','https://res.cloudinary.com/dge59jbqb/raw/upload/nebriacademy/apuntes/mern_t2','Tema 2: conexión frontend-backend y despliegue en la nube','Desarrollo',0),(101,39,22,'Data Science: Estadística Descriptiva con Python','https://res.cloudinary.com/dge59jbqb/raw/upload/nebriacademy/apuntes/data_science_t1','Tema 1: media, varianza, correlación y visualización básica','Data Science',0),(102,39,22,'Análisis Exploratorio: Matplotlib y Seaborn','https://res.cloudinary.com/dge59jbqb/raw/upload/nebriacademy/apuntes/data_science_t2','Tema 2: gráficos para explorar distribuciones y relaciones entre variables','Data Science',0),(103,39,23,'Pandas: Carga, Limpieza y Transformación de Datos','https://res.cloudinary.com/dge59jbqb/raw/upload/nebriacademy/apuntes/pandas_t1','Tema 1: DataFrames, manejo de nulos y operaciones vectorizadas','Data Science',0),(104,39,23,'Pandas Avanzado: GroupBy, Merge y Pivot Tables','https://res.cloudinary.com/dge59jbqb/raw/upload/nebriacademy/apuntes/pandas_t2','Tema 2: agregaciones, combinación de datasets y tablas dinámicas','Data Science',0),(105,39,24,'Big Data: Arquitectura Hadoop y HDFS','https://res.cloudinary.com/dge59jbqb/raw/upload/nebriacademy/apuntes/bigdata_t1','Tema 1: ecosistema Hadoop, HDFS y procesamiento distribuido','Data Science',0),(106,39,24,'Apache Spark: RDDs, DataFrames y Spark SQL','https://res.cloudinary.com/dge59jbqb/raw/upload/nebriacademy/apuntes/bigdata_t2','Tema 2: transformaciones y acciones en Spark con PySpark','Data Science',0),(107,110,25,'Ensemble Methods: Random Forest, XGBoost y LightGBM','https://res.cloudinary.com/dge59jbqb/raw/upload/nebriacademy/apuntes/ml_avanzado_t1','Tema 1: bagging, boosting y técnicas de stacking','Data Science',0),(108,110,25,'AutoML: H2O, TPOT y Optimización de Hiperparámetros','https://res.cloudinary.com/dge59jbqb/raw/upload/nebriacademy/apuntes/ml_avanzado_t2','Tema 2: búsqueda automática de modelos y ajuste fino','Data Science',0),(109,110,26,'R y Tidyverse: dplyr, tidyr y ggplot2','https://res.cloudinary.com/dge59jbqb/raw/upload/nebriacademy/apuntes/r_t1','Tema 1: manipulación de datos y visualización en R','Data Science',0),(110,110,26,'Modelado Estadístico con R: Regresión y ANOVA','https://res.cloudinary.com/dge59jbqb/raw/upload/nebriacademy/apuntes/r_t2','Tema 2: modelos lineales, supuestos y diagnóstico de residuos','Data Science',0);
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
) ENGINE=InnoDB AUTO_INCREMENT=108 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `apuntesalumnos`
--

LOCK TABLES `apuntesalumnos` WRITE;
/*!40000 ALTER TABLE `apuntesalumnos` DISABLE KEYS */;
INSERT INTO `apuntesalumnos` VALUES (20,9,21,1),(24,13,21,1),(33,9,31,1),(35,18,21,1),(39,18,31,1),(40,18,32,1),(42,54,21,NULL),(43,1,31,1),(44,1,32,1),(46,2,21,1),(48,2,49,1),(49,3,32,1),(50,3,47,1),(51,3,51,1),(52,5,21,1),(53,5,48,1),(54,5,52,1),(55,19,31,1),(57,19,51,1),(58,70,21,1),(59,70,31,1),(60,70,32,1),(62,70,49,1),(63,1,31,1),(64,1,32,1),(66,2,21,1),(68,2,49,1),(69,3,32,1),(70,3,47,1),(71,3,51,1),(72,5,21,1),(73,5,48,1),(74,5,52,1),(75,19,31,1),(77,19,51,1),(78,70,21,1),(79,70,31,1),(80,70,32,1),(82,70,49,1),(83,9,48,1),(84,9,47,1),(85,9,52,1),(86,13,48,1),(87,13,49,NULL),(88,13,51,1),(89,13,52,1),(90,1,48,1),(91,1,51,1),(92,1,52,1),(93,1,47,1),(94,13,53,1),(95,9,49,1),(96,77,54,1),(97,1,54,1),(98,1,55,1),(99,18,51,1),(100,18,54,1),(101,9,54,1),(102,27,56,1),(103,27,53,1),(104,54,51,1),(105,54,48,1),(106,54,53,1),(107,54,56,1);
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
) ENGINE=InnoDB AUTO_INCREMENT=116 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `comentarioalumnocurso`
--

LOCK TABLES `comentarioalumnocurso` WRITE;
/*!40000 ALTER TABLE `comentarioalumnocurso` DISABLE KEYS */;
INSERT INTO `comentarioalumnocurso` VALUES (25,6,1,'Excelente curso para empezar desde cero.'),(26,7,1,'Muy bien explicado el profesor, ritmo perfecto.'),(27,8,2,'Me encantó la parte de asincronía y promesas.'),(28,10,4,'SQL nunca fue tan fácil de entender.'),(29,12,7,'Conceptos claros y ejemplos muy prácticos.'),(30,22,10,'Figma es una herramienta increíble, gracias.'),(31,24,13,'Estrategias claras y aplicables a mi negocio.'),(32,26,16,'La IA está de moda y este curso la explica genial.'),(33,28,19,'Base sólida para luego saltar a frameworks.'),(34,30,22,'Data Science es el futuro, buenísimo el contenido.'),(35,9,5,'El modelado de datos cambió mi forma de trabajar.'),(36,11,17,'Machine learning explicado paso a paso, sin rodeos.'),(37,13,20,'SEO práctico y directo al grano. Lo recomiendo.'),(39,16,24,'Spark potente, curso muy completo y actualizado.'),(62,16,16,'Buen curso para empezar a entender más sobre la IA.'),(64,100,1,'El curso de Python me ha abierto las puertas a la programación.'),(66,102,16,'Me sorprendió lo accesible que es la IA cuando la explican bien.'),(70,106,27,'OWASP Top 10 explicado con ejemplos reales. Muy útil para el trabajo.'),(72,108,20,'React y Vue juntos en un curso, brutal la comparativa práctica.'),(75,7,1,'Conseguí mi primer script funcional en la semana 2.'),(76,8,1,'Muy bien estructurado, va de menos a más perfectamente.'),(77,100,1,'El curso de Python me ha abierto las puertas a la programación.'),(78,101,1,'Las explicaciones son muy claras, ideal para principiantes.'),(79,102,1,'Me ha servido para entender la lógica de programación desde cero.'),(80,6,2,'Las promesas y async/await explicadas mejor que en ningún sitio.'),(81,9,2,'Perfecto para dar el salto de JS básico a ES6+.'),(82,101,2,'JavaScript moderno es imprescindible, el profesor lo explica genial.'),(83,103,2,'Me gustó mucho la parte de destructuring y spread operator.'),(84,100,3,'Los microservicios quedan muy claros con los diagramas del curso.'),(85,101,3,'Muy útil para entender cómo escalan las aplicaciones grandes.'),(86,6,4,'Empecé sin saber nada de SQL y ahora me manejo bien con JOINs.'),(87,100,4,'Muy buen ritmo, los ejercicios prácticos son lo mejor del curso.'),(90,9,7,'Muy buena introducción, me ha picado el gusanillo de la seguridad.'),(91,75,7,'Conceptos esenciales explicados sin complicar demasiado.'),(92,6,16,'La IA está de moda y este curso la explica muy bien desde cero.'),(93,7,16,'Me encantó la parte de ética en IA, muy necesaria hoy en día.'),(94,8,16,'Los ejemplos prácticos de ML son muy ilustrativos.'),(96,103,16,'Perfecta base para quien quiere entrar en el mundo del ML.'),(97,104,16,'Muy buen punto de partida antes de meterse con Python y sklearn.'),(98,9,17,'Scikit-learn bien explicado, con pipelines reales de principio a fin.'),(99,75,17,'La evaluación de modelos es la parte más útil del curso.'),(100,9,20,'La comparativa entre React y Vue es brutal, muy útil.'),(101,70,20,'Ahora entiendo por qué React domina el mercado laboral.'),(102,108,20,'React y Vue juntos en un curso, brutal la comparativa práctica.'),(103,72,22,'El análisis exploratorio me ha cambiado la forma de ver los datos.'),(104,109,22,'Data Science desde cero, con mucha paciencia y ejemplos claros.'),(105,104,25,'Machine Learning Avanzado, al nivel de cualquier curso de pago.'),(108,105,26,'R me costó al principio, pero con este curso todo tiene sentido.'),(113,107,28,'Forense digital es un área poco conocida, este curso la cubre muy bien.'),(114,75,28,'Volatility y Autopsy bien explicados, con casos prácticos reales.');
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
) ENGINE=InnoDB AUTO_INCREMENT=80 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cursos`
--

LOCK TABLES `cursos` WRITE;
/*!40000 ALTER TABLE `cursos` DISABLE KEYS */;
INSERT INTO `cursos` VALUES (1,'Python desde Cero','Programación',1,'Básico',0,'Aprende Python desde cero. Curso ideal para iniciarse.','photo1'),(2,'JavaScript Moderno','Programación',1,'Intermedio',0,'ES6+, asincronía y patrones de diseño.','photo2'),(3,'Arquitectura de Software','Programación',1,'Avanzado',0,'Microservicios y patrones avanzados.','photo3'),(4,'SQL Fundamentos','BDD',2,'Básico',0,'Consultas básicas y diseño relacional.','photo4'),(5,'Modelado de Bases de Datos','BDD',2,'Intermedio',0,'Normalización y diagramas ER avanzados.','photo5'),(6,'Optimización y Tuning','BDD',2,'Avanzado',0,'Indexación y rendimiento en motores SQL.','photo6'),(7,'Fundamentos de Ciberseguridad','Ciberseguridad',3,'Básico',0,'Conceptos esenciales de seguridad informática.','photo7'),(8,'Seguridad en Redes','Ciberseguridad',3,'Intermedio',1,'Firewalls, VPNs y análisis de tráfico.','photo8'),(9,'Hacking Ético Avanzado','Ciberseguridad',3,'Avanzado',0,'Pentesting profesional y explotación controlada.','photo9'),(10,'Introducción al Diseño UI','Diseño y UX',4,'Básico',0,'Principios de diseño visual y tipografía.','photo10'),(11,'Prototipado con Figma','Diseño y UX',4,'Intermedio',0,'Creación de wireframes y prototipos interactivos.','photo1'),(12,'UX Research Avanzado','Diseño y UX',4,'Avanzado',0,'Tests de usabilidad, métricas y psicología del usuario.','photo2'),(13,'Marketing Digital Básico','Marketing',5,'Básico',0,'Estrategias online, funnels y redes sociales.','photo3'),(14,'SEO y SEM Intermedio','Marketing',5,'Intermedio',0,'Posicionamiento orgánico y campañas pagadas.','photo4'),(15,'Growth Hacking y Analítica','Marketing',5,'Avanzado',0,'Métricas clave, A/B testing y experimentación.','photo5'),(16,'IA para Principiantes','Inteligencia Artificial',6,'Básico',5,'Conceptos básicos de IA, ML y ética.','photo6'),(17,'Machine Learning Práctico','Inteligencia Artificial',6,'Intermedio',0,'Scikit-learn, pipelines y evaluación de modelos.','photo7'),(18,'Deep Learning y Redes Neuronales','Inteligencia Artificial',6,'Avanzado',0,'TensorFlow, CNNs y arquitecturas profundas.','photo8'),(19,'HTML/CSS/JS Esencial','Desarrollo',7,'Básico',0,'Maquetación web semántica y DOM básico.','photo9'),(20,'Frameworks Frontend','Desarrollo',7,'Intermedio',2,'React, Vue y herramientas de desarrollo modernas.','photo10'),(21,'Desarrollo Full Stack MERN','Desarrollo',7,'Avanzado',0,'MongoDB, Express, React y Node.js integrados.','photo1'),(22,'Introducción a Data Science','Data Science',8,'Básico',1,'Análisis exploratorio y estadística aplicada.','photo2'),(23,'Análisis con Python y Pandas','Data Science',8,'Intermedio',1,'Manipulación, limpieza y visualización de datos.','photo3'),(24,'Big Data y Spark','Data Science',8,'Avanzado',2,'Procesamiento distribuido y entornos Hadoop/Spark.','photo4'),(25,'Machine Learning Avanzado','Data Science',30,'Avanzado',5,'Algoritmos avanzados, ensemble methods y AutoML.','photo5'),(26,'Análisis de Datos con R','Data Science',30,'Intermedio',3,'Tidyverse, ggplot2 y modelado estadístico con R.','photo6'),(27,'Seguridad en Aplicaciones Web','Ciberseguridad',31,'Intermedio',5,'OWASP Top 10, CSRF, XSS y buenas prácticas de desarrollo.','photo7'),(28,'Forense Digital y Respuesta a Inc.','Ciberseguridad',31,'Avanzado',3,'Análisis forense, cadena de custodia y gestión de incidentes.','photo8');
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
) ENGINE=InnoDB AUTO_INCREMENT=424 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cursosalumnos`
--

LOCK TABLES `cursosalumnos` WRITE;
/*!40000 ALTER TABLE `cursosalumnos` DISABLE KEYS */;
INSERT INTO `cursosalumnos` VALUES (182,1,1,1,1,NULL),(183,1,2,0,1,NULL),(184,2,3,1,1,1),(185,2,4,0,1,NULL),(186,3,5,1,1,NULL),(187,3,6,0,1,0),(188,4,7,1,1,NULL),(189,4,8,0,1,NULL),(190,5,9,1,1,1),(191,5,13,0,1,NULL),(192,6,14,1,1,NULL),(193,6,15,0,1,1),(194,7,16,1,1,NULL),(195,7,17,0,1,NULL),(196,8,18,1,0,NULL),(197,8,19,0,1,NULL),(198,9,20,1,1,NULL),(199,9,21,0,1,1),(200,10,22,1,1,NULL),(201,10,23,0,1,NULL),(202,11,24,1,1,1),(203,11,25,0,1,NULL),(204,12,26,1,1,NULL),(205,12,27,0,1,0),(206,13,28,1,1,NULL),(207,13,29,0,1,NULL),(208,14,30,1,1,1),(212,16,1,1,1,0),(213,16,2,0,1,NULL),(214,17,3,1,1,NULL),(215,17,4,0,1,1),(216,18,5,1,1,NULL),(217,18,6,0,1,NULL),(218,19,7,1,1,1),(219,19,8,0,1,NULL),(220,20,9,1,1,1),(221,20,13,0,1,0),(222,21,14,1,1,NULL),(223,21,15,0,1,NULL),(224,22,16,1,1,1),(225,22,17,0,1,NULL),(226,23,18,0,1,1),(227,23,19,0,1,NULL),(228,24,20,1,1,0),(229,24,21,0,1,1),(230,1,9,NULL,0,NULL),(231,16,9,1,1,1),(232,17,9,NULL,1,NULL),(233,1,18,NULL,1,NULL),(234,1,18,1,NULL,NULL),(235,24,18,1,NULL,1),(236,24,18,NULL,1,NULL),(237,22,18,1,1,1),(238,21,18,NULL,1,1),(239,21,18,1,NULL,NULL),(240,21,9,NULL,1,0),(241,22,9,1,1,NULL),(242,18,9,NULL,1,NULL),(243,23,9,0,0,NULL),(244,16,13,1,1,1),(245,24,9,NULL,0,1),(246,20,18,0,0,1),(249,2,9,NULL,1,1),(251,3,9,0,0,1),(253,6,9,0,0,NULL),(254,16,4,NULL,1,1),(255,1,70,1,1,4),(256,1,71,0,1,3),(257,1,72,1,1,5),(258,2,73,0,1,4),(259,2,74,1,1,5),(260,2,75,0,1,3),(261,3,76,1,1,4),(262,3,77,0,1,5),(263,4,78,1,1,3),(264,4,79,0,1,4),(265,16,70,1,1,5),(266,16,71,1,1,4),(267,16,72,0,1,5),(268,16,73,1,1,3),(269,16,74,0,1,4),(270,17,75,1,1,4),(271,17,76,0,1,5),(272,18,77,1,1,4),(273,18,78,0,1,3),(274,20,70,1,1,5),(275,20,71,0,1,4),(276,22,72,1,1,5),(277,22,73,0,1,4),(278,24,74,1,1,4),(279,24,75,0,1,5),(280,25,70,1,1,5),(281,25,71,1,1,4),(282,25,72,0,1,5),(283,25,73,1,1,3),(284,25,74,0,1,4),(285,25,75,1,1,5),(286,26,76,1,1,4),(287,26,77,0,1,3),(288,26,78,1,1,4),(289,26,79,0,1,5),(290,27,70,0,1,4),(291,27,71,1,1,5),(292,27,72,0,1,4),(293,27,73,1,1,5),(294,27,74,0,1,3),(295,28,75,1,1,4),(296,28,76,0,1,5),(297,28,77,1,1,4),(298,28,78,0,1,3),(299,28,79,1,1,5),(300,25,9,1,1,1),(301,1,3,1,1,5),(302,1,4,0,1,4),(303,1,5,1,1,3),(304,2,1,1,1,5),(305,2,2,0,1,4),(306,2,6,1,1,3),(307,3,1,0,1,4),(308,3,2,1,1,5),(309,3,7,0,1,3),(310,4,1,1,1,5),(311,4,2,0,1,3),(312,4,5,1,1,4),(313,5,1,1,1,4),(314,5,2,0,1,5),(315,5,6,1,1,3),(316,6,1,0,1,3),(317,6,2,1,1,4),(318,6,7,0,1,5),(319,7,1,1,1,4),(320,7,2,0,1,3),(321,7,9,1,1,5),(322,8,1,0,1,5),(323,8,2,1,1,4),(324,8,13,0,1,3),(325,10,1,1,1,5),(326,10,2,0,1,4),(327,10,9,1,1,3),(328,11,1,1,1,4),(329,11,2,0,1,5),(330,11,9,0,1,4),(331,12,1,0,1,3),(332,12,2,1,1,4),(333,12,9,1,1,5),(334,13,1,1,1,5),(335,13,2,0,1,4),(336,13,9,0,1,3),(337,14,1,1,1,4),(338,14,2,0,1,5),(339,14,9,1,1,4),(340,15,1,0,1,3),(341,15,2,1,1,4),(342,15,9,0,1,5),(343,16,3,1,1,5),(344,16,5,0,1,4),(345,16,6,1,1,3),(346,16,7,0,1,5),(347,16,8,1,1,4),(348,17,1,1,1,5),(349,17,2,0,1,4),(350,17,13,1,1,3),(351,18,1,1,1,4),(352,18,2,0,1,5),(353,18,13,0,1,4),(354,19,1,1,1,3),(355,19,2,0,1,4),(356,19,9,0,1,5),(357,19,13,1,1,4),(358,20,1,0,1,5),(359,20,2,1,1,4),(360,20,3,0,1,3),(361,20,4,1,1,5),(362,21,1,1,1,4),(363,21,2,0,1,3),(364,21,3,1,1,5),(365,21,4,0,1,4),(366,22,1,1,1,5),(367,22,2,0,1,4),(368,22,3,1,1,3),(369,22,4,0,1,5),(370,23,1,0,1,4),(371,23,2,1,1,5),(372,23,3,0,1,3),(373,23,4,1,1,4),(374,24,1,1,1,3),(375,24,2,0,1,5),(376,24,3,1,1,4),(377,24,4,0,1,3),(378,5,70,1,1,4),(379,5,71,0,1,5),(380,5,72,1,1,3),(381,6,73,0,1,4),(382,6,74,1,1,5),(383,7,75,1,1,3),(384,7,76,0,1,4),(385,8,70,0,1,5),(386,8,71,1,1,4),(387,9,72,1,1,3),(388,9,73,0,1,5),(389,10,74,1,1,4),(390,10,75,0,1,3),(391,11,76,1,1,5),(392,11,77,0,1,4),(393,12,70,1,1,3),(394,12,71,0,1,5),(395,13,72,1,1,4),(396,13,73,0,1,3),(397,14,74,1,1,5),(398,14,75,0,1,4),(399,15,76,1,1,3),(400,15,77,0,1,5),(401,19,70,1,1,4),(402,19,71,0,1,5),(403,21,72,1,1,3),(404,21,73,0,1,4),(405,23,74,1,1,5),(406,23,75,0,1,3),(407,25,77,NULL,1,1),(408,27,77,NULL,1,1),(409,16,27,NULL,1,1),(410,2,18,NULL,0,NULL),(411,3,18,NULL,0,NULL),(412,4,18,NULL,0,NULL),(413,5,18,NULL,0,NULL),(414,6,18,NULL,0,NULL),(415,7,18,NULL,0,NULL),(416,26,18,NULL,0,NULL),(417,1,54,NULL,0,NULL),(418,2,54,NULL,0,NULL),(419,3,54,NULL,0,NULL),(420,4,54,NULL,0,NULL),(421,22,54,NULL,0,NULL),(422,16,54,1,1,1),(423,25,18,NULL,1,0);
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
) ENGINE=InnoDB AUTO_INCREMENT=49 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ejercicios`
--

LOCK TABLES `ejercicios` WRITE;
/*!40000 ALTER TABLE `ejercicios` DISABLE KEYS */;
INSERT INTO `ejercicios` VALUES (18,6,16,'Prueba','https://res.cloudinary.com/dge59jbqb/raw/upload/v1778236112/nebriacademy/ejercicios/aaa','Prueba 1 de inteligencia artificial'),(19,6,16,'Prueba 2','https://res.cloudinary.com/dge59jbqb/image/upload/v1778237675/nebriacademy/ejercicios/English_Podcast_-_Future_in_Debate__1_.pdf','Descripción prueba 2'),(22,1,1,'Parcial python tema 1','https://res.cloudinary.com/dge59jbqb/raw/upload/v1779738582/nebriacademy/ejercicios/UNIT_1_-_GS','Parcial de los conocimientos de python adquiridos en el tema 1'),(23,1,2,'Ejercicio practico Javascript 2026 ','https://res.cloudinary.com/dge59jbqb/raw/upload/v1779740005/nebriacademy/ejercicios/message__19_','Ejercicio para practicar lo aprendido en el curso'),(24,1,3,'¿Cuánto has aprendido sobre software?','https://res.cloudinary.com/dge59jbqb/image/upload/v1779741378/nebriacademy/ejercicios/2_-_HABLAR_DE_UN_TRABAJO.pdf','Pon a prueba tus conocimientos'),(25,31,28,'¿Qué has aprendido?','https://res.cloudinary.com/dge59jbqb/image/upload/v1779742628/nebriacademy/ejercicios/Grupo_25_-_Juego_Domin__.pdf','Pon a prueba tus conocimientos'),(26,31,27,'¿Es un entorno seguro?','https://res.cloudinary.com/dge59jbqb/raw/upload/v1779744353/nebriacademy/ejercicios/Population','Ejercicio ciberseguridad 1'),(27,2,4,'Ejercicio SQL: Consultas con JOIN y Subconsultas','https://res.cloudinary.com/dge59jbqb/raw/upload/nebriacademy/ejercicios/sql_fund_ej1','Demuestra lo aprendido escribiendo consultas sobre una base de datos de ejemplo'),(28,2,5,'Ejercicio Modelado: Diseña el ER de una Tienda Online','https://res.cloudinary.com/dge59jbqb/raw/upload/nebriacademy/ejercicios/modelado_ej1','Crea el diagrama ER y lleva el modelo a 3FN'),(29,2,6,'Ejercicio Tuning: Optimiza estas Consultas Lentas','https://res.cloudinary.com/dge59jbqb/raw/upload/nebriacademy/ejercicios/tuning_ej1','Analiza los planes de ejecución y aplica índices para mejorar el rendimiento'),(30,3,7,'Ejercicio: Identifica Vulnerabilidades en este Sistema','https://res.cloudinary.com/dge59jbqb/raw/upload/nebriacademy/ejercicios/ciberseg_fund_ej1','Analiza el escenario propuesto y clasifica las amenazas según el modelo CIA'),(31,3,8,'Ejercicio: Configura un Firewall con iptables','https://res.cloudinary.com/dge59jbqb/raw/upload/nebriacademy/ejercicios/seg_redes_ej1','Aplica reglas de filtrado para proteger una red corporativa simulada'),(32,3,9,'Ejercicio CTF: Explota esta Máquina Virtual','https://res.cloudinary.com/dge59jbqb/raw/upload/nebriacademy/ejercicios/hacking_etico_ej1','Usa las técnicas de pentesting del curso para obtener acceso controlado al sistema objetivo'),(33,4,10,'Ejercicio UI: Rediseña esta Interfaz con Mal Contraste','https://res.cloudinary.com/dge59jbqb/raw/upload/nebriacademy/ejercicios/diseno_ui_ej1','Aplica los principios de color y tipografía para mejorar la accesibilidad'),(34,4,11,'Ejercicio Figma: Prototipa el Flujo de Registro','https://res.cloudinary.com/dge59jbqb/raw/upload/nebriacademy/ejercicios/figma_ej1','Diseña y conecta las pantallas de onboarding de una app móvil'),(35,4,12,'Ejercicio UX Research: Planifica un Test de Usabilidad','https://res.cloudinary.com/dge59jbqb/raw/upload/nebriacademy/ejercicios/ux_research_ej1','Define el protocolo, las tareas y las métricas de éxito para testear un producto'),(36,5,13,'Ejercicio: Crea el Funnel de Marketing de una Startup','https://res.cloudinary.com/dge59jbqb/raw/upload/nebriacademy/ejercicios/marketing_ej1','Define las etapas TOFU-MOFU-BOFU y las acciones para cada una'),(37,5,14,'Ejercicio SEO: Audita esta Web y Propón Mejoras','https://res.cloudinary.com/dge59jbqb/raw/upload/nebriacademy/ejercicios/seo_sem_ej1','Analiza on-page, velocidad y estructura de enlaces internos'),(38,5,15,'Ejercicio Growth: Diseña un Experimento A/B','https://res.cloudinary.com/dge59jbqb/raw/upload/nebriacademy/ejercicios/growth_ej1','Formula hipótesis, define métricas y calcula el tamaño de muestra necesario'),(39,6,17,'Ejercicio ML: Entrena un Clasificador con Scikit-learn','https://res.cloudinary.com/dge59jbqb/raw/upload/nebriacademy/ejercicios/ml_practico_ej1','Preprocesa el dataset, elige el modelo adecuado y evalúa sus métricas'),(40,6,18,'Ejercicio Deep Learning: Clasifica Imágenes con CNN','https://res.cloudinary.com/dge59jbqb/raw/upload/nebriacademy/ejercicios/deep_learning_ej1','Construye y entrena una CNN en TensorFlow sobre un dataset de imágenes'),(41,7,19,'Ejercicio HTML/CSS/JS: Maqueta esta Página desde Cero','https://res.cloudinary.com/dge59jbqb/raw/upload/nebriacademy/ejercicios/html_css_ej1','Replica el diseño propuesto usando solo HTML5 semántico y CSS puro'),(42,7,20,'Ejercicio Frameworks: Migra este Componente de Vue a React','https://res.cloudinary.com/dge59jbqb/raw/upload/nebriacademy/ejercicios/frameworks_ej1','Comprende las diferencias de ambos frameworks reescribiendo el mismo componente'),(43,7,21,'Ejercicio MERN: Construye una API REST con Autenticación','https://res.cloudinary.com/dge59jbqb/raw/upload/nebriacademy/ejercicios/mern_ej1','Implementa registro, login con JWT y rutas protegidas en tu stack MERN'),(44,8,22,'Ejercicio Data Science: Analiza este Dataset de Ventas','https://res.cloudinary.com/dge59jbqb/raw/upload/nebriacademy/ejercicios/data_science_ej1','Realiza el EDA completo: limpieza, estadística descriptiva y visualizaciones'),(45,8,23,'Ejercicio Pandas: Limpia y Fusiona estos Datasets','https://res.cloudinary.com/dge59jbqb/raw/upload/nebriacademy/ejercicios/pandas_ej1','Aplica operaciones de merge, pivot y groupby para obtener los KPIs solicitados'),(46,8,24,'Ejercicio Spark: Procesa este Log con PySpark','https://res.cloudinary.com/dge59jbqb/raw/upload/nebriacademy/ejercicios/bigdata_ej1','Transforma y agrega millones de registros usando DataFrames de Spark'),(47,30,25,'Ejercicio ML Avanzado: Compara XGBoost vs LightGBM','https://res.cloudinary.com/dge59jbqb/raw/upload/nebriacademy/ejercicios/ml_avanzado_ej1','Entrena ambos modelos, optimiza hiperparámetros y justifica cuál es mejor'),(48,30,26,'Ejercicio R: Modela la Regresión de este Dataset con R','https://res.cloudinary.com/dge59jbqb/raw/upload/nebriacademy/ejercicios/r_ej1','Aplica regresión lineal múltiple, verifica supuestos y presenta los resultados');
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
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ejerciciosalumnos`
--

LOCK TABLES `ejerciciosalumnos` WRITE;
/*!40000 ALTER TABLE `ejerciciosalumnos` DISABLE KEYS */;
INSERT INTO `ejerciciosalumnos` VALUES (8,18,9,'https://res.cloudinary.com/dge59jbqb/image/upload/v1778440512/nebriacademy/ejerciciosalumnos/5.2_-_Pinia_con_TypeScript.pdf'),(10,18,1,'https://res.cloudinary.com/dge59jbqb/image/upload/v1778669694/nebriacademy/ejerciciosalumnos/Captura_de_pantalla_2024-11-07_122041.png'),(11,18,4,'https://res.cloudinary.com/dge59jbqb/image/upload/v1779539418/nebriacademy/ejerciciosalumnos/DiagramaCasosDeUso.png'),(12,18,27,'https://res.cloudinary.com/dge59jbqb/image/upload/v1779719224/nebriacademy/ejerciciosalumnos/Clone_App_-_Presentaci__n_Ejecutiva.pdf'),(13,19,54,'https://res.cloudinary.com/dge59jbqb/raw/upload/v1779734133/nebriacademy/ejerciciosalumnos/Diagrama_de_Gantt');
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
  `fecha` datetime DEFAULT CURRENT_TIMESTAMP,
  `vista` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=379 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notificaciones`
--

LOCK TABLES `notificaciones` WRITE;
/*!40000 ALTER TABLE `notificaciones` DISABLE KEYS */;
INSERT INTO `notificaciones` VALUES (214,6,'alumno','Nuevo apunte subido en el curso IA para Principiantes','/Home/Courses/16','2026-05-25 09:27:58',0),(215,7,'alumno','Nuevo apunte subido en el curso IA para Principiantes','/Home/Courses/16','2026-05-25 09:27:58',0),(218,9,'alumno','Nuevo apunte subido en el curso IA para Principiantes','/Home/Courses/16','2026-05-25 09:27:58',0),(219,6,'alumno','Nuevo apunte subido en el curso IA para Principiantes','/Home/Courses/16','2026-05-25 09:41:17',0),(220,7,'alumno','Nuevo apunte subido en el curso IA para Principiantes','/Home/Courses/16','2026-05-25 09:41:17',0),(223,9,'alumno','Nuevo apunte subido en el curso IA para Principiantes','/Home/Courses/16','2026-05-25 09:41:17',0),(224,6,'alumno','Nuevo apunte subido en el curso IA para Principiantes','/Home/Courses/16','2026-05-25 09:42:02',0),(225,7,'alumno','Nuevo apunte subido en el curso IA para Principiantes','/Home/Courses/16','2026-05-25 09:42:02',0),(228,9,'alumno','Nuevo apunte subido en el curso IA para Principiantes','/Home/Courses/16','2026-05-25 09:42:02',0),(233,75,'alumno','Se ha corregido tu respuesta del ejercicio Prueba 2','/Home/Courses/16','2026-05-25 18:41:57',0),(235,6,'alumno','Nuevo apunte subido en el curso Python desde Cero','/Home/Courses/1','2026-05-25 19:47:32',0),(236,7,'alumno','Nuevo apunte subido en el curso Python desde Cero','/Home/Courses/1','2026-05-25 19:47:32',0),(238,100,'alumno','Nuevo apunte subido en el curso Python desde Cero','/Home/Courses/1','2026-05-25 19:47:32',0),(239,101,'alumno','Nuevo apunte subido en el curso Python desde Cero','/Home/Courses/1','2026-05-25 19:47:32',0),(240,102,'alumno','Nuevo apunte subido en el curso Python desde Cero','/Home/Courses/1','2026-05-25 19:47:32',0),(241,8,'alumno','Nuevo apunte subido en el curso Python desde Cero','/Home/Courses/1','2026-05-25 19:47:32',0),(242,9,'alumno','Nuevo apunte subido en el curso Python desde Cero','/Home/Courses/1','2026-05-25 19:47:32',0),(243,10,'alumno','Nuevo apunte subido en el curso Python desde Cero','/Home/Courses/1','2026-05-25 19:47:32',0),(244,6,'alumno','Nuevo apunte subido en el curso Python desde Cero','/Home/Courses/1','2026-05-25 19:48:19',0),(245,7,'alumno','Nuevo apunte subido en el curso Python desde Cero','/Home/Courses/1','2026-05-25 19:48:19',0),(247,100,'alumno','Nuevo apunte subido en el curso Python desde Cero','/Home/Courses/1','2026-05-25 19:48:19',0),(248,101,'alumno','Nuevo apunte subido en el curso Python desde Cero','/Home/Courses/1','2026-05-25 19:48:19',0),(249,102,'alumno','Nuevo apunte subido en el curso Python desde Cero','/Home/Courses/1','2026-05-25 19:48:19',0),(250,8,'alumno','Nuevo apunte subido en el curso Python desde Cero','/Home/Courses/1','2026-05-25 19:48:19',0),(251,9,'alumno','Nuevo apunte subido en el curso Python desde Cero','/Home/Courses/1','2026-05-25 19:48:19',0),(252,10,'alumno','Nuevo apunte subido en el curso Python desde Cero','/Home/Courses/1','2026-05-25 19:48:19',0),(253,6,'alumno','Nuevo ejercicio subido en el curso Python desde Cero','/Home/Courses/1','2026-05-25 19:49:44',0),(254,7,'alumno','Nuevo ejercicio subido en el curso Python desde Cero','/Home/Courses/1','2026-05-25 19:49:44',0),(256,100,'alumno','Nuevo ejercicio subido en el curso Python desde Cero','/Home/Courses/1','2026-05-25 19:49:44',0),(257,101,'alumno','Nuevo ejercicio subido en el curso Python desde Cero','/Home/Courses/1','2026-05-25 19:49:44',0),(258,102,'alumno','Nuevo ejercicio subido en el curso Python desde Cero','/Home/Courses/1','2026-05-25 19:49:44',0),(259,8,'alumno','Nuevo ejercicio subido en el curso Python desde Cero','/Home/Courses/1','2026-05-25 19:49:44',0),(260,9,'alumno','Nuevo ejercicio subido en el curso Python desde Cero','/Home/Courses/1','2026-05-25 19:49:44',0),(261,10,'alumno','Nuevo ejercicio subido en el curso Python desde Cero','/Home/Courses/1','2026-05-25 19:49:44',0),(262,6,'alumno','Nuevo vídeo subido en el curso Python desde Cero','/Home/Courses/1','2026-05-25 19:51:38',0),(263,7,'alumno','Nuevo vídeo subido en el curso Python desde Cero','/Home/Courses/1','2026-05-25 19:51:38',0),(265,100,'alumno','Nuevo vídeo subido en el curso Python desde Cero','/Home/Courses/1','2026-05-25 19:51:38',0),(266,101,'alumno','Nuevo vídeo subido en el curso Python desde Cero','/Home/Courses/1','2026-05-25 19:51:38',0),(267,102,'alumno','Nuevo vídeo subido en el curso Python desde Cero','/Home/Courses/1','2026-05-25 19:51:38',0),(268,8,'alumno','Nuevo vídeo subido en el curso Python desde Cero','/Home/Courses/1','2026-05-25 19:51:38',0),(269,9,'alumno','Nuevo vídeo subido en el curso Python desde Cero','/Home/Courses/1','2026-05-25 19:51:38',0),(270,10,'alumno','Nuevo vídeo subido en el curso Python desde Cero','/Home/Courses/1','2026-05-25 19:51:38',0),(271,8,'alumno','Nuevo vídeo subido en el curso JavaScript Moderno','/Home/Courses/2','2026-05-25 19:57:17',0),(272,9,'alumno','Nuevo vídeo subido en el curso JavaScript Moderno','/Home/Courses/2','2026-05-25 19:57:17',0),(273,16,'alumno','Nuevo vídeo subido en el curso JavaScript Moderno','/Home/Courses/2','2026-05-25 19:57:17',0),(274,103,'alumno','Nuevo vídeo subido en el curso JavaScript Moderno','/Home/Courses/2','2026-05-25 19:57:17',0),(275,104,'alumno','Nuevo vídeo subido en el curso JavaScript Moderno','/Home/Courses/2','2026-05-25 19:57:17',0),(276,105,'alumno','Nuevo vídeo subido en el curso JavaScript Moderno','/Home/Courses/2','2026-05-25 19:57:17',0),(277,6,'alumno','Nuevo vídeo subido en el curso JavaScript Moderno','/Home/Courses/2','2026-05-25 19:57:17',0),(278,7,'alumno','Nuevo vídeo subido en el curso JavaScript Moderno','/Home/Courses/2','2026-05-25 19:57:17',0),(279,11,'alumno','Nuevo vídeo subido en el curso JavaScript Moderno','/Home/Courses/2','2026-05-25 19:57:17',0),(280,8,'alumno','Nuevo apunte subido en el curso JavaScript Moderno','/Home/Courses/2','2026-05-25 20:01:08',0),(281,9,'alumno','Nuevo apunte subido en el curso JavaScript Moderno','/Home/Courses/2','2026-05-25 20:01:08',0),(282,16,'alumno','Nuevo apunte subido en el curso JavaScript Moderno','/Home/Courses/2','2026-05-25 20:01:08',0),(283,103,'alumno','Nuevo apunte subido en el curso JavaScript Moderno','/Home/Courses/2','2026-05-25 20:01:08',0),(284,104,'alumno','Nuevo apunte subido en el curso JavaScript Moderno','/Home/Courses/2','2026-05-25 20:01:08',0),(285,105,'alumno','Nuevo apunte subido en el curso JavaScript Moderno','/Home/Courses/2','2026-05-25 20:01:08',0),(286,6,'alumno','Nuevo apunte subido en el curso JavaScript Moderno','/Home/Courses/2','2026-05-25 20:01:08',0),(287,7,'alumno','Nuevo apunte subido en el curso JavaScript Moderno','/Home/Courses/2','2026-05-25 20:01:08',0),(288,11,'alumno','Nuevo apunte subido en el curso JavaScript Moderno','/Home/Courses/2','2026-05-25 20:01:08',0),(289,8,'alumno','Nuevo apunte subido en el curso JavaScript Moderno','/Home/Courses/2','2026-05-25 20:09:40',0),(290,9,'alumno','Nuevo apunte subido en el curso JavaScript Moderno','/Home/Courses/2','2026-05-25 20:09:40',0),(291,16,'alumno','Nuevo apunte subido en el curso JavaScript Moderno','/Home/Courses/2','2026-05-25 20:09:40',0),(292,103,'alumno','Nuevo apunte subido en el curso JavaScript Moderno','/Home/Courses/2','2026-05-25 20:09:40',0),(293,104,'alumno','Nuevo apunte subido en el curso JavaScript Moderno','/Home/Courses/2','2026-05-25 20:09:40',0),(294,105,'alumno','Nuevo apunte subido en el curso JavaScript Moderno','/Home/Courses/2','2026-05-25 20:09:40',0),(295,6,'alumno','Nuevo apunte subido en el curso JavaScript Moderno','/Home/Courses/2','2026-05-25 20:09:40',0),(296,7,'alumno','Nuevo apunte subido en el curso JavaScript Moderno','/Home/Courses/2','2026-05-25 20:09:40',0),(297,11,'alumno','Nuevo apunte subido en el curso JavaScript Moderno','/Home/Courses/2','2026-05-25 20:09:40',0),(298,8,'alumno','Nuevo ejercicio subido en el curso JavaScript Moderno','/Home/Courses/2','2026-05-25 20:13:27',0),(299,9,'alumno','Nuevo ejercicio subido en el curso JavaScript Moderno','/Home/Courses/2','2026-05-25 20:13:27',0),(300,16,'alumno','Nuevo ejercicio subido en el curso JavaScript Moderno','/Home/Courses/2','2026-05-25 20:13:27',0),(301,103,'alumno','Nuevo ejercicio subido en el curso JavaScript Moderno','/Home/Courses/2','2026-05-25 20:13:27',0),(302,104,'alumno','Nuevo ejercicio subido en el curso JavaScript Moderno','/Home/Courses/2','2026-05-25 20:13:27',0),(303,105,'alumno','Nuevo ejercicio subido en el curso JavaScript Moderno','/Home/Courses/2','2026-05-25 20:13:27',0),(304,6,'alumno','Nuevo ejercicio subido en el curso JavaScript Moderno','/Home/Courses/2','2026-05-25 20:13:27',0),(305,7,'alumno','Nuevo ejercicio subido en el curso JavaScript Moderno','/Home/Courses/2','2026-05-25 20:13:27',0),(306,11,'alumno','Nuevo ejercicio subido en el curso JavaScript Moderno','/Home/Courses/2','2026-05-25 20:13:27',0),(307,10,'alumno','Nuevo vídeo subido en el curso Arquitectura de Software','/Home/Courses/3','2026-05-25 20:28:29',0),(308,11,'alumno','Nuevo vídeo subido en el curso Arquitectura de Software','/Home/Courses/3','2026-05-25 20:28:29',0),(309,106,'alumno','Nuevo vídeo subido en el curso Arquitectura de Software','/Home/Courses/3','2026-05-25 20:28:29',0),(310,107,'alumno','Nuevo vídeo subido en el curso Arquitectura de Software','/Home/Courses/3','2026-05-25 20:28:29',0),(311,6,'alumno','Nuevo vídeo subido en el curso Arquitectura de Software','/Home/Courses/3','2026-05-25 20:28:29',0),(312,7,'alumno','Nuevo vídeo subido en el curso Arquitectura de Software','/Home/Courses/3','2026-05-25 20:28:29',0),(313,12,'alumno','Nuevo vídeo subido en el curso Arquitectura de Software','/Home/Courses/3','2026-05-25 20:28:29',0),(314,10,'alumno','Nuevo apunte subido en el curso Arquitectura de Software','/Home/Courses/3','2026-05-25 20:30:56',0),(315,11,'alumno','Nuevo apunte subido en el curso Arquitectura de Software','/Home/Courses/3','2026-05-25 20:30:56',0),(316,106,'alumno','Nuevo apunte subido en el curso Arquitectura de Software','/Home/Courses/3','2026-05-25 20:30:56',0),(317,107,'alumno','Nuevo apunte subido en el curso Arquitectura de Software','/Home/Courses/3','2026-05-25 20:30:56',0),(318,6,'alumno','Nuevo apunte subido en el curso Arquitectura de Software','/Home/Courses/3','2026-05-25 20:30:56',0),(319,7,'alumno','Nuevo apunte subido en el curso Arquitectura de Software','/Home/Courses/3','2026-05-25 20:30:56',0),(320,12,'alumno','Nuevo apunte subido en el curso Arquitectura de Software','/Home/Courses/3','2026-05-25 20:30:56',0),(321,10,'alumno','Nuevo apunte subido en el curso Arquitectura de Software','/Home/Courses/3','2026-05-25 20:34:27',0),(322,11,'alumno','Nuevo apunte subido en el curso Arquitectura de Software','/Home/Courses/3','2026-05-25 20:34:27',0),(323,106,'alumno','Nuevo apunte subido en el curso Arquitectura de Software','/Home/Courses/3','2026-05-25 20:34:27',0),(324,107,'alumno','Nuevo apunte subido en el curso Arquitectura de Software','/Home/Courses/3','2026-05-25 20:34:27',0),(325,6,'alumno','Nuevo apunte subido en el curso Arquitectura de Software','/Home/Courses/3','2026-05-25 20:34:27',0),(326,7,'alumno','Nuevo apunte subido en el curso Arquitectura de Software','/Home/Courses/3','2026-05-25 20:34:27',0),(327,12,'alumno','Nuevo apunte subido en el curso Arquitectura de Software','/Home/Courses/3','2026-05-25 20:34:27',0),(328,10,'alumno','Nuevo ejercicio subido en el curso Arquitectura de Software','/Home/Courses/3','2026-05-25 20:36:20',0),(329,11,'alumno','Nuevo ejercicio subido en el curso Arquitectura de Software','/Home/Courses/3','2026-05-25 20:36:20',0),(330,106,'alumno','Nuevo ejercicio subido en el curso Arquitectura de Software','/Home/Courses/3','2026-05-25 20:36:20',0),(331,107,'alumno','Nuevo ejercicio subido en el curso Arquitectura de Software','/Home/Courses/3','2026-05-25 20:36:20',0),(332,6,'alumno','Nuevo ejercicio subido en el curso Arquitectura de Software','/Home/Courses/3','2026-05-25 20:36:20',0),(333,7,'alumno','Nuevo ejercicio subido en el curso Arquitectura de Software','/Home/Courses/3','2026-05-25 20:36:20',0),(334,12,'alumno','Nuevo ejercicio subido en el curso Arquitectura de Software','/Home/Courses/3','2026-05-25 20:36:20',0),(335,105,'alumno','Nuevo vídeo subido en el curso Forense Digital y Respuesta a Inc.','/Home/Courses/28','2026-05-25 20:42:52',0),(336,106,'alumno','Nuevo vídeo subido en el curso Forense Digital y Respuesta a Inc.','/Home/Courses/28','2026-05-25 20:42:52',0),(337,107,'alumno','Nuevo vídeo subido en el curso Forense Digital y Respuesta a Inc.','/Home/Courses/28','2026-05-25 20:42:52',0),(338,108,'alumno','Nuevo vídeo subido en el curso Forense Digital y Respuesta a Inc.','/Home/Courses/28','2026-05-25 20:42:52',0),(339,109,'alumno','Nuevo vídeo subido en el curso Forense Digital y Respuesta a Inc.','/Home/Courses/28','2026-05-25 20:42:52',0),(340,105,'alumno','Nuevo apunte subido en el curso Forense Digital y Respuesta a Inc.','/Home/Courses/28','2026-05-25 20:43:51',0),(341,106,'alumno','Nuevo apunte subido en el curso Forense Digital y Respuesta a Inc.','/Home/Courses/28','2026-05-25 20:43:51',0),(342,107,'alumno','Nuevo apunte subido en el curso Forense Digital y Respuesta a Inc.','/Home/Courses/28','2026-05-25 20:43:51',0),(343,108,'alumno','Nuevo apunte subido en el curso Forense Digital y Respuesta a Inc.','/Home/Courses/28','2026-05-25 20:43:51',0),(344,109,'alumno','Nuevo apunte subido en el curso Forense Digital y Respuesta a Inc.','/Home/Courses/28','2026-05-25 20:43:51',0),(345,105,'alumno','Nuevo apunte subido en el curso Forense Digital y Respuesta a Inc.','/Home/Courses/28','2026-05-25 20:56:21',0),(346,106,'alumno','Nuevo apunte subido en el curso Forense Digital y Respuesta a Inc.','/Home/Courses/28','2026-05-25 20:56:21',0),(347,107,'alumno','Nuevo apunte subido en el curso Forense Digital y Respuesta a Inc.','/Home/Courses/28','2026-05-25 20:56:21',0),(348,108,'alumno','Nuevo apunte subido en el curso Forense Digital y Respuesta a Inc.','/Home/Courses/28','2026-05-25 20:56:21',0),(349,109,'alumno','Nuevo apunte subido en el curso Forense Digital y Respuesta a Inc.','/Home/Courses/28','2026-05-25 20:56:21',0),(350,105,'alumno','Nuevo ejercicio subido en el curso Forense Digital y Respuesta a Inc.','/Home/Courses/28','2026-05-25 20:57:09',0),(351,106,'alumno','Nuevo ejercicio subido en el curso Forense Digital y Respuesta a Inc.','/Home/Courses/28','2026-05-25 20:57:09',0),(352,107,'alumno','Nuevo ejercicio subido en el curso Forense Digital y Respuesta a Inc.','/Home/Courses/28','2026-05-25 20:57:09',0),(353,108,'alumno','Nuevo ejercicio subido en el curso Forense Digital y Respuesta a Inc.','/Home/Courses/28','2026-05-25 20:57:09',0),(354,109,'alumno','Nuevo ejercicio subido en el curso Forense Digital y Respuesta a Inc.','/Home/Courses/28','2026-05-25 20:57:09',0),(355,100,'alumno','Nuevo vídeo subido en el curso Seguridad en Aplicaciones Web','/Home/Courses/27','2026-05-25 21:23:42',0),(356,101,'alumno','Nuevo vídeo subido en el curso Seguridad en Aplicaciones Web','/Home/Courses/27','2026-05-25 21:23:42',0),(357,102,'alumno','Nuevo vídeo subido en el curso Seguridad en Aplicaciones Web','/Home/Courses/27','2026-05-25 21:23:42',0),(358,103,'alumno','Nuevo vídeo subido en el curso Seguridad en Aplicaciones Web','/Home/Courses/27','2026-05-25 21:23:42',0),(359,104,'alumno','Nuevo vídeo subido en el curso Seguridad en Aplicaciones Web','/Home/Courses/27','2026-05-25 21:23:42',0),(360,107,'alumno','Nuevo vídeo subido en el curso Seguridad en Aplicaciones Web','/Home/Courses/27','2026-05-25 21:23:42',0),(361,100,'alumno','Nuevo apunte subido en el curso Seguridad en Aplicaciones Web','/Home/Courses/27','2026-05-25 21:24:37',0),(362,101,'alumno','Nuevo apunte subido en el curso Seguridad en Aplicaciones Web','/Home/Courses/27','2026-05-25 21:24:37',0),(363,102,'alumno','Nuevo apunte subido en el curso Seguridad en Aplicaciones Web','/Home/Courses/27','2026-05-25 21:24:37',0),(364,103,'alumno','Nuevo apunte subido en el curso Seguridad en Aplicaciones Web','/Home/Courses/27','2026-05-25 21:24:37',0),(365,104,'alumno','Nuevo apunte subido en el curso Seguridad en Aplicaciones Web','/Home/Courses/27','2026-05-25 21:24:37',0),(366,107,'alumno','Nuevo apunte subido en el curso Seguridad en Aplicaciones Web','/Home/Courses/27','2026-05-25 21:24:37',0),(367,100,'alumno','Nuevo apunte subido en el curso Seguridad en Aplicaciones Web','/Home/Courses/27','2026-05-25 21:24:58',0),(368,101,'alumno','Nuevo apunte subido en el curso Seguridad en Aplicaciones Web','/Home/Courses/27','2026-05-25 21:24:58',0),(369,102,'alumno','Nuevo apunte subido en el curso Seguridad en Aplicaciones Web','/Home/Courses/27','2026-05-25 21:24:58',0),(370,103,'alumno','Nuevo apunte subido en el curso Seguridad en Aplicaciones Web','/Home/Courses/27','2026-05-25 21:24:58',0),(371,104,'alumno','Nuevo apunte subido en el curso Seguridad en Aplicaciones Web','/Home/Courses/27','2026-05-25 21:24:58',0),(372,107,'alumno','Nuevo apunte subido en el curso Seguridad en Aplicaciones Web','/Home/Courses/27','2026-05-25 21:24:58',0),(373,100,'alumno','Nuevo ejercicio subido en el curso Seguridad en Aplicaciones Web','/Home/Courses/27','2026-05-25 21:25:55',0),(374,101,'alumno','Nuevo ejercicio subido en el curso Seguridad en Aplicaciones Web','/Home/Courses/27','2026-05-25 21:25:55',0),(375,102,'alumno','Nuevo ejercicio subido en el curso Seguridad en Aplicaciones Web','/Home/Courses/27','2026-05-25 21:25:55',0),(376,103,'alumno','Nuevo ejercicio subido en el curso Seguridad en Aplicaciones Web','/Home/Courses/27','2026-05-25 21:25:55',0),(377,104,'alumno','Nuevo ejercicio subido en el curso Seguridad en Aplicaciones Web','/Home/Courses/27','2026-05-25 21:25:55',0),(378,107,'alumno','Nuevo ejercicio subido en el curso Seguridad en Aplicaciones Web','/Home/Courses/27','2026-05-25 21:25:55',0);
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
) ENGINE=InnoDB AUTO_INCREMENT=33 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `profesores`
--

LOCK TABLES `profesores` WRITE;
/*!40000 ALTER TABLE `profesores` DISABLE KEYS */;
INSERT INTO `profesores` VALUES (1,1,'Ana','García López','11111111A','ana.garcia@nebriacademy.com','prof123','ES1234567890123456789012','600111222','@ana_prof','España','Madrid','Programación','female-1',13),(2,2,'Carlos','Martínez Ruiz','22222222B','carlos.martinez@profesores.nebrija.es','prof456','ES2345678901234567890123','600222333','@carlos_prof','España','Barcelona','BDD','male-11',14),(3,3,'Laura','Sánchez Pérez','33333333C','laura.sanchez@gmail.com','prof789','ES3456789012345678901234','600333444','@laura_prof','España','Valencia','Ciberseguridad','female-2',15),(4,4,'Miguel','Rodríguez Gómez','44444444D','miguel.rodriguez@outlook.com','prof000','ES4567890123456789012345','600444555','@miguel_prof','España','Sevilla','Diseño y UX','male-2',16),(5,5,'Elena','Fernández Torres','55555555E','elena.fernandez@yahoo.com','prof111','ES5678901234567890123456','600555666','@elena_prof','España','Bilbao','Marketing','female-3',17),(6,15,'Arturo','Arturez','66666666F','a@a.com','a','ES5678911134562390133446','26426262362364765532','','España','Madrid','Inteligencia Artificial','male-7',18),(7,38,'Raquel','López Vega','77777777G','raquel.lopez@profesores.nebrija.es','prof777','ES7777777777777777777777','601111223','@raquel_prof','España','Madrid','Desarrollo','female-4',29),(8,39,'Diego','Morales Ruiz','88888888H','diego.morales@gmail.com','prof888','ES8888888888888888888888','601222334','@diego_prof','España','Barcelona','Data Science','male-4',30),(25,79,NULL,NULL,NULL,'profDF@gmail.com','ykGZGlnY',NULL,NULL,NULL,NULL,NULL,NULL,NULL,57),(30,110,'Roberto','Vega Molina','30303030R','roberto.vega@nebriacademy.com','prof_demo','ES9900000000000000000001','600300400','@roberto_prof','España','Madrid','Data Science','male-5',78),(31,111,'Patricia','Núñez Castillo','31313131S','patricia.nunez@nebriacademy.com','prof_demo','ES9900000000000000000002','600300401','@patricia_prof','España','Zaragoza','Ciberseguridad','female-5',79);
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
) ENGINE=InnoDB AUTO_INCREMENT=111 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `profesorescursos`
--

LOCK TABLES `profesorescursos` WRITE;
/*!40000 ALTER TABLE `profesorescursos` DISABLE KEYS */;
INSERT INTO `profesorescursos` VALUES (62,1,1),(63,1,2),(64,1,3),(65,2,4),(66,2,5),(67,2,6),(68,3,7),(69,3,8),(70,3,9),(71,4,10),(72,4,11),(73,4,12),(74,5,13),(75,5,14),(76,5,15),(77,6,16),(78,6,17),(79,6,18),(80,7,19),(81,7,20),(82,7,21),(83,8,22),(84,8,23),(85,8,24),(107,30,25),(108,30,26),(109,31,27),(110,31,28);
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
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `puntuacionesejercicios`
--

LOCK TABLES `puntuacionesejercicios` WRITE;
/*!40000 ALTER TABLE `puntuacionesejercicios` DISABLE KEYS */;
INSERT INTO `puntuacionesejercicios` VALUES (8,8,9,7),(10,10,1,6),(11,13,54,7);
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
) ENGINE=InnoDB AUTO_INCREMENT=114 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuarios`
--

LOCK TABLES `usuarios` WRITE;
/*!40000 ALTER TABLE `usuarios` DISABLE KEYS */;
INSERT INTO `usuarios` VALUES (1,'profesor'),(2,'profesor'),(3,'profesor'),(4,'profesor'),(5,'profesor'),(6,'alumno'),(7,'alumno'),(8,'alumno'),(9,'alumno'),(10,'alumno'),(11,'alumno'),(12,'alumno'),(13,'alumno'),(14,'administrador'),(15,'profesor'),(16,'alumno'),(22,'alumno'),(23,'alumno'),(24,'alumno'),(25,'alumno'),(26,'alumno'),(27,'alumno'),(28,'alumno'),(29,'alumno'),(30,'alumno'),(31,'alumno'),(32,'alumno'),(33,'alumno'),(34,'alumno'),(35,'alumno'),(36,'alumno'),(37,'alumno'),(38,'profesor'),(39,'profesor'),(64,'alumno'),(66,'alumno'),(69,'alumno'),(72,'alumno'),(75,'alumno'),(78,'alumno'),(79,'profesor'),(80,'alumno'),(100,'alumno'),(101,'alumno'),(102,'alumno'),(103,'alumno'),(104,'alumno'),(105,'alumno'),(106,'alumno'),(107,'alumno'),(108,'alumno'),(109,'alumno'),(110,'profesor'),(111,'profesor');
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
) ENGINE=InnoDB AUTO_INCREMENT=39 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `videos`
--

LOCK TABLES `videos` WRITE;
/*!40000 ALTER TABLE `videos` DISABLE KEYS */;
INSERT INTO `videos` VALUES (4,6,16,'Video 1','https://res.cloudinary.com/dge59jbqb/video/upload/v1777017879/nebriacademy/videos/WhatsApp_Video_2025-11-25_at_13.42.22.mp4'),(8,6,16,'Video 2','https://res.cloudinary.com/dge59jbqb/video/upload/v1778761889/nebriacademy/videos/PixVerse_V5.6_Image_Text_720P_Un_profesor_dand.mp4'),(12,1,1,'Python desde 0','https://res.cloudinary.com/dge59jbqb/video/upload/v1779738696/nebriacademy/videos/Screen_recording4.mp4'),(13,1,2,'Javascript 2026','https://res.cloudinary.com/dge59jbqb/video/upload/v1779739035/nebriacademy/videos/Azure.mp4'),(14,1,3,'Teoría de software avanzado','https://res.cloudinary.com/dge59jbqb/video/upload/v1779740905/nebriacademy/videos/Screen_recording3.mp4'),(15,31,28,'Bienvenidos!!!!','https://res.cloudinary.com/dge59jbqb/video/upload/v1779741770/nebriacademy/videos/Screen_recording2.mp4'),(16,31,27,'Como estar protegido en la red','https://res.cloudinary.com/dge59jbqb/video/upload/v1777017879/nebriacademy/videos/WhatsApp_Video_2025-11-25_at_13.42.22.mp4'),(17,2,4,'Introducción a SQL: Consultas Básicas','https://res.cloudinary.com/dge59jbqb/video/upload/nebriacademy/videos/sql_fundamentos_intro.mp4'),(18,2,5,'Modelado ER: Diseño de Bases de Datos Relacionales','https://res.cloudinary.com/dge59jbqb/video/upload/nebriacademy/videos/modelado_er_intro.mp4'),(19,2,6,'Indexación y Tuning en MySQL','https://res.cloudinary.com/dge59jbqb/video/upload/nebriacademy/videos/optimizacion_tuning_intro.mp4'),(20,3,7,'Fundamentos de Seguridad Informática','https://res.cloudinary.com/dge59jbqb/video/upload/nebriacademy/videos/fundamentos_ciberseguridad_intro.mp4'),(21,3,8,'Firewalls y VPNs: Seguridad en Redes','https://res.cloudinary.com/dge59jbqb/video/upload/nebriacademy/videos/seguridad_redes_intro.mp4'),(22,3,9,'Introducción al Hacking Ético y Pentesting','https://res.cloudinary.com/dge59jbqb/video/upload/nebriacademy/videos/hacking_etico_intro.mp4'),(23,4,10,'Principios de Diseño UI: Color y Tipografía','https://res.cloudinary.com/dge59jbqb/video/upload/nebriacademy/videos/diseno_ui_intro.mp4'),(24,4,11,'Crea tu Primer Prototipo en Figma','https://res.cloudinary.com/dge59jbqb/video/upload/nebriacademy/videos/figma_prototipado_intro.mp4'),(25,4,12,'Tests de Usabilidad y UX Research','https://res.cloudinary.com/dge59jbqb/video/upload/nebriacademy/videos/ux_research_intro.mp4'),(26,5,13,'Marketing Digital: Funnels y Redes Sociales','https://res.cloudinary.com/dge59jbqb/video/upload/nebriacademy/videos/marketing_digital_intro.mp4'),(27,5,14,'SEO On-Page y Estrategias SEM con Google Ads','https://res.cloudinary.com/dge59jbqb/video/upload/nebriacademy/videos/seo_sem_intro.mp4'),(28,5,15,'Growth Hacking: Métricas y Experimentación','https://res.cloudinary.com/dge59jbqb/video/upload/nebriacademy/videos/growth_hacking_intro.mp4'),(29,6,17,'Machine Learning con Scikit-learn: Primeros Pasos','https://res.cloudinary.com/dge59jbqb/video/upload/nebriacademy/videos/ml_practico_intro.mp4'),(30,6,18,'Redes Neuronales con TensorFlow','https://res.cloudinary.com/dge59jbqb/video/upload/nebriacademy/videos/deep_learning_intro.mp4'),(31,7,19,'HTML Semántico, CSS y JavaScript Esencial','https://res.cloudinary.com/dge59jbqb/video/upload/nebriacademy/videos/html_css_js_intro.mp4'),(32,7,20,'React vs Vue: Frameworks Frontend Modernos','https://res.cloudinary.com/dge59jbqb/video/upload/nebriacademy/videos/frameworks_frontend_intro.mp4'),(33,7,21,'Full Stack MERN: MongoDB, Express, React y Node','https://res.cloudinary.com/dge59jbqb/video/upload/nebriacademy/videos/mern_stack_intro.mp4'),(34,8,22,'Análisis Exploratorio de Datos con Python','https://res.cloudinary.com/dge59jbqb/video/upload/nebriacademy/videos/data_science_intro.mp4'),(35,8,23,'Manipulación de Datos con Pandas','https://res.cloudinary.com/dge59jbqb/video/upload/nebriacademy/videos/pandas_intro.mp4'),(36,8,24,'Big Data: Introducción a Spark y Hadoop','https://res.cloudinary.com/dge59jbqb/video/upload/nebriacademy/videos/bigdata_spark_intro.mp4'),(37,30,25,'Ensemble Methods y AutoML en la Práctica','https://res.cloudinary.com/dge59jbqb/video/upload/nebriacademy/videos/ml_avanzado_intro.mp4'),(38,30,26,'Análisis Estadístico con R y Tidyverse','https://res.cloudinary.com/dge59jbqb/video/upload/nebriacademy/videos/r_tidyverse_intro.mp4');
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

-- Dump completed on 2026-05-26  9:48:27
