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
-- Table structure for table `sendEmail_ps`
--

DROP TABLE IF EXISTS `sendEmail_ps`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8 ;
CREATE TABLE `sendEmail_ps` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `page` varchar(256) DEFAULT NULL,
  `content` longtext,
  `update_time` datetime(6) NOT NULL,
  `add_time` datetime(6) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sendEmail_ps`
--

LOCK TABLES `sendEmail_ps` WRITE;
/*!40000 ALTER TABLE `sendEmail_ps` DISABLE KEYS */;
INSERT INTO `sendEmail_ps` VALUES (1,'page1','1.請確認所提需求的Server(確定需同時操作多個server可多選),確認無誤后點擊下一步可進入下一頁面;<br>\r\n2.點擊Clear將清除所有已選/填寫內容,請謹慎!<br>\r\n3.若申請線體/站位,或是變更需求較多,請點擊New Line Application Format下載參考模板;','2019-10-24 07:25:51.642663','2019-10-24 06:37:42.474608'),(2,'page2','1.請確認所提需求的Product(只允許單選),確認無誤后點擊下一步可進入下一頁面;<br>\r\n2.若發現上一頁面填寫有誤,可點擊Back返回上一頁;','2019-10-24 07:26:07.593353','2019-10-24 06:38:14.881043'),(3,'page3','1.請確認所提需求類型(只允許單選),確認無誤后點擊下一步可進入下一頁面;<br>\r\n2.若發現上一頁面填寫有誤,可點擊Back返回上一頁;','2019-10-24 07:28:00.204504','2019-10-24 06:38:45.106362'),(4,'page3-1','1.請確保所提Line Name規則正確,line的SFC URL以及需添加的站位(請注意填寫標準的StationID,即gh時所選的站位名,或參看ghDS上\"Test Station<br>\r\n2.若發現上一頁面填寫有誤,可點擊Back返回上一頁;','2019-10-24 07:27:51.809955','2019-10-24 06:39:19.271865'),(5,'page3-2','1.請確保所提站位名(請注意填寫標準的StationID,即gh時所選的站位名,或參看ghDS上\"Test Station Name\"列),以及欲添加到的Line Name正確,確認無誤后點擊下一步可進入下一頁面;<br>\r\n2.對於一個完全新增的Station Type請先確認其Floder在ghDS已存在,若不存在請聯繫Station DRI添加,然後再聯繫我們將其添加到相應的ghLS,同時請告知所需的Restore Script;<br>\r\n3.若發現上一頁面填寫有誤,可點擊Back返回上一頁;','2019-10-24 07:27:44.107774','2019-10-24 06:40:08.764578'),(6,'page3-3','1.請注意所提線別/站位名(請注意填寫標準的StationID,即gh時所選的站位名,或參看ghDS上\"Test Station Name\"列)標準性,確認無誤后點擊下一步可進入下一頁面;<br>\r\n2.若需對個別平行站位設定,請具體到Unit#或IP,如F05-3F-QE_SHIP-AS-FAIL_12#,F05-3F-QE_SW-DOENLOAD_13#或者10.18.133.138,10.18.133.122<br>\r\n3.若發現上一頁面填寫有誤,可點擊Back返回上一頁;','2019-10-24 07:27:31.519845','2019-10-24 06:40:55.292629'),(7,'page3-3-1','1.對Product提的Change Setting需求,請謹慎!如有其他特殊設定需求,請在Other Setting Change欄位輸入;<br>\r\n2.若發現上一頁面填寫有誤,可點擊Back返回上一頁;','2019-10-24 07:27:20.065915','2019-10-24 06:41:27.447584'),(8,'page3-3-2','1.請注意所提線別名準確性,確認無誤后點擊下一步可進入下一頁面;<br>\r\n2.若發現上一頁面填寫有誤,可點擊Back返回上一頁;','2019-10-24 07:27:10.962180','2019-10-24 06:42:04.416229'),(9,'page3-3-3','1.請注意所提站位名(請注意填寫標準的StationID,即gh時所選的站位名,或參看ghDS上\"Test Station Name\"列)標準性,確認無誤后點擊下一步可進入下一頁面;<br>\r\n2.若發現上一頁面填寫有誤,可點擊Back返回上一頁;','2019-10-24 07:27:02.625897','2019-10-24 06:42:36.905128'),(10,'page3-3-4','1.請注意所提線別/站位名(請注意填寫標準的StationID,即gh時所選的站位名,或參看ghDS上\"Test Station Name\"列)標準性,可具體到Unit#或IP,確認無誤后點擊下一步可進入下一頁面;<br>\r\n2.若發現上一頁面填寫有誤,可點擊Back返回上一頁;','2019-10-24 07:26:51.763669','2019-10-24 06:43:07.731151'),(11,'page3-4','1.請注意所提線別名標準性,刪除請謹慎,確認無誤后點擊下一步可進入下一頁面;<br>\r\n2.若發現上一頁面填寫有誤,可點擊Back返回上一頁;','2019-10-24 07:26:38.767453','2019-10-24 06:43:38.719171'),(12,'page4','1.Title根據上面填寫內容自動生成,不需要填寫,如需變更,確認其他信息無誤后點擊Next在mail中修正,如有需要,也請記得帶附件;<br>\r\n2.Mail接收者和cc都可自行修改,不過一定要有pega gh support team;<br>\r\n3.若發現上一頁面填寫有誤,可點擊Back返回上一頁;<br>\r\n4.若申請線體/站位,或是變更需求較多,請點擊New Line Application Format下載參考模板;<br>\r\n5.啟用Core overlay Tab,同步overlay等事宜請聯繫Station DRI;添加/釋放Units事宜請聯繫各自相應的PE team;','2019-10-24 07:26:31.050877','2019-10-24 06:44:40.345623');
/*!40000 ALTER TABLE `sendEmail_ps` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2019-10-24  7:31:33
