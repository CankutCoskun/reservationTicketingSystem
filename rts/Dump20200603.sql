CREATE DATABASE  IF NOT EXISTS "reservations" /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `reservations`;
-- MySQL dump 10.13  Distrib 8.0.20, for Win64 (x86_64)
--
-- Host: cs308db-do-user-7358055-0.a.db.ondigitalocean.com    Database: reservations
-- ------------------------------------------------------
-- Server version	8.0.19

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

SET @@GLOBAL.GTID_PURGED=/*!80000 '+'*/ 'da9bdc25-7cbb-11ea-b5a3-da647458f95c:1-2377';

--
-- Table structure for table `Admins`
--

DROP TABLE IF EXISTS `Admins`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Admins` (
  `adminid` int NOT NULL AUTO_INCREMENT,
  `companyid` int NOT NULL,
  `admintype` enum('global','local') NOT NULL,
  PRIMARY KEY (`adminid`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Admins`
--

LOCK TABLES `Admins` WRITE;
/*!40000 ALTER TABLE `Admins` DISABLE KEYS */;
INSERT INTO `Admins` VALUES (1,5,'local'),(2,6,'local'),(3,0,'global');
/*!40000 ALTER TABLE `Admins` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Categories`
--

DROP TABLE IF EXISTS `Categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Categories` (
  `categoryid` int NOT NULL AUTO_INCREMENT,
  `eventid` int NOT NULL,
  `remaining` int NOT NULL,
  `price` int NOT NULL,
  `capacity` int NOT NULL,
  `categoryname` varchar(50) NOT NULL,
  `categorysymbol` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`categoryid`)
) ENGINE=InnoDB AUTO_INCREMENT=54 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Categories`
--

LOCK TABLES `Categories` WRITE;
/*!40000 ALTER TABLE `Categories` DISABLE KEYS */;
INSERT INTO `Categories` VALUES (4,94,200,55,200,'A','a'),(5,98,207,50,200,'A','b'),(6,98,108,25,100,'B',NULL),(13,99,100,55,100,'A',NULL),(14,105,40,45,40,'A',NULL),(15,105,200,150,200,'B',NULL),(19,105,300,45,300,'C',NULL),(20,106,25,255,25,'Loca',NULL),(21,106,253,150,250,'A-E',NULL),(22,106,85,15,85,'H-I',NULL),(23,107,58,100,40,'VIP','v'),(24,107,336,40,300,'Economy','e'),(25,109,400,1,400,'child','c'),(26,109,108,10,100,'student','s'),(29,110,51,25,50,'A','a'),(30,110,200,45,200,'B','b'),(31,110,100,45,100,'C','c'),(32,111,50,150,50,'A','a'),(33,111,40,45,40,'B','b'),(34,111,20,45,20,'C','c'),(35,112,100,100,100,'A','a'),(36,112,254,55,250,'B','b'),(37,113,100,150,100,'Loca','i'),(38,114,350,25,350,'Ayakta','a'),(39,113,107,40,100,'Ayakta','a'),(40,115,104,155,100,'A','a'),(41,115,50,35,50,'B','b'),(42,115,146,130,145,'C','c'),(43,116,100,150,100,'A','a'),(44,116,100,250,100,'B','b'),(45,118,100,155,100,'A','a'),(46,118,150,5,150,'Student','s'),(47,119,120,200,120,'A-E','a'),(48,119,120,115,120,'H-I','h'),(49,119,90,65,90,'J-K','j'),(50,123,100,10,100,'Student','s'),(51,123,50,50,50,'Business','b'),(52,124,100,10,100,'student','s'),(53,124,100,20,100,'Economy','e');
/*!40000 ALTER TABLE `Categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Companies`
--

DROP TABLE IF EXISTS `Companies`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Companies` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `adminId` int unsigned NOT NULL,
  `companyAddress` varchar(245) DEFAULT NULL,
  `imagePath` varchar(145) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name_UNIQUE` (`name`),
  UNIQUE KEY `adminId_UNIQUE` (`adminId`),
  CONSTRAINT `adminId` FOREIGN KEY (`adminId`) REFERENCES `Users` (`uid`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=27 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Companies`
--

LOCK TABLES `Companies` WRITE;
/*!40000 ALTER TABLE `Companies` DISABLE KEYS */;
INSERT INTO `Companies` VALUES (23,'Sabanci Universitesi','2020-05-10 13:23:24','2020-05-10 13:23:24',107,'Orta Mah. Üniversite Cad.  Tuzla/ISTANBUL,  Turkey','https://storage.googleapis.com/rts-files/1589117003337_su1.jpg'),(26,'ZORLU ','2020-06-02 21:43:59','2020-06-02 21:43:59',111,'Orta Mah. Üniversite Cad.  Tuzla/ISTANBUL,  Turkey','https://storage.googleapis.com/rts-files/1591134238633_download.png');
/*!40000 ALTER TABLE `Companies` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Events`
--

DROP TABLE IF EXISTS `Events`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Events` (
  `eId` int unsigned NOT NULL AUTO_INCREMENT,
  `title` varchar(145) DEFAULT NULL,
  `detail` varchar(6450) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `date` date DEFAULT NULL,
  `createdDate` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedDate` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `status` enum('ACTIVE','CANCELLED','PAST') NOT NULL DEFAULT 'ACTIVE',
  `imagePath` varchar(145) DEFAULT NULL,
  `cId` int unsigned DEFAULT NULL,
  `eType` enum('CONCERT','THEATRE','DANCE','STANDUP','MUSICAL','OPERA','BALLET') NOT NULL,
  `venueId` int DEFAULT NULL,
  `time` time DEFAULT NULL,
  `city` enum('ISTANBUL','IZMIR','ANTALYA','ANKARA','BURSA') DEFAULT NULL,
  PRIMARY KEY (`eId`),
  KEY `companyId_idx` (`cId`),
  KEY `venueId` (`venueId`),
  CONSTRAINT `cId` FOREIGN KEY (`cId`) REFERENCES `Companies` (`id`) ON DELETE CASCADE,
  CONSTRAINT `Events_ibfk_1` FOREIGN KEY (`venueId`) REFERENCES `Venues` (`vid`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=125 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Events`
--

LOCK TABLES `Events` WRITE;
/*!40000 ALTER TABLE `Events` DISABLE KEYS */;
INSERT INTO `Events` VALUES (112,'Pera','Pera\'dan Eşsiz Bir Konser Deneyimi! Pera Quasar Concept 4 Ekim’de Volkswagen Arena Sahnesi’nde...  Gökhan Mandır (vokal-gitar), Barış Ceylan (bas gitar) Kaya Sevinç (gitar) ve Hakan Ünalan\'dan (davul)\'dan kurulu Türk rock müziğinin son dönem en çok konuşulan gruplarından Pera, enerjik sahne performanslarını bir adım daha ileriye taşıyacak olan Pera Quasar Concept ile, 4 Ekim 2020 akşamı Volkswagen Arena\'da sahne alacak.  2012 yılından itibaren profesyonel kariyerlerine başlayan Pera, geride kalan 8 yıla 4 stüdyo albümü ve her biri büyük beğeni kazanan 8 tekli sığdırmayı başardı. Birçok üniversitede \'yılın grubu\' ünvanını kazanan, Tv\'lerde izlenme rekorları kıran Çukur, Medcezir, Kara Sevda, Kuzey Güney dizilerinde şarkıları kullanılan, sadece geçen yıl verdikleri konserlerle 350 binden fazla izleyici ile buluşan Pera, festivallerin de aranılan gruplarından biri oldu.  192 metrekarelik dev bir sahne, alev ve duman makineleri, kar makinesi, onlarca robotik ışık ve lazerin kullanılacağı konser grubun yeni albüm şarkılarını da ilk kez seslendireceği bir şov olacak. Gerek görsel, gerek teknik anlamında sınırları zorlayacak olan Pera Quasar Concept ile Pera, sektördeki yerini iyice sağlamlaştırmayı ve günlerce konuşulacak bir konsere imza atmayı hedefliyor.','2020-06-06','2020-06-03 09:09:14','2020-06-03 09:09:14','ACTIVE','https://storage.googleapis.com/rts-files/1591175354204_pera-66-vw.png',23,'CONCERT',15,'21:30:00','ISTANBUL'),(113,'Büyük Ev Ablukada','Büyük Ev Ablukada ilk kez 4 Haziran SGM sahnesinde...','2020-06-04','2020-06-03 09:13:11','2020-06-03 09:13:11','ACTIVE','https://storage.googleapis.com/rts-files/1591175591630_VNQ73_gorsel.png',23,'CONCERT',15,'22:00:00','ISTANBUL'),(114,'Istanbul Night Flight','\"Turkcell Platinum Istanbul Night Flight konserler serisi artık Avrupa’nın en iyi event ödülleriyle 4. sezonunda dinleyicisiyle buluşmaya hazırlanıyor.     Aya İrini ve Lütfi Kırdar Kongre Merkezi olmak üzere iki özel mekanda gerçekleşecek olan konserler serisi Events Across Turkey organizasyonuyla dünyaca önemli dünya starlarına kapısını açmaya hazırlanıyor.   2020 yılında Burgan Bank markasının da katkılarıyla Turkcell Platinum Istanbul Night Flight line-up’ın da dünyaca ünlü Hollywood starı The Music Critic Show gösterisiyle John Malkovich, Gramyy sahibi ve otoritelerce enstrümanında en iyisi olarak nitelendirilen Yo-Yo Ma, dünyaca ünlü Şef Jürgen Bruns yönetiminde Berlin Symphony Chamber Orchestra, her zamanki gibi özel quartet ekibiyle Karsu, Salzburg Symphony Chamber Orchestra, İlk kez İstanbul’da olacak Amerikalı idol piyanist Reuel, ve yine ilk kez İstanbul dinleyicisi ile buluşacak olan Joachim Horsley ve 29 Ekim Conductor / Composer Tuluğ Tırpan yönetiminde 120 kişilik kadrosuyla An Epic Symphony § Hayko Cepkin & Mercan Dede olarak ilk kez dinleyici karşısına çıkıyor. Birinci bölümde ise geçtiğimiz seneden hatırlayacağımız usta oyuncu Yurdaer Okur’un performansını yeniden görme fırsatı bulacağız.\"  Sınırlı sayıda dinleyici ile buluşabilecek bu muhteşem performanslarda kaçırmadan yerinizi ayırtın. ','2020-06-05','2020-06-03 09:14:57','2020-06-03 09:14:57','ACTIVE','https://storage.googleapis.com/rts-files/1591175697233_turkcellplatinum-244009610.png',23,'CONCERT',15,'23:00:00','ISTANBUL'),(115,'Amadeus','1984 yılında Milos Forman’ın yönetmenliğinde sinemaya uyarlanan Amadeus sinema tarihinin kült filmleri arasında da yerini alırken “En İyi Film” ve “En İyi Uyarlama” dahil olmak üzere toplam 8 dalda Oscar kazandı.  Yapımcı: Çolpan İlhan & Sadri Alışık Tiyatrosu ve Piu Entertainment Yazan: Peter Shaffer Çeviren: Nüvit Özdoğru Yöneten: Işıl Kasapoğlu Dekor: Hakan Dündar Kostüm: Nalan Alaylı Işık: Kerem Çetinel Müzik Direktörü: Volkan Akkoç Hareket Düzeni: Senem Oluz Dramaturg: Bilge Su Kasapoğlu Saç Makyajı: Neriman Eröz Yaratıcı Ajans: Happy People Project Prodüksiyon Şirketi: Anima İstanbul Fotoğraflar: Serdar Acar Reji Asistanları: Mebruke Eraslan, Dilay Yıldız Yapım Asistanları: Cihan Akbilek, Ferdi Taşkın Sahne Tasarım Asistanı: Merve Yörük Kostüm Tasarım Asistanı: Nadide Çoban  Oyuncular Antonio Salieri: Selçuk Yöntem  Wolfgang Amadeus Mozart: Okan Bayülgen  Costanze Weber: Özlem Öçalmaz  Baron Gottfried Van Swieten: Ahmet Mark Somers  Kont Franz Orsini-Rosenberg: Kevork Türker  II. Venticello: Sabri Özmener  I. Venticello: Yiğit Pakmen  Kont Johann K. Von Strack: Murat Yılmaz Avusturya Kralı II. Joseph: Cihan Ayhan  Katherina Cavalieri: Ceren Aydın Akkoç  / Ayşe Yakut Somer Teresa Salieri: Dilay Yıldız Kâhya: Numan Direkçi Uşak: Cihan Akbilek  Aşçı: Ferdi Taşkın  Koro Koro: Nazlı Uğurtaş Koro: Anıl Önder Koro: Buğra Uğur Koro: Uğur Etiler Koro: Ayşe Yakut Somer / Selin Uzun Koro: Cansın Hazan Bayrak Koro: Günselin Seda Çetinkaya Koro: Emre Peynircioğlu Koro: Şahin Dedemen / Metehan Pektaş Koro: Mualla Dedemen / İrem Büşra Bayır Koro: Ceren Aydın Akkoç Koro: Cihan Ayhan  Orkestra Şef: Volkan Akkoç Piyano: Ozan Zencir 1. Keman: Ekin Güldoğan / Oya Çeki / Selin Yağmur Usul 2. Keman: Rüzgâr Turgay / Derya Yağcılar / Bahar Erünsal Viyola:  Gizem Anafarta / Çağatay Şahin   Viyolonsel: Esin Taşkın ','2020-06-30','2020-06-03 09:23:02','2020-06-03 09:23:02','ACTIVE','https://storage.googleapis.com/rts-files/1591176181867_amadeuss.png',23,'THEATRE',15,'20:30:00','ISTANBUL'),(118,'Bir Garip Orhan Veli - Reha Özcan','eha Özcan\'ın sahnelediği Bir Garip Orhan Veli, seyircisiyle buluşmaya devam ediyor.  Orhan Veli, şiirleri ile umudu yükleyen, yaşama sevincini hissettiren, İstanbul’a sevdalı, ideallerinin, tutkularının peşinde koşan, 36 yıllık hayatına muazzam eserler sığdıran, bu topraklardan geçtiği için şükran duyduğumuz bir şair.  Murathan Mungan\'ın yazdığı Murat Sarı’nın yönettiği oyun Reha Özcan tarafından sahneleniyor.  “İşim gücüm budur benim,  Gökyüzünü boyarım her sabah.  Hepiniz uykudayken.  Uyanır bakarsınız ki mavi.   Deniz yırtılır kimi zaman,  Bilmezsiniz kim diker;  Ben dikerim.   Dalga geçerim kimi zaman da,  O da benim vazifem;  Bir baş düşünürüm başımda,  Bir mide düşünürüm midemde,  Bir ayak düşünürüm ayağımda,  Ne haltedeceğimi bilemem “  Orhan Veli Kanık ','2020-06-07','2020-06-03 09:30:40','2020-06-03 09:30:40','ACTIVE','https://storage.googleapis.com/rts-files/1591176640443_bgov-rehagrup.png',23,'THEATRE',15,'21:00:00','ISTANBUL'),(119,'BKM Tiyatro','Beşiktaş Kültür Merkezi\'nde dopdolu bir sezon devam ediyor.  BKM’de sezon boyunca birbirinden komik ve eğlenceli tiyatro oyunları, stand-up gösteriler, televizyon showları, çocuk gösterileri seyirciyle buluşuyor!   Sanat, komedi ve eğlencenin Beşiktaş’daki en merkezi ve uğrak mekanı BKM, küçükten büyüğe herkese hitap eden içeriğiyle seyircisine çok geniş bir yelpaze sunuyor.   Çok Güzel Hareketler Bunlar 2 , Güldür Güldür Show ve Ata Demirer Gazinosu Bkm Tiyatro’nun lokomotif etkinlikleri arasında her hafta seyirciyle buluşurken, pek çok gösteri ve oyun da takvimde yerini alıyor.','2020-06-08','2020-06-03 09:34:24','2020-06-03 09:34:24','ACTIVE','https://storage.googleapis.com/rts-files/1591176863634_bkmtiyatro_133762201.png',23,'THEATRE',15,'20:00:00','ISTANBUL'),(122,'Tiyatro 2','Moliere\'s game','2020-06-13','2020-06-03 09:58:43','2020-06-03 09:58:43','ACTIVE','https://storage.googleapis.com/rts-files/1591178323414_dimitri_bkm_2020_2.png',23,'THEATRE',15,'13:40:00','ISTANBUL'),(124,'Tiyatro Gösterisi','Moliere\'s game','2020-07-01','2020-06-03 10:41:36','2020-06-03 10:41:36','ACTIVE','https://storage.googleapis.com/rts-files/1591180895697_451-Z6S12.png',23,'THEATRE',15,'13:40:00','ISTANBUL');
/*!40000 ALTER TABLE `Events` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Invoice`
--

DROP TABLE IF EXISTS `Invoice`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Invoice` (
  `iid` int NOT NULL AUTO_INCREMENT,
  `tid` int unsigned DEFAULT NULL,
  `invoicepath` varchar(145) DEFAULT NULL,
  `type` enum('Purchase','Cancellation') NOT NULL DEFAULT 'Purchase',
  `price` int unsigned NOT NULL,
  PRIMARY KEY (`iid`),
  KEY `id_idx` (`tid`),
  CONSTRAINT `id` FOREIGN KEY (`tid`) REFERENCES `Tickets` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=110 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Invoice`
--

LOCK TABLES `Invoice` WRITE;
/*!40000 ALTER TABLE `Invoice` DISABLE KEYS */;
INSERT INTO `Invoice` VALUES (1,77,'a','Purchase',1),(2,83,'https://storage.googleapis.com/rts-files/1590536738271_tiyatro1.png','Purchase',1),(10,101,NULL,'Purchase',100),(11,102,NULL,'Purchase',100),(12,103,NULL,'Purchase',100),(13,104,NULL,'Purchase',100),(14,105,NULL,'Purchase',100),(15,106,NULL,'Purchase',100),(16,107,NULL,'Purchase',100),(17,108,NULL,'Purchase',100),(18,109,NULL,'Purchase',100),(19,110,NULL,'Purchase',100),(20,111,NULL,'Purchase',100),(21,112,NULL,'Purchase',100),(22,113,NULL,'Purchase',100),(23,114,NULL,'Purchase',100),(24,115,NULL,'Purchase',100),(25,116,NULL,'Purchase',100),(26,117,'https://storage.googleapis.com/rts-files/26_invoice.pdf','Purchase',100),(27,118,'https://storage.googleapis.com/rts-files/27_invoice.pdf','Purchase',50),(28,119,'https://storage.googleapis.com/rts-files/28_invoice.pdf','Purchase',50),(29,120,NULL,'Purchase',100),(30,121,NULL,'Purchase',100),(31,122,'https://storage.googleapis.com/rts-files/31_invoice.pdf','Purchase',100),(32,123,'https://storage.googleapis.com/rts-files/32_invoice.pdf','Purchase',100),(33,124,'https://storage.googleapis.com/rts-files/33_invoice.pdf','Purchase',100),(34,125,'https://storage.googleapis.com/rts-files/34_invoice.pdf','Purchase',100),(35,126,NULL,'Purchase',100),(36,127,'https://storage.googleapis.com/rts-files/36_invoice.pdf','Purchase',100),(37,128,'https://storage.googleapis.com/rts-files/37_invoice.pdf','Purchase',100),(38,129,'https://storage.googleapis.com/rts-files/38_invoice.pdf','Purchase',100),(39,130,NULL,'Purchase',100),(40,131,NULL,'Purchase',100),(41,132,NULL,'Purchase',100),(42,133,'https://storage.googleapis.com/rts-files/42_invoice.pdf','Purchase',100),(43,134,'https://storage.googleapis.com/rts-files/43_invoice.pdf','Purchase',100),(44,135,'https://storage.googleapis.com/rts-files/44_invoice.pdf','Purchase',100),(45,136,NULL,'Purchase',50),(46,137,'https://storage.googleapis.com/rts-files/46_invoice.pdf','Purchase',50),(47,138,'https://storage.googleapis.com/rts-files/47_invoice.pdf','Purchase',50),(48,139,'https://storage.googleapis.com/rts-files/48_invoice.pdf','Purchase',50),(49,140,'https://storage.googleapis.com/rts-files/49_invoice.pdf','Purchase',150),(79,170,'https://storage.googleapis.com/rts-files/79_invoice.pdf','Purchase',3),(80,171,'https://storage.googleapis.com/rts-files/80_invoice.pdf','Purchase',3),(81,172,NULL,'Purchase',4),(82,173,NULL,'Purchase',4),(83,174,NULL,'Purchase',30),(84,175,'https://storage.googleapis.com/rts-files/84_invoice.pdf','Purchase',4),(85,176,'https://storage.googleapis.com/rts-files/85_invoice.pdf','Purchase',20),(86,177,'https://storage.googleapis.com/rts-files/86_invoice.pdf','Purchase',20),(87,178,'https://storage.googleapis.com/rts-files/87_invoice.pdf','Purchase',20),(88,179,'https://storage.googleapis.com/rts-files/88_invoice.pdf','Purchase',5),(89,180,'https://storage.googleapis.com/rts-files/89_invoice.pdf','Purchase',200),(90,181,'https://storage.googleapis.com/rts-files/90_invoice.pdf','Purchase',20),(91,182,'https://storage.googleapis.com/rts-files/91_invoice.pdf','Purchase',10),(94,187,'https://storage.googleapis.com/rts-files/94_invoice.pdf','Purchase',2),(95,188,'https://storage.googleapis.com/rts-files/95_invoice.pdf','Purchase',2),(96,189,'https://storage.googleapis.com/rts-files/96_invoice.pdf','Purchase',1),(97,190,'https://storage.googleapis.com/rts-files/97_invoice.pdf','Purchase',2),(99,192,'https://storage.googleapis.com/rts-files/99_invoice.pdf','Purchase',2),(100,193,NULL,'Purchase',10),(101,194,NULL,'Purchase',20),(109,202,'https://storage.googleapis.com/rts-files/109_invoice.pdf','Purchase',620);
/*!40000 ALTER TABLE `Invoice` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Tickets`
--

DROP TABLE IF EXISTS `Tickets`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Tickets` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `userid` int unsigned DEFAULT NULL,
  `categoryid` int NOT NULL,
  `peoplenumber` int NOT NULL,
  `status` varchar(255) NOT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `seatlist` varchar(200) DEFAULT NULL,
  `eventid` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `uid_idx` (`userid`),
  CONSTRAINT `uid` FOREIGN KEY (`userid`) REFERENCES `Users` (`uid`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=203 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Tickets`
--

LOCK TABLES `Tickets` WRITE;
/*!40000 ALTER TABLE `Tickets` DISABLE KEYS */;
INSERT INTO `Tickets` VALUES (75,36,1,1,'ACTIVE','2020-05-21 13:01:34','2020-05-21 13:01:34',NULL,NULL),(76,36,1,1,'ACTIVE','2020-05-21 13:02:26','2020-05-21 13:02:26',NULL,NULL),(77,36,1,1,'ACTIVE','2020-05-21 13:02:43','2020-05-21 13:02:43',NULL,NULL),(78,36,1,1,'ACTIVE','2020-05-21 13:03:45','2020-05-21 13:03:45',NULL,NULL),(79,36,1,1,'ACTIVE','2020-05-21 13:04:13','2020-05-21 13:04:13',NULL,NULL),(80,36,2,1,'ACTIVE','2020-05-21 13:04:55','2020-05-21 13:04:55',NULL,NULL),(81,32,5,3,'ACTIVE','2020-05-27 17:57:53','2020-05-27 17:57:53',NULL,NULL),(82,36,5,3,'ACTIVE','2020-05-27 19:01:27','2020-05-27 19:01:27',NULL,NULL),(83,36,5,3,'ACTIVE','2020-05-27 19:07:19','2020-05-27 19:07:19',NULL,NULL),(84,36,5,2,'ACTIVE','2020-05-27 19:14:30','2020-05-27 19:14:30',NULL,NULL),(85,37,6,3,'ACTIVE','2020-05-31 15:56:17','2020-05-31 15:56:17',NULL,NULL),(86,32,7,2,'ACTIVE','2020-06-01 16:15:50','2020-06-01 16:15:50',NULL,NULL),(101,85,5,2,'ACTIVE','2020-06-01 21:01:51','2020-06-01 21:01:51',NULL,NULL),(102,85,5,2,'ACTIVE','2020-06-01 21:53:17','2020-06-01 21:53:17',NULL,NULL),(103,85,5,2,'ACTIVE','2020-06-01 22:11:53','2020-06-01 22:11:53',NULL,NULL),(104,85,5,2,'ACTIVE','2020-06-01 22:23:53','2020-06-01 22:23:53',NULL,NULL),(105,85,5,2,'ACTIVE','2020-06-01 22:24:42','2020-06-01 22:24:42',NULL,NULL),(106,85,5,2,'ACTIVE','2020-06-02 10:29:14','2020-06-02 10:29:14',NULL,NULL),(107,85,5,2,'ACTIVE','2020-06-02 10:31:18','2020-06-02 10:31:18',NULL,NULL),(108,85,5,2,'ACTIVE','2020-06-02 10:40:18','2020-06-02 10:40:18',NULL,NULL),(109,85,5,2,'ACTIVE','2020-06-02 10:43:49','2020-06-02 10:43:49',NULL,NULL),(110,85,5,2,'ACTIVE','2020-06-02 10:44:15','2020-06-02 10:44:15',NULL,NULL),(111,85,5,2,'ACTIVE','2020-06-02 10:45:10','2020-06-02 10:45:10',NULL,NULL),(112,85,5,2,'ACTIVE','2020-06-02 10:46:26','2020-06-02 10:46:26',NULL,NULL),(113,85,5,2,'ACTIVE','2020-06-02 10:46:51','2020-06-02 10:46:51',NULL,NULL),(114,85,5,2,'ACTIVE','2020-06-02 10:47:06','2020-06-02 10:47:06',NULL,NULL),(115,85,5,2,'ACTIVE','2020-06-02 10:53:11','2020-06-02 10:53:11',NULL,NULL),(116,85,5,2,'ACTIVE','2020-06-02 10:54:26','2020-06-02 10:54:26',NULL,NULL),(117,85,5,2,'ACTIVE','2020-06-02 11:02:21','2020-06-02 11:02:21',NULL,NULL),(118,85,5,1,'ACTIVE','2020-06-02 11:17:20','2020-06-02 11:17:20',NULL,NULL),(119,85,5,1,'ACTIVE','2020-06-02 11:23:00','2020-06-02 11:23:00',NULL,NULL),(120,85,5,2,'ACTIVE','2020-06-02 12:15:24','2020-06-02 12:15:24',NULL,NULL),(121,85,5,2,'ACTIVE','2020-06-02 12:17:36','2020-06-02 12:17:36',NULL,NULL),(122,85,5,2,'ACTIVE','2020-06-02 12:21:43','2020-06-02 12:21:43',NULL,NULL),(123,85,5,2,'ACTIVE','2020-06-02 12:23:28','2020-06-02 12:23:28',NULL,NULL),(124,85,5,2,'ACTIVE','2020-06-02 12:27:14','2020-06-02 12:27:14',NULL,NULL),(125,85,5,2,'ACTIVE','2020-06-02 12:28:05','2020-06-02 12:28:05',NULL,NULL),(126,85,5,2,'ACTIVE','2020-06-02 12:31:43','2020-06-02 12:31:43',NULL,NULL),(127,85,5,2,'ACTIVE','2020-06-02 12:33:07','2020-06-02 12:33:07',NULL,NULL),(128,85,5,2,'ACTIVE','2020-06-02 12:41:32','2020-06-02 12:41:32',NULL,NULL),(129,85,5,2,'ACTIVE','2020-06-02 12:46:42','2020-06-02 12:46:42',NULL,NULL),(130,85,5,2,'ACTIVE','2020-06-02 12:49:13','2020-06-02 12:49:13',NULL,NULL),(131,85,5,2,'ACTIVE','2020-06-02 13:04:43','2020-06-02 13:04:43',NULL,NULL),(132,85,5,2,'ACTIVE','2020-06-02 13:07:03','2020-06-02 13:07:03',NULL,NULL),(133,85,5,2,'ACTIVE','2020-06-02 13:07:32','2020-06-02 13:07:32',NULL,NULL),(134,85,5,2,'ACTIVE','2020-06-02 13:10:53','2020-06-02 13:10:53',NULL,NULL),(135,85,5,2,'ACTIVE','2020-06-02 13:14:01','2020-06-02 13:14:01',NULL,NULL),(136,85,5,1,'ACTIVE','2020-06-02 15:04:10','2020-06-02 15:04:10',NULL,NULL),(137,85,5,1,'ACTIVE','2020-06-02 15:05:31','2020-06-02 15:05:31',NULL,NULL),(138,85,6,2,'ACTIVE','2020-06-02 15:40:23','2020-06-02 15:40:23',NULL,NULL),(139,85,6,2,'ACTIVE','2020-06-02 15:49:51','2020-06-02 15:49:51',NULL,NULL),(140,37,5,3,'ACTIVE','2020-06-02 15:52:49','2020-06-02 15:52:49',NULL,NULL),(170,37,25,3,'ACTIVE','2020-06-03 03:53:18','2020-06-03 03:53:18',NULL,NULL),(171,37,25,3,'ACTIVE','2020-06-03 03:53:46','2020-06-03 03:53:46',NULL,NULL),(172,37,25,4,'ACTIVE','2020-06-03 03:59:07','2020-06-03 03:59:07',NULL,NULL),(173,37,25,4,'ACTIVE','2020-06-03 03:59:13','2020-06-03 03:59:13',NULL,NULL),(174,37,26,3,'ACTIVE','2020-06-03 04:01:45','2020-06-03 04:01:45',NULL,NULL),(175,37,25,4,'ACTIVE','2020-06-03 04:03:45','2020-06-03 04:03:45',NULL,NULL),(176,37,26,2,'ACTIVE','2020-06-03 04:30:13','2020-06-03 04:30:13',NULL,NULL),(177,37,26,2,'ACTIVE','2020-06-03 04:36:20','2020-06-03 04:36:20','3_1,  3_3,  ',NULL),(178,37,26,2,'ACTIVE','2020-06-03 05:01:32','2020-06-03 05:01:32','3_2,  3_4,  ',NULL),(179,37,25,5,'ACTIVE','2020-06-03 05:02:17','2020-06-03 05:02:17','1_21,  1_20,  1_19,  1_18,  1_17,  ',NULL),(180,37,24,5,'ACTIVE','2020-06-03 05:20:04','2020-06-03 05:20:04','2_1,  2_2,  2_3,  2_4,  2_5,  ',107),(181,37,26,2,'ACTIVE','2020-06-03 05:32:19','2020-06-03 05:32:19','3_16,  3_15,  ',109),(182,37,26,1,'ACTIVE','2020-06-03 05:34:57','2020-06-03 05:34:57','3_21,  ',109),(185,37,25,1,'ACTIVE','2020-06-03 06:40:06','2020-06-03 06:40:06','1_10,  ',109),(186,37,25,1,'ACTIVE','2020-06-03 06:42:06','2020-06-03 06:42:06','1_10,  ',109),(187,37,25,2,'ACTIVE','2020-06-03 06:43:38','2020-06-03 06:43:38','1_9 1_8,  ',109),(188,37,25,2,'ACTIVE','2020-06-03 06:56:28','2020-06-03 06:56:28','1_1,  1_2 ',109),(189,37,25,1,'ACTIVE','2020-06-03 06:57:11','2020-06-03 06:57:11','1_3 ',109),(190,37,25,2,'ACTIVE','2020-06-03 07:11:40','2020-06-03 07:11:40','1_13,  1_14 ',109),(192,32,25,2,'ACTIVE','2020-06-03 08:06:00','2020-06-03 08:06:00','1_6,  1_7 ',109),(193,37,26,1,'ACTIVE','2020-06-03 08:16:39','2020-06-03 08:16:39','3_6 ',109),(194,37,26,2,'ACTIVE','2020-06-03 08:26:24','2020-06-03 08:26:24','3_10,  3_9 ',109),(202,37,40,4,'ACTIVE','2020-06-03 10:45:58','2020-06-03 10:45:58','3_5,  3_6,  3_7,  3_8 ',115);
/*!40000 ALTER TABLE `Tickets` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Users`
--

DROP TABLE IF EXISTS `Users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Users` (
  `uid` int unsigned NOT NULL AUTO_INCREMENT,
  `username` varchar(45) NOT NULL,
  `password` varchar(45) NOT NULL,
  `usertype` enum('LOCAL','GLOBAL','CUSTOMER') NOT NULL DEFAULT 'CUSTOMER',
  `email` varchar(90) DEFAULT NULL,
  `name` varchar(60) DEFAULT NULL,
  `surname` varchar(60) DEFAULT NULL,
  `creditcardnum` int DEFAULT NULL,
  `creditcardexpmon` int DEFAULT NULL,
  `creditcardexpyear` int DEFAULT NULL,
  `creditcardexpcvc` int DEFAULT NULL,
  `createdAt` datetime DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`uid`),
  UNIQUE KEY `username_UNIQUE` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=112 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Users`
--

LOCK TABLES `Users` WRITE;
/*!40000 ALTER TABLE `Users` DISABLE KEYS */;
INSERT INTO `Users` VALUES (32,'cankutcoskun','pass','CUSTOMER','cankutcoskun@gmail.com','Cankut','Coskun',NULL,NULL,NULL,NULL,'2020-04-15 08:09:00','2020-04-15 08:09:00'),(36,'yunuscelik','pass','CUSTOMER','yunuscelik@sabanciuniv.edu','Yunus','Çelik',NULL,NULL,NULL,NULL,'2020-04-15 08:09:46','2020-04-15 08:09:46'),(37,'berkozturk','b','CUSTOMER','berkozturk@sabanciuniv.edu','Berk','Öztürk',NULL,NULL,NULL,NULL,'2020-04-15 08:09:56','2020-04-15 08:09:56'),(38,'globaladmin','pass','GLOBAL',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2020-04-15 08:12:58','2020-04-15 08:12:58'),(42,'dilekcoskun','pass','CUSTOMER','dilek@example.com',NULL,NULL,NULL,NULL,NULL,NULL,'2020-04-15 09:35:18','2020-04-15 09:35:18'),(43,'hscoskun','pass','CUSTOMER','hs@example.com',NULL,NULL,NULL,NULL,NULL,NULL,'2020-04-15 09:38:09','2020-04-15 09:38:09'),(46,'zerenalpoguz','pass','CUSTOMER','zerenalpoguz@example.com',NULL,NULL,NULL,NULL,NULL,NULL,'2020-04-15 14:16:21','2020-04-15 14:16:21'),(55,'saziye','pass','CUSTOMER','saziye@gmail.com','saziye','hamzaoğlu',NULL,NULL,NULL,NULL,'2020-04-17 19:12:50','2020-04-17 19:12:50'),(73,'bozturk10','berk','CUSTOMER','bozturk468@gmail.com','Berk Öztürk','Öztürk',NULL,NULL,NULL,NULL,'2020-04-18 12:49:34','2020-04-18 12:49:34'),(85,'egea','123','CUSTOMER','egearikan@sabanciuniv.edu','Ege','Arikan',NULL,NULL,NULL,NULL,'2020-04-19 13:49:42','2020-04-19 13:49:42'),(86,'denizhamzaoglu','pass123','CUSTOMER','saziye@sabanciuniv.edu','deniz','hamzaoglu',NULL,NULL,NULL,NULL,'2020-04-19 13:51:18','2020-04-19 13:51:18'),(88,'baran1','pass123','CUSTOMER','barangayretli@sabanciuniv.edu','baran','gayretli',NULL,NULL,NULL,NULL,'2020-04-19 13:54:01','2020-04-19 13:54:01'),(103,'oneymis','pass','CUSTOMER','alperbingol@sabanciuniv.edu','Alper2 ','Bingol',NULL,NULL,NULL,NULL,'2020-05-07 14:38:51','2020-05-07 14:38:51'),(107,'sabanci','pass','LOCAL','cankutcoskun@sabanciuniv.edu',NULL,NULL,NULL,NULL,NULL,NULL,'2020-05-10 13:23:23','2020-05-10 13:23:23'),(111,'zorlu','pass','LOCAL','bozturk468@gmail.com',NULL,NULL,NULL,NULL,NULL,NULL,'2020-06-02 21:43:58','2020-06-02 21:43:58');
/*!40000 ALTER TABLE `Users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Venues`
--

DROP TABLE IF EXISTS `Venues`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Venues` (
  `vid` int NOT NULL AUTO_INCREMENT,
  `vcapacity` int NOT NULL,
  `name` varchar(45) DEFAULT NULL,
  `cid` varchar(45) NOT NULL,
  `imagePath` varchar(145) DEFAULT NULL,
  `address` varchar(245) DEFAULT NULL,
  PRIMARY KEY (`vid`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Venues`
--

LOCK TABLES `Venues` WRITE;
/*!40000 ALTER TABLE `Venues` DISABLE KEYS */;
INSERT INTO `Venues` VALUES (12,500,'ZORLU PSM','25','https://storage.googleapis.com/rts-files/1591130426140_download.jpeg','Tuzla/Istanbul'),(14,350,'ZORLU PSM','26','https://storage.googleapis.com/rts-files/1591174282828_MH_U5A99_2.gif',NULL),(15,450,'SGM','23','https://storage.googleapis.com/rts-files/1591174977121_BK_U5B28.gif',NULL),(17,250,'FASS','23','https://storage.googleapis.com/rts-files/1591175047168_1.gif',NULL);
/*!40000 ALTER TABLE `Venues` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `eventseatrows`
--

DROP TABLE IF EXISTS `eventseatrows`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `eventseatrows` (
  `seatrowid` int NOT NULL AUTO_INCREMENT,
  `eventid` int DEFAULT NULL,
  `rowid` int DEFAULT NULL,
  `rowstr` varchar(1000) DEFAULT NULL,
  PRIMARY KEY (`seatrowid`)
) ENGINE=InnoDB AUTO_INCREMENT=58 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `eventseatrows`
--

LOCK TABLES `eventseatrows` WRITE;
/*!40000 ALTER TABLE `eventseatrows` DISABLE KEYS */;
INSERT INTO `eventseatrows` VALUES (1,98,1,'aaa'),(2,98,2,'bbb'),(3,98,3,'c_c'),(4,107,1,'vvvvv_vvvvv'),(5,107,2,'eeeee_eeeee'),(6,107,3,'eeeee_eeeee'),(7,109,1,'ccccccccccccccccccccc'),(8,109,2,'_________________'),(9,109,3,'sssssssssssssssssssss'),(10,110,1,'aaa'),(11,110,2,'b_b'),(12,110,3,'ccc'),(13,111,1,'aaa_aa'),(14,111,2,'bbb_b_'),(15,111,3,'ccc_c_'),(16,112,1,'aaaaaa____'),(17,112,2,'bbbbbbbbbb'),(18,112,3,'bbbbbbbbbb'),(19,112,4,'bbbbbbbbbb'),(20,113,1,'_____iiiiii____'),(21,113,2,'aaaaaaaaaaaaaaa'),(22,113,3,'aaaaaaaaaaaaaaa'),(23,113,4,'aaaaaaaaaaaaaaa'),(24,113,5,'aaaaaaaaaaaaaaa'),(25,113,6,'aaaaaaaaaaaaaaa'),(26,114,1,'aaaaaaaaaaaaaaaaaaaaaaaa'),(27,114,2,'aaaaaaaaaaaaaaaaaaaaaaaa'),(28,115,1,'bbbbaaaabbbb'),(29,115,2,'bbbbaaaabbbb'),(30,115,3,'bbbbaaaabbbb'),(31,115,4,'cccccccccccccc'),(32,115,5,'cccccccccccccc'),(33,115,6,'cccccccccccccc'),(34,116,1,'aaaaaaaaaa'),(35,116,2,'bbbb__bbbb'),(36,116,3,'bbbb__bbbb'),(37,118,1,'aaaaaaaaaa'),(38,118,2,'aaaaaaaaaa'),(39,118,3,'__________'),(40,118,4,'ssssssssss'),(41,118,5,'ssssssssss'),(42,118,6,'ssssssssss'),(43,119,1,'aaaaaa_aaaaaa'),(44,119,2,'aaaaaa_aaaaaa'),(45,119,3,'_____________'),(46,119,4,'hhhhhh_hhhhhh'),(47,119,5,'hhhhhh_hhhhhh'),(48,119,6,'jjjjjj_jjjjjj\r'),(49,123,1,'bbbbbbb_'),(50,123,2,'bbbbbbb_'),(51,123,3,'bbbbbbb_'),(52,123,4,'ssssssssss'),(53,123,5,'ssssssssss'),(54,124,1,'sssssssss'),(55,124,2,'sssss___'),(56,124,3,'eeeeeeee'),(57,124,4,'eeeeeeee');
/*!40000 ALTER TABLE `eventseatrows` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `eventseats`
--

DROP TABLE IF EXISTS `eventseats`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `eventseats` (
  `seatid` int NOT NULL AUTO_INCREMENT,
  `rowId` int DEFAULT NULL,
  `columnId` int DEFAULT NULL,
  `eventId` int DEFAULT NULL,
  `symbol` varchar(5) DEFAULT NULL,
  `status` varchar(200) DEFAULT NULL,
  PRIMARY KEY (`seatid`)
) ENGINE=InnoDB AUTO_INCREMENT=553 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `eventseats`
--

LOCK TABLES `eventseats` WRITE;
/*!40000 ALTER TABLE `eventseats` DISABLE KEYS */;
INSERT INTO `eventseats` VALUES (1,1,1,98,'a','active'),(2,1,2,98,'a','active'),(3,1,3,98,'a','active'),(4,2,1,98,'b','active'),(5,2,2,98,'b','active'),(6,2,3,98,'b','active'),(7,3,1,98,'c','active'),(8,3,3,98,'c','active'),(9,1,1,107,'v','active'),(10,1,2,107,'v','active'),(11,1,3,107,'v','active'),(12,1,4,107,'v','active'),(13,1,5,107,'v','active'),(14,1,7,107,'v','booked'),(15,1,8,107,'v','active'),(16,1,9,107,'v','active'),(17,1,10,107,'v','active'),(18,1,11,107,'v','active'),(19,2,1,107,'e','booked'),(20,2,2,107,'e','booked'),(21,2,3,107,'e','booked'),(22,2,4,107,'e','booked'),(23,2,5,107,'e','booked'),(24,2,7,107,'e','active'),(25,2,8,107,'e','active'),(26,2,9,107,'e','active'),(27,2,10,107,'e','active'),(28,2,11,107,'e','active'),(29,3,1,107,'e','active'),(30,3,2,107,'e','active'),(31,3,3,107,'e','active'),(32,3,4,107,'e','active'),(33,3,5,107,'e','active'),(34,3,7,107,'e','active'),(35,3,8,107,'e','active'),(36,3,9,107,'e','active'),(37,3,10,107,'e','active'),(38,3,11,107,'e','active'),(39,1,1,109,'c','booked'),(40,1,2,109,'c','booked'),(41,1,3,109,'c','booked'),(42,1,4,109,'c','active'),(43,1,5,109,'c','active'),(44,1,6,109,'c','booked'),(45,1,7,109,'c','booked'),(46,1,8,109,'c','booked'),(47,1,9,109,'c','booked'),(48,1,10,109,'c','booked'),(49,1,11,109,'c','active'),(50,1,12,109,'c','active'),(51,1,13,109,'c','booked'),(52,1,14,109,'c','booked'),(53,1,15,109,'c','active'),(54,1,16,109,'c','active'),(55,1,17,109,'c','booked'),(56,1,18,109,'c','booked'),(57,1,19,109,'c','booked'),(58,1,20,109,'c','booked'),(59,1,21,109,'c','booked'),(60,3,1,109,'s','booked'),(61,3,2,109,'s','booked'),(62,3,3,109,'s','booked'),(63,3,4,109,'s','booked'),(64,3,5,109,'s','active'),(65,3,6,109,'s','booked'),(66,3,7,109,'s','active'),(67,3,8,109,'s','active'),(68,3,9,109,'s','booked'),(69,3,10,109,'s','booked'),(70,3,11,109,'s','active'),(71,3,12,109,'s','booked'),(72,3,13,109,'s','booked'),(73,3,14,109,'s','active'),(74,3,15,109,'s','booked'),(75,3,16,109,'s','booked'),(76,3,17,109,'s','booked'),(77,3,18,109,'s','active'),(78,3,19,109,'s','active'),(79,3,20,109,'s','active'),(80,3,21,109,'s','booked'),(81,1,1,110,'a','active'),(82,1,2,110,'a','active'),(83,1,3,110,'a','active'),(84,2,1,110,'b','active'),(85,2,3,110,'b','active'),(86,3,1,110,'c','active'),(87,3,2,110,'c','active'),(88,3,3,110,'c','active'),(89,1,1,111,'a','active'),(90,1,2,111,'a','active'),(91,1,3,111,'a','active'),(92,1,5,111,'a','active'),(93,1,6,111,'a','active'),(94,2,1,111,'b','active'),(95,2,2,111,'b','active'),(96,2,3,111,'b','active'),(97,2,5,111,'b','active'),(98,3,1,111,'c','active'),(99,3,2,111,'c','active'),(100,3,3,111,'c','active'),(101,3,5,111,'c','active'),(102,1,1,112,'a','active'),(103,1,2,112,'a','active'),(104,1,3,112,'a','active'),(105,1,4,112,'a','active'),(106,1,5,112,'a','active'),(107,1,6,112,'a','active'),(108,2,1,112,'b','active'),(109,2,2,112,'b','active'),(110,2,3,112,'b','active'),(111,2,4,112,'b','active'),(112,2,5,112,'b','active'),(113,2,6,112,'b','active'),(114,2,7,112,'b','active'),(115,2,8,112,'b','active'),(116,2,9,112,'b','active'),(117,2,10,112,'b','active'),(118,3,1,112,'b','active'),(119,3,2,112,'b','active'),(120,3,3,112,'b','active'),(121,3,4,112,'b','active'),(122,3,5,112,'b','active'),(123,3,6,112,'b','active'),(124,3,7,112,'b','active'),(125,3,8,112,'b','active'),(126,3,9,112,'b','active'),(127,3,10,112,'b','active'),(128,4,1,112,'b','active'),(129,4,2,112,'b','active'),(130,4,3,112,'b','active'),(131,4,4,112,'b','active'),(132,4,5,112,'b','active'),(133,4,6,112,'b','active'),(134,4,7,112,'b','active'),(135,4,8,112,'b','active'),(136,4,9,112,'b','active'),(137,4,10,112,'b','active'),(138,1,6,113,'i','active'),(139,1,7,113,'i','active'),(140,1,8,113,'i','active'),(141,1,9,113,'i','active'),(142,1,10,113,'i','active'),(143,1,11,113,'i','active'),(144,2,1,113,'a','active'),(145,2,2,113,'a','active'),(146,2,3,113,'a','active'),(147,2,4,113,'a','active'),(148,2,5,113,'a','active'),(149,2,6,113,'a','active'),(150,2,7,113,'a','active'),(151,2,8,113,'a','active'),(152,2,9,113,'a','active'),(153,2,10,113,'a','active'),(154,2,11,113,'a','active'),(155,2,12,113,'a','active'),(156,2,13,113,'a','active'),(157,2,14,113,'a','active'),(158,2,15,113,'a','active'),(159,3,1,113,'a','active'),(160,3,2,113,'a','active'),(161,3,3,113,'a','active'),(162,3,4,113,'a','active'),(163,3,5,113,'a','active'),(164,3,6,113,'a','active'),(165,3,7,113,'a','active'),(166,3,8,113,'a','active'),(167,3,9,113,'a','active'),(168,3,10,113,'a','active'),(169,3,11,113,'a','active'),(170,3,12,113,'a','active'),(171,3,13,113,'a','active'),(172,3,14,113,'a','active'),(173,3,15,113,'a','active'),(174,4,1,113,'a','active'),(175,4,2,113,'a','active'),(176,4,3,113,'a','active'),(177,4,4,113,'a','active'),(178,4,5,113,'a','active'),(179,4,6,113,'a','booked'),(180,4,7,113,'a','active'),(181,4,8,113,'a','active'),(182,4,9,113,'a','active'),(183,4,10,113,'a','active'),(184,4,11,113,'a','active'),(185,4,12,113,'a','active'),(186,4,13,113,'a','active'),(187,4,14,113,'a','active'),(188,4,15,113,'a','active'),(189,5,1,113,'a','active'),(190,5,2,113,'a','active'),(191,5,3,113,'a','active'),(192,5,4,113,'a','active'),(193,5,5,113,'a','active'),(194,5,6,113,'a','active'),(195,5,7,113,'a','active'),(196,5,8,113,'a','active'),(197,5,9,113,'a','active'),(198,5,10,113,'a','active'),(199,5,11,113,'a','active'),(200,5,12,113,'a','active'),(201,5,13,113,'a','active'),(202,5,14,113,'a','active'),(203,5,15,113,'a','active'),(204,6,1,113,'a','active'),(205,6,2,113,'a','active'),(206,6,3,113,'a','active'),(207,6,4,113,'a','active'),(208,6,5,113,'a','active'),(209,6,6,113,'a','active'),(210,6,7,113,'a','active'),(211,6,8,113,'a','active'),(212,6,9,113,'a','active'),(213,6,10,113,'a','active'),(214,6,11,113,'a','active'),(215,6,12,113,'a','active'),(216,6,13,113,'a','active'),(217,6,14,113,'a','active'),(218,6,15,113,'a','active'),(219,1,1,114,'a','active'),(220,1,2,114,'a','active'),(221,1,3,114,'a','active'),(222,1,4,114,'a','active'),(223,1,5,114,'a','active'),(224,1,6,114,'a','active'),(225,1,7,114,'a','active'),(226,1,8,114,'a','active'),(227,1,9,114,'a','active'),(228,1,10,114,'a','active'),(229,1,11,114,'a','active'),(230,1,12,114,'a','active'),(231,1,13,114,'a','active'),(232,1,14,114,'a','active'),(233,1,15,114,'a','active'),(234,1,16,114,'a','active'),(235,1,17,114,'a','active'),(236,1,18,114,'a','active'),(237,1,19,114,'a','active'),(238,1,20,114,'a','active'),(239,1,21,114,'a','active'),(240,1,22,114,'a','active'),(241,1,23,114,'a','active'),(242,1,24,114,'a','active'),(243,2,1,114,'a','active'),(244,2,2,114,'a','active'),(245,2,3,114,'a','active'),(246,2,4,114,'a','active'),(247,2,5,114,'a','active'),(248,2,6,114,'a','active'),(249,2,7,114,'a','active'),(250,2,8,114,'a','active'),(251,2,9,114,'a','active'),(252,2,10,114,'a','active'),(253,2,11,114,'a','active'),(254,2,12,114,'a','active'),(255,2,13,114,'a','active'),(256,2,14,114,'a','active'),(257,2,15,114,'a','active'),(258,2,16,114,'a','active'),(259,2,17,114,'a','active'),(260,2,18,114,'a','active'),(261,2,19,114,'a','active'),(262,2,20,114,'a','active'),(263,2,21,114,'a','active'),(264,2,22,114,'a','active'),(265,2,23,114,'a','active'),(266,2,24,114,'a','active'),(267,1,1,115,'b','active'),(268,1,2,115,'b','active'),(269,1,3,115,'b','active'),(270,1,4,115,'b','active'),(271,1,5,115,'a','active'),(272,1,6,115,'a','active'),(273,1,7,115,'a','active'),(274,1,8,115,'a','active'),(275,1,9,115,'b','active'),(276,1,10,115,'b','active'),(277,1,11,115,'b','active'),(278,1,12,115,'b','active'),(279,2,1,115,'b','active'),(280,2,2,115,'b','active'),(281,2,3,115,'b','active'),(282,2,4,115,'b','active'),(283,2,5,115,'a','active'),(284,2,6,115,'a','active'),(285,2,7,115,'a','active'),(286,2,8,115,'a','active'),(287,2,9,115,'b','active'),(288,2,10,115,'b','active'),(289,2,11,115,'b','active'),(290,2,12,115,'b','active'),(291,3,1,115,'b','active'),(292,3,2,115,'b','active'),(293,3,3,115,'b','active'),(294,3,4,115,'b','active'),(295,3,5,115,'a','active'),(296,3,6,115,'a','active'),(297,3,7,115,'a','active'),(298,3,8,115,'a','active'),(299,3,9,115,'b','active'),(300,3,10,115,'b','active'),(301,3,11,115,'b','active'),(302,3,12,115,'b','active'),(303,4,1,115,'c','active'),(304,4,2,115,'c','active'),(305,4,3,115,'c','active'),(306,4,4,115,'c','active'),(307,4,5,115,'c','active'),(308,4,6,115,'c','active'),(309,4,7,115,'c','active'),(310,4,8,115,'c','active'),(311,4,9,115,'c','active'),(312,4,10,115,'c','active'),(313,4,11,115,'c','active'),(314,4,12,115,'c','active'),(315,4,13,115,'c','active'),(316,4,14,115,'c','active'),(317,5,1,115,'c','active'),(318,5,2,115,'c','active'),(319,5,3,115,'c','active'),(320,5,4,115,'c','active'),(321,5,5,115,'c','active'),(322,5,6,115,'c','active'),(323,5,7,115,'c','active'),(324,5,8,115,'c','active'),(325,5,9,115,'c','active'),(326,5,10,115,'c','active'),(327,5,11,115,'c','active'),(328,5,12,115,'c','active'),(329,5,13,115,'c','active'),(330,5,14,115,'c','active'),(331,6,1,115,'c','active'),(332,6,2,115,'c','active'),(333,6,3,115,'c','active'),(334,6,4,115,'c','active'),(335,6,5,115,'c','active'),(336,6,6,115,'c','active'),(337,6,7,115,'c','active'),(338,6,8,115,'c','active'),(339,6,9,115,'c','active'),(340,6,10,115,'c','active'),(341,6,11,115,'c','active'),(342,6,12,115,'c','active'),(343,6,13,115,'c','active'),(344,6,14,115,'c','active'),(345,1,1,116,'a','active'),(346,1,2,116,'a','active'),(347,1,3,116,'a','active'),(348,1,4,116,'a','active'),(349,1,5,116,'a','active'),(350,1,6,116,'a','active'),(351,1,7,116,'a','active'),(352,1,8,116,'a','active'),(353,1,9,116,'a','active'),(354,1,10,116,'a','active'),(355,2,1,116,'b','active'),(356,2,2,116,'b','active'),(357,2,3,116,'b','active'),(358,2,4,116,'b','active'),(359,2,7,116,'b','active'),(360,2,8,116,'b','active'),(361,2,9,116,'b','active'),(362,2,10,116,'b','active'),(363,3,1,116,'b','active'),(364,3,2,116,'b','active'),(365,3,3,116,'b','active'),(366,3,4,116,'b','active'),(367,3,7,116,'b','active'),(368,3,8,116,'b','active'),(369,3,9,116,'b','active'),(370,3,10,116,'b','active'),(371,1,1,118,'a','active'),(372,1,2,118,'a','active'),(373,1,3,118,'a','active'),(374,1,4,118,'a','active'),(375,1,5,118,'a','active'),(376,1,6,118,'a','active'),(377,1,7,118,'a','active'),(378,1,8,118,'a','active'),(379,1,9,118,'a','active'),(380,1,10,118,'a','active'),(381,2,1,118,'a','active'),(382,2,2,118,'a','active'),(383,2,3,118,'a','active'),(384,2,4,118,'a','active'),(385,2,5,118,'a','active'),(386,2,6,118,'a','active'),(387,2,7,118,'a','active'),(388,2,8,118,'a','active'),(389,2,9,118,'a','active'),(390,2,10,118,'a','active'),(391,4,1,118,'s','active'),(392,4,2,118,'s','active'),(393,4,3,118,'s','active'),(394,4,4,118,'s','active'),(395,4,5,118,'s','active'),(396,4,6,118,'s','active'),(397,4,7,118,'s','active'),(398,4,8,118,'s','active'),(399,4,9,118,'s','active'),(400,4,10,118,'s','active'),(401,5,1,118,'s','active'),(402,5,2,118,'s','active'),(403,5,3,118,'s','active'),(404,5,4,118,'s','active'),(405,5,5,118,'s','active'),(406,5,6,118,'s','active'),(407,5,7,118,'s','active'),(408,5,8,118,'s','active'),(409,5,9,118,'s','active'),(410,5,10,118,'s','active'),(411,6,1,118,'s','active'),(412,6,2,118,'s','active'),(413,6,3,118,'s','active'),(414,6,4,118,'s','active'),(415,6,5,118,'s','active'),(416,6,6,118,'s','active'),(417,6,7,118,'s','active'),(418,6,8,118,'s','active'),(419,6,9,118,'s','active'),(420,6,10,118,'s','active'),(421,1,1,119,'a','active'),(422,1,2,119,'a','active'),(423,1,3,119,'a','active'),(424,1,4,119,'a','active'),(425,1,5,119,'a','active'),(426,1,6,119,'a','active'),(427,1,8,119,'a','active'),(428,1,9,119,'a','active'),(429,1,10,119,'a','active'),(430,1,11,119,'a','active'),(431,1,12,119,'a','active'),(432,1,13,119,'a','active'),(433,2,1,119,'a','active'),(434,2,2,119,'a','active'),(435,2,3,119,'a','active'),(436,2,4,119,'a','active'),(437,2,5,119,'a','active'),(438,2,6,119,'a','active'),(439,2,8,119,'a','active'),(440,2,9,119,'a','active'),(441,2,10,119,'a','active'),(442,2,11,119,'a','active'),(443,2,12,119,'a','active'),(444,2,13,119,'a','active'),(445,4,1,119,'h','active'),(446,4,2,119,'h','active'),(447,4,3,119,'h','active'),(448,4,4,119,'h','active'),(449,4,5,119,'h','active'),(450,4,6,119,'h','active'),(451,4,8,119,'h','active'),(452,4,9,119,'h','active'),(453,4,10,119,'h','active'),(454,4,11,119,'h','active'),(455,4,12,119,'h','active'),(456,4,13,119,'h','active'),(457,5,1,119,'h','active'),(458,5,2,119,'h','active'),(459,5,3,119,'h','active'),(460,5,4,119,'h','active'),(461,5,5,119,'h','active'),(462,5,6,119,'h','active'),(463,5,8,119,'h','active'),(464,5,9,119,'h','active'),(465,5,10,119,'h','active'),(466,5,11,119,'h','active'),(467,5,12,119,'h','active'),(468,5,13,119,'h','active'),(469,6,1,119,'j','active'),(470,6,2,119,'j','active'),(471,6,3,119,'j','active'),(472,6,4,119,'j','active'),(473,6,5,119,'j','active'),(474,6,6,119,'j','active'),(475,6,8,119,'j','active'),(476,6,9,119,'j','active'),(477,6,10,119,'j','active'),(478,6,11,119,'j','active'),(479,6,12,119,'j','active'),(480,6,13,119,'j','active'),(481,6,14,119,'\r','active'),(482,1,1,123,'b','active'),(483,1,2,123,'b','active'),(484,1,3,123,'b','active'),(485,1,4,123,'b','active'),(486,1,5,123,'b','active'),(487,1,6,123,'b','active'),(488,1,7,123,'b','active'),(489,2,1,123,'b','active'),(490,2,2,123,'b','active'),(491,2,3,123,'b','active'),(492,2,4,123,'b','active'),(493,2,5,123,'b','active'),(494,2,6,123,'b','active'),(495,2,7,123,'b','active'),(496,3,1,123,'b','active'),(497,3,2,123,'b','active'),(498,3,3,123,'b','active'),(499,3,4,123,'b','active'),(500,3,5,123,'b','active'),(501,3,6,123,'b','active'),(502,3,7,123,'b','active'),(503,4,1,123,'s','active'),(504,4,2,123,'s','active'),(505,4,3,123,'s','active'),(506,4,4,123,'s','active'),(507,4,5,123,'s','active'),(508,4,6,123,'s','active'),(509,4,7,123,'s','active'),(510,4,8,123,'s','active'),(511,4,9,123,'s','active'),(512,4,10,123,'s','active'),(513,5,1,123,'s','active'),(514,5,2,123,'s','active'),(515,5,3,123,'s','active'),(516,5,4,123,'s','active'),(517,5,5,123,'s','active'),(518,5,6,123,'s','active'),(519,5,7,123,'s','active'),(520,5,8,123,'s','active'),(521,5,9,123,'s','active'),(522,5,10,123,'s','active'),(523,1,1,124,'s','active'),(524,1,2,124,'s','active'),(525,1,3,124,'s','active'),(526,1,4,124,'s','active'),(527,1,5,124,'s','active'),(528,1,6,124,'s','active'),(529,1,7,124,'s','active'),(530,1,8,124,'s','active'),(531,1,9,124,'s','active'),(532,2,1,124,'s','active'),(533,2,2,124,'s','active'),(534,2,3,124,'s','active'),(535,2,4,124,'s','active'),(536,2,5,124,'s','active'),(537,3,1,124,'e','active'),(538,3,2,124,'e','active'),(539,3,3,124,'e','active'),(540,3,4,124,'e','active'),(541,3,5,124,'e','active'),(542,3,6,124,'e','active'),(543,3,7,124,'e','active'),(544,3,8,124,'e','active'),(545,4,1,124,'e','active'),(546,4,2,124,'e','active'),(547,4,3,124,'e','active'),(548,4,4,124,'e','active'),(549,4,5,124,'e','active'),(550,4,6,124,'e','active'),(551,4,7,124,'e','active'),(552,4,8,124,'e','active');
/*!40000 ALTER TABLE `eventseats` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping events for database 'reservations'
--

--
-- Dumping routines for database 'reservations'
--
SET @@SESSION.SQL_LOG_BIN = @MYSQLDUMP_TEMP_LOG_BIN;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2020-06-03 16:11:35
