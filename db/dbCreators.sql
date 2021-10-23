--  Create database
CREATE DATABASE  IF NOT EXISTS `delilah_resto`;
USE `delilah_resto`;

-- Table structure for table `usuarios`
DROP TABLE IF EXISTS `usuarios`;
CREATE TABLE `usuarios` (
  `id_usuario` int unsigned NOT NULL AUTO_INCREMENT,
  `nombre_usuario` varchar(45) NOT NULL,
  `contrasena_usuario` varchar(45) NOT NULL,
  `nombre` varchar(45) NOT NULL,
  `apellido` varchar(45) NOT NULL,
  `direccion` varchar(45) NOT NULL,
  `email` varchar(45) NOT NULL,
  `telefono` varchar(45) NOT NULL,
  `es_admin` tinyint unsigned NOT NULL,
  PRIMARY KEY (`id_usuario`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Insert data to table `usuarios`
LOCK TABLES `usuarios` WRITE;
INSERT INTO `usuarios` VALUES (1,'Kenny','8567162','Elbert','Staples','6741 Havey Point','kstaples0@bizjournals.com','8857003',0),
(2,'Bobby','3929488','Kevin','Drakeford','4 Delaware Park','bdrakeford1@noaa.gov','8857701',1),
(3,'Con','3306847','Elliot','Eicke','7 Vidon Avenue','ceicke2@bbb.org','8856621',1),
(4,'Ernie','7949007','Rosette','Jaycox','6 Delladonna Plaza','ejaycox3@epa.gov','8859386',1),
(5,'Gualterio','8972276','Foss','Richardt','741 Village Park','grichardt4@skype.com','8853503', 0)
UNLOCK TABLES;

-- Table structure for table `pedidos`
DROP TABLE IF EXISTS `pedidos`;
CREATE TABLE `pedidos` (
  `id_pedido` int unsigned NOT NULL AUTO_INCREMENT,
  `estado_pedido` enum(['nueva', 'confirmada', 'preparando', 'entregando', 'entregado') NOT NULL DEFAULT 'nueva',
  `tiempo_pedido` time NOT NULL,
  `descripcion_pedido` varchar(45) NOT NULL,
  `cantidad_pedido` int unsigned NOT NULL,
  `forma_pago` enum('cash','credit') NOT NULL,
  `id_usuario` int unsigned NOT NULL,
  PRIMARY KEY (`id_pedido`),
  KEY `id_usuario_idx` (`id_usuario`),
  CONSTRAINT `id_usuario` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

LOCK TABLES `pedidos` WRITE;
UNLOCK TABLES;

-- Table structure for table `productos`
DROP TABLE IF EXISTS `productos`;
CREATE TABLE `productos` (
  `id_producto` int unsigned NOT NULL AUTO_INCREMENT,
  `nombre_producto` varchar(45) NOT NULL,
  `precio_producto` int unsigned NOT NULL,
  `foto_producto` varchar(500) NOT NULL,
  PRIMARY KEY (`id_producto`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Insert data to table `productos`
LOCK TABLES `productos` WRITE;
INSERT INTO `productos` VALUES (1,'Tarta de Limón',250,'[https://www.themealdb.com/images/media/meals/qpqtuu1511386216.jpg]'),(2,'Pescado en salsa',480,'[https://www.themealdb.com/images/media/meals/uwxusv1487344500.jpg]'),(3,'Pollo a la kentuky',320,'[https://www.themealdb.com/images/media/meals/xqusqy1487348868.jpg]'),(4,'Pato agridulce',390,'[https://www.themealdb.com/images/media/meals/wvpvsu1511786158.jpg]'),(5,'Pastel de manzana',230,'[https://www.themealdb.com/images/media/meals/qtqwwu1511792650.jpg]'),(6,'Risotto con Salmon',500,'[https://www.themealdb.com/images/media/meals/xxrxux1503070723.jpg]'),(7,'Sufle de 3 quesos',270,'[https://www.themealdb.com/images/media/meals/sxwquu1511793428.jpg]'),(8,'Spaghetti a la bolognesa',290,'[https://www.themealdb.com/images/media/meals/sutysw1468247559.jpg]'),(9,'Hamburguesa de Cerdo en BBQ',360,'[https://www.themealdb.com/images/media/meals/atd5sh1583188467.jpg]'),(10,'Pollo a la tandoori',430,'[https://www.themealdb.com/images/media/meals/qptpvt1487339892.jpg]');
UNLOCK TABLES;


-- Table structure for table `order_productos`
DROP TABLE IF EXISTS `pedidos_productos`;
CREATE TABLE `pedidos_productos` (
  `id_relacion` int unsigned NOT NULL AUTO_INCREMENT,
  `id_pedido` int unsigned NOT NULL,
  `id_producto` int unsigned NOT NULL,
  `cantidad_producto` int unsigned NOT NULL,
  PRIMARY KEY (`id_relacion`),
  KEY `id_pedido_idx` (`id_pedido`),
  KEY `id_producto_idx` (`id_producto`),
  CONSTRAINT `id_pedido` FOREIGN KEY (`id_pedido`) REFERENCES `pedidos` (`id_pedido`) ON DELETE CASCADE,
  CONSTRAINT `id_producto` FOREIGN KEY (`id_producto`) REFERENCES `productos` (`id_producto`) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

LOCK TABLES `pedidos_productos` WRITE;
UNLOCK TABLES;





