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
-- Table structure for table `sendEmail_emergency`
--

DROP TABLE IF EXISTS `sendEmail_emergency`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8 ;
CREATE TABLE `sendEmail_emergency` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(64) DEFAULT NULL,
  `iphone` varchar(11) DEFAULT NULL,
  `update_time` datetime(6) NOT NULL,
  `add_time` datetime(6) NOT NULL,
  `duty_time` varchar(32) DEFAULT NULL,
  `sign` varchar(32) DEFAULT NULL,
  `priority` smallint(6) DEFAULT NULL,
  `team` varchar(32) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sendEmail_emergency`
--

LOCK TABLES `sendEmail_emergency` WRITE;
/*!40000 ALTER TABLE `sendEmail_emergency` DISABLE KEYS */;
INSERT INTO `sendEmail_emergency` VALUES (1,'付铁柱','644839','2019-10-25 06:23:03.134110','2019-10-16 01:17:58.850001','13:00-22:00','N',1,'PGKS'),(2,'翟龙飞','648137','2019-10-25 06:23:09.413936','2019-10-16 01:18:54.338349','13:00-22:00','M',2,'PGKS'),(3,'万晶晶','690269','2019-10-25 06:06:33.126787','2019-10-16 01:19:35.902308','15:00-24:00','M',2,'PGPD'),(4,'宋天余','644733','2019-10-25 06:06:24.848813','2019-10-16 01:20:23.248011','20:30-08:00','M',1,'PGPD'),(5,'吴延江','645487','2019-10-25 06:37:16.555999','2019-10-25 06:37:16.556029','13:00-22:00','M',3,'PGPD');
/*!40000 ALTER TABLE `sendEmail_emergency` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2019-10-25  6:41:50
