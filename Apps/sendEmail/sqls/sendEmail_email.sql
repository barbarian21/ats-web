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
-- Table structure for table `sendEmail_email`
--

DROP TABLE IF EXISTS `sendEmail_email`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8 ;
CREATE TABLE `sendEmail_email` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `from_people` varchar(512) DEFAULT NULL,
  `to_people` varchar(512) DEFAULT NULL,
  `cc` longtext,
  `subject` varchar(512) DEFAULT NULL,
  `content` longtext,
  `update_time` datetime(6) NOT NULL,
  `add_time` datetime(6) NOT NULL,
  `appendix` varchar(2048) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sendEmail_email`
--

LOCK TABLES `sendEmail_email` WRITE;
/*!40000 ALTER TABLE `sendEmail_email` DISABLE KEYS */;
INSERT INTO `sendEmail_email` VALUES (7,'Tito_Wu@pegatroncorp.com','Tito_Wu@pegatroncorp.com','Tito_Wu@pegatroncorp.com','[PGKS1-2][Panda][Delete Line]For Line  F05-4FAS-01','Hi groundhog team,\n\nPlease help on this, thanks~\n\nGH Server: PGKS1-2\nProduct: Panda\nRequest Category: Delete Line\nDelete Line Name: F05-4FAS-01\n','2019-10-31 06:37:00.000000','2019-10-31 06:37:00.000000','空'),(8,'Tito_Wu@pegatroncorp.com','Tito_Wu@pegatroncorp.com','Tito_Wu@pegatroncorp.com;blank_ren@pegatroncorp.com','[PGKS1-2][Panda][Add Line]For Line  F03-3FD-03','Hi groundhog team,\n\nPlease help on this, thanks~\n\nGH Server: PGKS1-2\nProduct: Panda\nRequest Category: Add Line\nNew Line Name: F03-3FD-03\n','2019-10-31 06:41:50.000000','2019-10-31 06:41:50.000000','空');
/*!40000 ALTER TABLE `sendEmail_email` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2019-10-31  7:01:46
