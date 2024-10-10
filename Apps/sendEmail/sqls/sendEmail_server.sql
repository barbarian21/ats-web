-- MySQL dump 10.13  Distrib 8.0.16, for macos10.14 (x86_64)
--
-- Host: localhost    Database: ats_web
-- ------------------------------------------------------
-- Server version	8.0.16

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
 SET NAMES utf8 ;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `sendEmail_server`
--

DROP TABLE IF EXISTS `sendEmail_server`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8 ;
CREATE TABLE `sendEmail_server` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(64) DEFAULT NULL,
  `address` varchar(256) DEFAULT NULL,
  `update_time` datetime(6) NOT NULL,
  `add_time` datetime(6) NOT NULL,
  `factory_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `sendEmail_server_factory_id_76f04de2_fk_sendEmail_factory_id` (`factory_id`),
  CONSTRAINT `sendEmail_server_factory_id_76f04de2_fk_sendEmail_factory_id` FOREIGN KEY (`factory_id`) REFERENCES `sendemail_factory` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sendEmail_server`
--

LOCK TABLES `sendEmail_server` WRITE;
/*!40000 ALTER TABLE `sendEmail_server` DISABLE KEYS */;
INSERT INTO `sendEmail_server` VALUES (1,'PGPS1-1','http://10.42.2.50/groundhog/','2019-10-16 01:04:24.595762','2019-10-16 01:04:24.595794',1),(2,'PGPD2-5','http://10.18.2.152/groundhog/','2019-10-16 01:04:57.457749','2019-10-16 01:04:57.457778',2),(3,'PGPD3-5','http://10.18.1.116/groundhog/','2019-10-16 01:05:43.601970','2019-10-16 01:05:43.602004',2),(4,'PGPD3-6','http://10.18.1.120/groundhog/','2019-10-16 01:06:13.409630','2019-10-16 01:06:13.409670',2),(5,'PGPD3-7','http://10.18.2.178/groundhog/','2019-10-16 01:06:49.958365','2019-10-16 01:06:49.958436',2),(6,'PGKS1-1','http://10.23.1.50/groundhog/','2019-10-16 05:15:00.230072','2019-10-16 01:07:13.329162',3),(7,'PGKS1-2','http://10.23.1.52/groundhog/','2019-10-16 01:07:44.227164','2019-10-16 01:07:44.227212',3),(8,'PGKS1-4','http://10.23.1.56/groundhog/','2019-10-16 01:08:07.671936','2019-10-16 01:08:07.671983',3),(9,'PGKS2-1','http://10.23.1.80/groundhog/','2019-10-16 01:08:34.810974','2019-10-16 01:08:34.811004',3),(10,'PGKS 2-2(For CSD)','http://10.23.1.62/groundhog/','2019-10-16 01:09:02.482513','2019-10-16 01:09:02.482605',3);
/*!40000 ALTER TABLE `sendEmail_server` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2019-10-23  3:04:56
