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
-- Table structure for table `sendEmail_osx`
--

DROP TABLE IF EXISTS `sendEmail_osx`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8 ;
CREATE TABLE `sendEmail_osx` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(1024) DEFAULT NULL,
  `update_time` datetime(6) NOT NULL,
  `add_time` datetime(6) NOT NULL,
  `series` varchar(1024) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sendEmail_osx`
--

LOCK TABLES `sendEmail_osx` WRITE;
/*!40000 ALTER TABLE `sendEmail_osx` DISABLE KEYS */;
INSERT INTO `sendEmail_osx` VALUES (1,'HighSierra FDR Script','2019-10-25 00:14:19.309769','2019-10-18 02:18:49.099076','HighSierra_10.13.4_17E199_TSBI_v1'),(2,'HighSierra Restore Script','2019-10-25 00:14:31.624900','2019-10-18 02:19:00.974793','HighSierra_10.13.4_17E199_TSBI_v1'),(3,'HighSierra SUPP/FDR Script','2019-10-25 00:14:40.946779','2019-10-18 02:19:12.085577','HighSierra_10.13.4_17E199_TSBI_v1'),(5,'Sierra FDR Script','2019-10-25 00:15:12.775337','2019-10-18 02:19:30.343452','Sierra_10.12.4_16E195_TSBI_v5'),(6,'Sierra Restore Script(Standard Sierra Restore Script)','2019-10-25 00:15:23.330323','2019-10-18 02:19:42.220968','Sierra_10.12.4_16E195_TSBI_v5'),(7,'Sierra SUPP/FDR  Script(Sierra SUPP/FDR Restore Script)','2019-10-25 00:15:30.421416','2019-10-18 02:19:54.924706','Sierra_10.12.4_16E195_TSBI_v5'),(8,'RF-Auto FDR Yosemite Restore Script','2019-10-25 00:16:15.135033','2019-10-18 02:20:25.005144','Yosemite_10.10.3_tsbi_14D131_v8'),(9,'Standard Yosemite Restore Script','2019-10-25 00:16:54.707237','2019-10-18 02:20:36.507172','Yosemite_10.10.3_tsbi_14D131_v8'),(10,'Yosemite FDR Script','2019-10-25 00:16:26.950355','2019-10-18 02:20:47.253114','Yosemite_10.10.3_tsbi_14D131_v8'),(11,'Yosemite SUPP/FDR  Script(Yosemite SUPP/FDR Restore Script)','2019-10-25 00:16:35.789544','2019-10-18 02:21:00.817020','Yosemite_10.10.3_tsbi_14D131_v8'),(12,'Mt Lion FDR Script','2019-10-25 00:17:23.603072','2019-10-18 02:21:11.771623','MtLion_10.8.2_12c3104_tsbi_1'),(13,'Standard Mountain Lion Restore Script','2019-10-25 00:17:31.542685','2019-10-18 02:21:23.029226','MtLion_10.8.2_12c3104_tsbi_1'),(14,'Standard SnowLeopard Restore Script','2019-10-25 00:17:53.936751','2019-10-18 02:21:34.262388','SnowLeopard10.6.2-091203'),(15,'Standard WinXP Restore Script for Video MacPro','2019-10-25 00:18:01.601142','2019-10-18 02:21:47.531756','SnowLeopard10.6.2-091203'),(16,'Standard WinXP Restore Script for MacMini','2019-10-25 00:18:07.847813','2019-10-18 02:21:58.605122','SnowLeopard10.6.2-091203');
/*!40000 ALTER TABLE `sendEmail_osx` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2019-10-25  0:57:53
