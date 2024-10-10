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
-- Table structure for table `sendEmail_line`
--

DROP TABLE IF EXISTS `sendEmail_line`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8 ;
CREATE TABLE `sendEmail_line` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(512) DEFAULT NULL,
  `update_time` datetime(6) NOT NULL,
  `add_time` datetime(6) NOT NULL,
  `server_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `sendEmail_line_server_id_00f799a0_fk_sendEmail_server_id` (`server_id`),
  CONSTRAINT `sendEmail_line_server_id_00f799a0_fk_sendEmail_server_id` FOREIGN KEY (`server_id`) REFERENCES `sendemail_server` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sendEmail_line`
--

LOCK TABLES `sendEmail_line` WRITE;
/*!40000 ALTER TABLE `sendEmail_line` DISABLE KEYS */;
INSERT INTO `sendEmail_line` VALUES (1,'F05-4FAS-01','2019-10-18 01:56:18.861841','2019-10-18 01:56:18.861898',1),(2,'F05-4FAS-02','2019-10-18 01:56:35.484152','2019-10-18 01:56:35.484186',1),(3,'F03-3FD-03','2019-10-18 01:56:52.457852','2019-10-18 01:56:52.457884',2),(4,'F06-4FGS-01','2019-10-18 01:57:06.418527','2019-10-18 01:57:06.418562',2);
/*!40000 ALTER TABLE `sendEmail_line` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2019-10-23  3:03:31
