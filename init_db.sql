CREATE DATABASE  IF NOT EXISTS `pis` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `pis`;
-- MySQL dump 10.13  Distrib 8.0.46, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: pis
-- ------------------------------------------------------
-- Server version	8.0.46

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
-- Table structure for table `account`
--

DROP TABLE IF EXISTS `account`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `account` (
  `accountid` int NOT NULL AUTO_INCREMENT,
  `is_active` bit(1) NOT NULL,
  `is_first_login` bit(1) NOT NULL,
  `is_staff` bit(1) NOT NULL,
  `role_id` int NOT NULL,
  `employee_id` varchar(50) DEFAULT NULL,
  `username` varchar(150) NOT NULL,
  `password` varchar(255) NOT NULL,
  PRIMARY KEY (`accountid`),
  UNIQUE KEY `UKgex1lmaqpg0ir5g1f5eftyaa1` (`username`),
  UNIQUE KEY `UKdi2gpau46j4053lfccsrrq1sb` (`employee_id`),
  KEY `FKd4vb66o896tay3yy52oqxr9w0` (`role_id`),
  CONSTRAINT `FK1kec5bwba2rl0j8garlarwe3d` FOREIGN KEY (`employee_id`) REFERENCES `employee` (`employeeid`),
  CONSTRAINT `FKd4vb66o896tay3yy52oqxr9w0` FOREIGN KEY (`role_id`) REFERENCES `role` (`roleid`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `account`
--

LOCK TABLES `account` WRITE;
/*!40000 ALTER TABLE `account` DISABLE KEYS */;
INSERT INTO `account` VALUES (1,_binary '',_binary '\0',_binary '',1,'EMP001','admin','$2a$10$QiH.jAJ/GPN4dYWVSZbcze8CcFn2ktl8RtPEnHHNTbiZpyMXlh9K2'),(2,_binary '',_binary '\0',_binary '',2,'EMP002','sales','$2a$10$kOTJCcbR949BV0ksOaxsA.JZ6vG1LY1LsWxJtum7ZrMwRtpB5pV7q'),(3,_binary '',_binary '\0',_binary '',3,'EMP003','manager','$2a$10$UQfGpo3mkMyYL4Bk7GnX/.zAvOh8wClmZkHF4klXbNIedkv20jUeO'),(4,_binary '',_binary '\0',_binary '',2,'EMP004','user4','$2a$10$2Snm7jwjpX10KqyPp2qZBeG.drFOMpBk5oStgAxbJN3.RqK1Eo/J6'),(5,_binary '',_binary '\0',_binary '',3,'EMP005','user5','$2a$10$Nqr7u5OWCFP3eMRee7QOr.LuXrxGOwZRu/AqXhvxyc5kxYTUX7sQi');
/*!40000 ALTER TABLE `account` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `catalog`
--

DROP TABLE IF EXISTS `catalog`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `catalog` (
  `catalogid` varchar(50) NOT NULL,
  `catalog_name` varchar(100) NOT NULL,
  PRIMARY KEY (`catalogid`),
  UNIQUE KEY `UKdfrmbiaqrhrd70b5uybpeyins` (`catalog_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `catalog`
--

LOCK TABLES `catalog` WRITE;
/*!40000 ALTER TABLE `catalog` DISABLE KEYS */;
INSERT INTO `catalog` VALUES ('CAT021','Dầu gió & cao xoa'),('CAT026','Dịch truyền & bù điện giải'),('CAT024','Dược liệu & Thảo dược'),('CAT011','Dược mỹ phẩm chăm sóc da'),('CAT020','Sữa & Dinh dưỡng'),('CAT025','Thiết bị bảo hộ y tế'),('CAT015','Thiết bị y tế gia đình'),('CAT014','Thực phẩm chức năng'),('CAT017','Thuốc an thần & thần kinh'),('CAT022','Thuốc bổ gan & giải độc'),('CAT018','Thuốc bổ não & tuần hoàn'),('CAT012','Thuốc bôi ngoài da'),('CAT023','Thuốc đường hô hấp'),('CAT002','Thuốc giảm đau & hạ sốt'),('CAT010','Thuốc ho & cảm cúm'),('CAT009','Thuốc kháng Histamine dị ứng'),('CAT001','Thuốc kháng sinh'),('CAT003','Thuốc kháng viêm'),('CAT016','Thuốc nhỏ & xịt mũi'),('CAT004','Thuốc nhỏ mắt & tai'),('CAT006','Thuốc tiêu hóa & dạ dày'),('CAT007','Thuốc tim mạch & huyết áp'),('CAT013','Thuốc trị nấm'),('CAT008','Thuốc trị tiểu đường'),('CAT019','Thuốc xương khớp & gout'),('CAT005','Vitamin & Khoáng chất');
/*!40000 ALTER TABLE `catalog` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `customer`
--

DROP TABLE IF EXISTS `customer`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `customer` (
  `join_date` date NOT NULL,
  `phone_number` varchar(15) NOT NULL,
  `customerid` varchar(50) NOT NULL,
  `full_name` varchar(100) NOT NULL,
  `gender` enum('Female','Male') NOT NULL,
  PRIMARY KEY (`customerid`),
  UNIQUE KEY `UKrosd2guvs3i1agkplv5n8vu82` (`phone_number`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `customer`
--

LOCK TABLES `customer` WRITE;
/*!40000 ALTER TABLE `customer` DISABLE KEYS */;
INSERT INTO `customer` VALUES ('2026-06-06','0912345001','CUST001','Nguyễn Văn Anh','Male'),('2026-06-06','0912345002','CUST002','Trần Thị Bình','Female'),('2026-06-06','0912345003','CUST003','Lê Hoàng Chi','Male'),('2026-06-06','0912345004','CUST004','Phạm Minh Đức','Female'),('2026-06-06','0912345005','CUST005','Hoàng Thị Hương','Male'),('2026-06-06','0912345006','CUST006','Vũ Văn Gia','Female'),('2026-06-06','0912345007','CUST007','Ngô Thị Kim','Male'),('2026-06-06','0912345008','CUST008','Đỗ Minh Long','Female'),('2026-06-06','0912345009','CUST009','Bùi Thị Mai','Male'),('2026-06-06','0912345010','CUST010','Phan Văn Nam','Female'),('2026-06-06','0912345011','CUST011','Hồ Thị Oanh','Male'),('2026-06-06','0912345012','CUST012','Dương Minh Quân','Female'),('2026-06-06','0912345013','CUST013','Lý Thị Sơn','Male'),('2026-06-06','0912345014','CUST014','Đặng Văn Trường','Female'),('2026-06-06','0912345015','CUST015','Đinh Thị Uyên','Male'),('2026-06-06','0912345016','CUST016','Lâm Văn Việt','Female'),('2026-06-06','0912345017','CUST017','Mai Thị Xuân','Male'),('2026-06-06','0912345018','CUST018','Tạ Văn Yên','Female'),('2026-06-06','0912345019','CUST019','Phùng Thị An','Male'),('2026-06-06','0912345020','CUST020','Trịnh Văn Bảo','Female'),('2026-06-06','0912345021','CUST021','Bùi Hoàng Long','Male'),('2026-06-06','0912345022','CUST022','Trần Đức Lương','Female'),('2026-06-06','0912345023','CUST023','Phạm Hải Yến','Male'),('2026-06-06','0912345024','CUST024','Nguyễn Khắc Việt','Female'),('2026-06-06','0912345025','CUST025','Vũ Hoàng My','Male'),('2026-06-06','0912345026','CUST026','Đặng Thùy Trang','Female');
/*!40000 ALTER TABLE `customer` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `employee`
--

DROP TABLE IF EXISTS `employee`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `employee` (
  `hire_date` date NOT NULL,
  `is_active` bit(1) NOT NULL,
  `year_of_birth` int NOT NULL,
  `phone_number` varchar(15) NOT NULL,
  `employeeid` varchar(50) NOT NULL,
  `email` varchar(150) NOT NULL,
  `full_name` varchar(255) NOT NULL,
  `gender` enum('Female','Male') NOT NULL,
  PRIMARY KEY (`employeeid`),
  UNIQUE KEY `UKif2qx9bhvigig71puh5sow65g` (`phone_number`),
  UNIQUE KEY `UKfopic1oh5oln2khj8eat6ino0` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `employee`
--

LOCK TABLES `employee` WRITE;
/*!40000 ALTER TABLE `employee` DISABLE KEYS */;
INSERT INTO `employee` VALUES ('2026-01-02',_binary '',2005,'0123456789','EMP001','ngocuyenle15@gmail.com','Lê Ngọc Uyển','Male'),('2026-01-03',_binary '',1995,'0987654321','EMP002','sales@example.com','Trần Quang Khoan','Female'),('2026-01-04',_binary '',1988,'0911223344','EMP003','manager@example.com','Phan Thiện Vỹ','Male'),('2026-01-05',_binary '',1994,'0900000004','EMP004','employee4@example.com','Dương Quốc Khánh','Male'),('2026-01-06',_binary '',1995,'0900000005','EMP005','employee5@example.com','Dương Văn Hay','Female');
/*!40000 ALTER TABLE `employee` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `goods_issue`
--

DROP TABLE IF EXISTS `goods_issue`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `goods_issue` (
  `issue_time` datetime(6) NOT NULL,
  `employee_id` varchar(50) NOT NULL,
  `issue_id` varchar(50) NOT NULL,
  `note` text,
  `issue_type` enum('DAMAGED','EXPIRED','OTHER','RETURN_SUPPLIER','SALE') NOT NULL,
  `status` enum('CANCELLED','CONFIRMED','DRAFT') NOT NULL,
  PRIMARY KEY (`issue_id`),
  KEY `FKholdf6xj8q0mpc4scooewl7xn` (`employee_id`),
  CONSTRAINT `FKholdf6xj8q0mpc4scooewl7xn` FOREIGN KEY (`employee_id`) REFERENCES `employee` (`employeeid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `goods_issue`
--

LOCK TABLES `goods_issue` WRITE;
/*!40000 ALTER TABLE `goods_issue` DISABLE KEYS */;
INSERT INTO `goods_issue` VALUES ('2026-06-06 23:08:01.613155','EMP003','GI001','Xuất kho đợt thực tế 1','SALE','CONFIRMED'),('2026-06-06 23:08:01.643518','EMP004','GI002','Xuất kho đợt thực tế 2','SALE','CONFIRMED'),('2026-06-06 23:08:01.668439','EMP005','GI003','Xuất kho đợt thực tế 3','SALE','CONFIRMED'),('2026-06-06 23:08:01.696850','EMP001','GI004','Xuất kho đợt thực tế 4','EXPIRED','CONFIRMED'),('2026-06-06 23:08:01.729841','EMP002','GI005','Xuất kho đợt thực tế 5','SALE','DRAFT'),('2026-06-06 23:08:01.765279','EMP003','GI006','Xuất kho đợt thực tế 6','SALE','CONFIRMED'),('2026-06-06 23:08:01.792149','EMP004','GI007','Xuất kho đợt thực tế 7','SALE','CONFIRMED'),('2026-06-06 23:08:01.821793','EMP005','GI008','Xuất kho đợt thực tế 8','EXPIRED','CONFIRMED'),('2026-06-06 23:08:01.879637','EMP001','GI009','Xuất kho đợt thực tế 9','SALE','CONFIRMED'),('2026-06-06 23:08:01.919578','EMP002','GI010','Xuất kho đợt thực tế 10','SALE','DRAFT'),('2026-06-06 23:08:01.955861','EMP003','GI011','Xuất kho đợt thực tế 11','SALE','CONFIRMED'),('2026-06-06 23:08:02.053884','EMP004','GI012','Xuất kho đợt thực tế 12','EXPIRED','CONFIRMED'),('2026-06-06 23:08:02.101812','EMP005','GI013','Xuất kho đợt thực tế 13','SALE','CONFIRMED'),('2026-06-06 23:08:02.146653','EMP001','GI014','Xuất kho đợt thực tế 14','SALE','CONFIRMED'),('2026-06-06 23:08:02.170126','EMP002','GI015','Xuất kho đợt thực tế 15','SALE','DRAFT'),('2026-06-06 23:08:02.189144','EMP003','GI016','Xuất kho đợt thực tế 16','EXPIRED','CONFIRMED'),('2026-06-06 23:08:02.211452','EMP004','GI017','Xuất kho đợt thực tế 17','SALE','CONFIRMED'),('2026-06-06 23:08:02.230931','EMP005','GI018','Xuất kho đợt thực tế 18','SALE','CONFIRMED'),('2026-06-06 23:08:02.254872','EMP001','GI019','Xuất kho đợt thực tế 19','SALE','CONFIRMED'),('2026-06-06 23:08:02.276955','EMP002','GI020','Xuất kho đợt thực tế 20','EXPIRED','DRAFT'),('2026-06-06 23:08:02.298182','EMP003','GI021','Xuất kho đợt thực tế 21','SALE','CONFIRMED'),('2026-06-06 23:08:02.341660','EMP004','GI022','Xuất kho đợt thực tế 22','SALE','CONFIRMED'),('2026-06-06 23:08:02.367023','EMP005','GI023','Xuất kho đợt thực tế 23','SALE','CONFIRMED'),('2026-06-06 23:08:02.397959','EMP001','GI024','Xuất kho đợt thực tế 24','EXPIRED','CONFIRMED'),('2026-06-06 23:08:02.455993','EMP002','GI025','Xuất kho đợt thực tế 25','SALE','DRAFT');
/*!40000 ALTER TABLE `goods_issue` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `goods_issue_detail`
--

DROP TABLE IF EXISTS `goods_issue_detail`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `goods_issue_detail` (
  `conversion_rate` int DEFAULT NULL,
  `quantity` int NOT NULL,
  `id` bigint NOT NULL AUTO_INCREMENT,
  `inventory_id` varchar(50) NOT NULL,
  `issue_id` varchar(50) NOT NULL,
  `transaction_unit_id` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK97rw7w2futmbcee30ubsmhb2o` (`inventory_id`),
  KEY `FK5pwg4fj3m28clvmcglatjp5nb` (`issue_id`),
  KEY `FKccmlkx46c503h2mpxeqytj3fc` (`transaction_unit_id`),
  CONSTRAINT `FK5pwg4fj3m28clvmcglatjp5nb` FOREIGN KEY (`issue_id`) REFERENCES `goods_issue` (`issue_id`),
  CONSTRAINT `FK97rw7w2futmbcee30ubsmhb2o` FOREIGN KEY (`inventory_id`) REFERENCES `inventory` (`id`),
  CONSTRAINT `FKccmlkx46c503h2mpxeqytj3fc` FOREIGN KEY (`transaction_unit_id`) REFERENCES `unit` (`unitid`)
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `goods_issue_detail`
--

LOCK TABLES `goods_issue_detail` WRITE;
/*!40000 ALTER TABLE `goods_issue_detail` DISABLE KEYS */;
INSERT INTO `goods_issue_detail` VALUES (1,3,1,'INV002','GI001','UNIT001'),(1,4,2,'INV003','GI002','UNIT001'),(1,5,3,'INV004','GI003','UNIT001'),(1,6,4,'INV005','GI004','UNIT001'),(1,2,5,'INV006','GI005','UNIT001'),(1,3,6,'INV007','GI006','UNIT001'),(1,4,7,'INV008','GI007','UNIT001'),(1,5,8,'INV009','GI008','UNIT001'),(1,6,9,'INV010','GI009','UNIT001'),(1,2,10,'INV011','GI010','UNIT001'),(1,3,11,'INV012','GI011','UNIT001'),(1,4,12,'INV013','GI012','UNIT001'),(1,5,13,'INV014','GI013','UNIT001'),(1,6,14,'INV015','GI014','UNIT001'),(1,2,15,'INV016','GI015','UNIT001'),(1,3,16,'INV017','GI016','UNIT001'),(1,4,17,'INV018','GI017','UNIT001'),(1,5,18,'INV019','GI018','UNIT001'),(1,6,19,'INV020','GI019','UNIT001'),(1,2,20,'INV021','GI020','UNIT001'),(1,3,21,'INV022','GI021','UNIT006'),(1,4,22,'INV023','GI022','UNIT006'),(1,5,23,'INV024','GI023','UNIT001'),(1,6,24,'INV025','GI024','UNIT001'),(1,2,25,'INV026','GI025','UNIT001');
/*!40000 ALTER TABLE `goods_issue_detail` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `goods_receipt`
--

DROP TABLE IF EXISTS `goods_receipt`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `goods_receipt` (
  `receipt_time` datetime(6) NOT NULL,
  `employee_id` varchar(50) NOT NULL,
  `receipt_id` varchar(50) NOT NULL,
  `supplier_id` varchar(50) NOT NULL,
  `note` text,
  `status` enum('CANCELLED','CONFIRMED','DRAFT') NOT NULL,
  PRIMARY KEY (`receipt_id`),
  KEY `FKi8komap7l52mh2uqs51btdj44` (`employee_id`),
  KEY `FK10p3u2w2a6muu0npx3rq8l7xe` (`supplier_id`),
  CONSTRAINT `FK10p3u2w2a6muu0npx3rq8l7xe` FOREIGN KEY (`supplier_id`) REFERENCES `medicines_supplier` (`supplierid`),
  CONSTRAINT `FKi8komap7l52mh2uqs51btdj44` FOREIGN KEY (`employee_id`) REFERENCES `employee` (`employeeid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `goods_receipt`
--

LOCK TABLES `goods_receipt` WRITE;
/*!40000 ALTER TABLE `goods_receipt` DISABLE KEYS */;
INSERT INTO `goods_receipt` VALUES ('2026-06-06 23:08:00.675510','EMP002','GR001','SUP002','Nhập hàng đợt thực tế 1','CONFIRMED'),('2026-06-06 23:08:00.723133','EMP003','GR002','SUP003','Nhập hàng đợt thực tế 2','CONFIRMED'),('2026-06-06 23:08:00.751880','EMP004','GR003','SUP004','Nhập hàng đợt thực tế 3','CONFIRMED'),('2026-06-06 23:08:00.793357','EMP005','GR004','SUP005','Nhập hàng đợt thực tế 4','CONFIRMED'),('2026-06-06 23:08:00.894779','EMP001','GR005','SUP006','Nhập hàng đợt thực tế 5','DRAFT'),('2026-06-06 23:08:00.956272','EMP002','GR006','SUP007','Nhập hàng đợt thực tế 6','CONFIRMED'),('2026-06-06 23:08:00.983892','EMP003','GR007','SUP008','Nhập hàng đợt thực tế 7','CONFIRMED'),('2026-06-06 23:08:01.022842','EMP004','GR008','SUP009','Nhập hàng đợt thực tế 8','CONFIRMED'),('2026-06-06 23:08:01.050068','EMP005','GR009','SUP010','Nhập hàng đợt thực tế 9','CONFIRMED'),('2026-06-06 23:08:01.080285','EMP001','GR010','SUP011','Nhập hàng đợt thực tế 10','DRAFT'),('2026-06-06 23:08:01.114412','EMP002','GR011','SUP012','Nhập hàng đợt thực tế 11','CONFIRMED'),('2026-06-06 23:08:01.139511','EMP003','GR012','SUP013','Nhập hàng đợt thực tế 12','CONFIRMED'),('2026-06-06 23:08:01.163742','EMP004','GR013','SUP014','Nhập hàng đợt thực tế 13','CONFIRMED'),('2026-06-06 23:08:01.189523','EMP005','GR014','SUP015','Nhập hàng đợt thực tế 14','CONFIRMED'),('2026-06-06 23:08:01.236296','EMP001','GR015','SUP016','Nhập hàng đợt thực tế 15','DRAFT'),('2026-06-06 23:08:01.261234','EMP002','GR016','SUP017','Nhập hàng đợt thực tế 16','CONFIRMED'),('2026-06-06 23:08:01.291882','EMP003','GR017','SUP018','Nhập hàng đợt thực tế 17','CONFIRMED'),('2026-06-06 23:08:01.325422','EMP004','GR018','SUP019','Nhập hàng đợt thực tế 18','CONFIRMED'),('2026-06-06 23:08:01.353329','EMP005','GR019','SUP020','Nhập hàng đợt thực tế 19','CONFIRMED'),('2026-06-06 23:08:01.376483','EMP001','GR020','SUP021','Nhập hàng đợt thực tế 20','DRAFT'),('2026-06-06 23:08:01.404931','EMP002','GR021','SUP022','Nhập hàng đợt thực tế 21','CONFIRMED'),('2026-06-06 23:08:01.477418','EMP003','GR022','SUP023','Nhập hàng đợt thực tế 22','CONFIRMED'),('2026-06-06 23:08:01.514538','EMP004','GR023','SUP024','Nhập hàng đợt thực tế 23','CONFIRMED'),('2026-06-06 23:08:01.544255','EMP005','GR024','SUP025','Nhập hàng đợt thực tế 24','CONFIRMED'),('2026-06-06 23:08:01.575366','EMP001','GR025','SUP026','Nhập hàng đợt thực tế 25','DRAFT');
/*!40000 ALTER TABLE `goods_receipt` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `goods_receipt_detail`
--

DROP TABLE IF EXISTS `goods_receipt_detail`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `goods_receipt_detail` (
  `conversion_rate` int DEFAULT NULL,
  `expiry_date` date DEFAULT NULL,
  `import_price` decimal(10,2) NOT NULL,
  `manufactured_date` date DEFAULT NULL,
  `quantity` int NOT NULL,
  `id` bigint NOT NULL AUTO_INCREMENT,
  `batch_id` varchar(50) DEFAULT NULL,
  `medicine_id` varchar(50) NOT NULL,
  `receipt_id` varchar(50) NOT NULL,
  `transaction_unit_id` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK78sku2k8a6tdf5bm26b394o8y` (`medicine_id`),
  KEY `FKfxqd10xhku8bsfw65ak56x06w` (`receipt_id`),
  KEY `FKj84ftpc0kktlkgbe2pxl1n8xx` (`transaction_unit_id`),
  CONSTRAINT `FK78sku2k8a6tdf5bm26b394o8y` FOREIGN KEY (`medicine_id`) REFERENCES `medicine` (`medicineid`),
  CONSTRAINT `FKfxqd10xhku8bsfw65ak56x06w` FOREIGN KEY (`receipt_id`) REFERENCES `goods_receipt` (`receipt_id`),
  CONSTRAINT `FKj84ftpc0kktlkgbe2pxl1n8xx` FOREIGN KEY (`transaction_unit_id`) REFERENCES `unit` (`unitid`)
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `goods_receipt_detail`
--

LOCK TABLES `goods_receipt_detail` WRITE;
/*!40000 ALTER TABLE `goods_receipt_detail` DISABLE KEYS */;
INSERT INTO `goods_receipt_detail` VALUES (1,'2028-06-06',800.00,'2025-12-06',60,1,'BATCH001','MED002','GR001','UNIT001'),(1,'2027-06-06',1200.00,'2025-12-06',70,2,'BATCH002','MED003','GR002','UNIT001'),(1,'2028-06-06',1600.00,'2025-12-06',80,3,'BATCH003','MED004','GR003','UNIT001'),(1,'2027-06-06',2000.00,'2025-12-06',90,4,'BATCH004','MED005','GR004','UNIT001'),(1,'2028-06-06',2400.00,'2025-12-06',100,5,'BATCH005','MED006','GR005','UNIT001'),(1,'2027-06-06',2800.00,'2025-12-06',110,6,'BATCH006','MED007','GR006','UNIT001'),(1,'2028-06-06',3200.00,'2025-12-06',120,7,'BATCH007','MED008','GR007','UNIT001'),(1,'2027-06-06',3600.00,'2025-12-06',130,8,'BATCH008','MED009','GR008','UNIT001'),(1,'2028-06-06',4000.00,'2025-12-06',140,9,'BATCH009','MED010','GR009','UNIT001'),(1,'2027-06-06',400.00,'2025-12-06',150,10,'BATCH010','MED011','GR010','UNIT001'),(1,'2028-06-06',9600.00,'2025-12-06',160,11,'BATCH011','MED012','GR011','UNIT001'),(1,'2027-06-06',1200.00,'2025-12-06',170,12,'BATCH012','MED013','GR012','UNIT001'),(1,'2028-06-06',1600.00,'2025-12-06',180,13,'BATCH013','MED014','GR013','UNIT001'),(1,'2027-06-06',2000.00,'2025-12-06',190,14,'BATCH014','MED015','GR014','UNIT001'),(1,'2028-06-06',2400.00,'2025-12-06',200,15,'BATCH015','MED016','GR015','UNIT001'),(1,'2027-06-06',2800.00,'2025-12-06',210,16,'BATCH016','MED017','GR016','UNIT001'),(1,'2028-06-06',3200.00,'2025-12-06',220,17,'BATCH017','MED018','GR017','UNIT001'),(1,'2027-06-06',12800.00,'2025-12-06',230,18,'BATCH018','MED019','GR018','UNIT001'),(1,'2028-06-06',4000.00,'2025-12-06',240,19,'BATCH019','MED020','GR019','UNIT001'),(1,'2027-06-06',400.00,'2025-12-06',250,20,'BATCH020','MED021','GR020','UNIT001'),(1,'2028-06-06',2400.00,'2025-12-06',260,21,'BATCH021','MED022','GR021','UNIT006'),(1,'2027-06-06',3200.00,'2025-12-06',270,22,'BATCH022','MED023','GR022','UNIT006'),(1,'2028-06-06',1600.00,'2025-12-06',280,23,'BATCH023','MED024','GR023','UNIT001'),(1,'2027-06-06',2000.00,'2025-12-06',290,24,'BATCH024','MED025','GR024','UNIT001'),(1,'2028-06-06',2400.00,'2025-12-06',300,25,'BATCH025','MED026','GR025','UNIT001');
/*!40000 ALTER TABLE `goods_receipt_detail` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `inventory`
--

DROP TABLE IF EXISTS `inventory`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `inventory` (
  `expiry_date` date DEFAULT NULL,
  `import_price` decimal(10,2) NOT NULL,
  `manufactured_date` date DEFAULT NULL,
  `stock_quantity` int NOT NULL,
  `id` varchar(50) NOT NULL,
  `medicine_id` varchar(50) NOT NULL,
  `batch_id` varchar(255) DEFAULT NULL,
  `status` enum('ACTIVE','ADJUSTED','DISPOSED','SOLD_OUT') DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_inventory_medicine_id` (`medicine_id`),
  KEY `idx_inventory_batch_id` (`batch_id`),
  CONSTRAINT `FK713k1svoloqbw0cua9dcnr77m` FOREIGN KEY (`medicine_id`) REFERENCES `medicine` (`medicineid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `inventory`
--

LOCK TABLES `inventory` WRITE;
/*!40000 ALTER TABLE `inventory` DISABLE KEYS */;
INSERT INTO `inventory` VALUES ('2027-06-06',400.00,'2025-12-06',150,'INV001','MED001','BATCH001','ACTIVE'),('2028-06-06',800.00,'2025-12-06',105,'INV002','MED002','BATCH002','ACTIVE'),('2026-05-06',1200.00,'2025-05-06',110,'INV003','MED003','BATCH003','ACTIVE'),('2028-06-06',1600.00,'2025-12-06',115,'INV004','MED004','BATCH004','ACTIVE'),('2027-06-06',2000.00,'2025-12-06',0,'INV005','MED005','BATCH005','SOLD_OUT'),('2026-06-21',2400.00,'2025-06-21',125,'INV006','MED006','BATCH006','ACTIVE'),('2027-06-06',2800.00,'2025-12-06',130,'INV007','MED007','BATCH007','ACTIVE'),('2028-06-06',3200.00,'2025-12-06',135,'INV008','MED008','BATCH008','ACTIVE'),('2027-06-06',3600.00,'2025-12-06',140,'INV009','MED009','BATCH009','DISPOSED'),('2028-06-06',4000.00,'2025-12-06',145,'INV010','MED010','BATCH010','ACTIVE'),('2027-06-06',400.00,'2025-12-06',150,'INV011','MED011','BATCH011','ACTIVE'),('2028-06-06',9600.00,'2025-12-06',155,'INV012','MED012','BATCH012','ACTIVE'),('2026-05-06',1200.00,'2025-05-06',160,'INV013','MED013','BATCH013','ACTIVE'),('2028-06-06',1600.00,'2025-12-06',165,'INV014','MED014','BATCH014','ACTIVE'),('2027-06-06',2000.00,'2025-12-06',0,'INV015','MED015','BATCH015','SOLD_OUT'),('2026-06-21',2400.00,'2025-06-21',175,'INV016','MED016','BATCH016','ACTIVE'),('2027-06-06',2800.00,'2025-12-06',180,'INV017','MED017','BATCH017','ACTIVE'),('2028-06-06',3200.00,'2025-12-06',185,'INV018','MED018','BATCH018','ACTIVE'),('2027-06-06',12800.00,'2025-12-06',190,'INV019','MED019','BATCH019','DISPOSED'),('2028-06-06',4000.00,'2025-12-06',195,'INV020','MED020','BATCH020','ACTIVE'),('2027-06-06',400.00,'2025-12-06',200,'INV021','MED021','BATCH021','ACTIVE'),('2028-06-06',2400.00,'2025-12-06',205,'INV022','MED022','BATCH022','ACTIVE'),('2026-05-06',3200.00,'2025-05-06',210,'INV023','MED023','BATCH023','ACTIVE'),('2028-06-06',1600.00,'2025-12-06',215,'INV024','MED024','BATCH024','ACTIVE'),('2027-06-06',2000.00,'2025-12-06',0,'INV025','MED025','BATCH025','SOLD_OUT'),('2026-06-21',2400.00,'2025-06-21',225,'INV026','MED026','BATCH026','ACTIVE'),('2027-06-06',5200.00,'2025-12-06',230,'INV027','MED027','BATCH027','ACTIVE'),('2028-06-06',96000.00,'2025-12-06',235,'INV028','MED028','BATCH028','ACTIVE'),('2027-06-06',12800.00,'2025-12-06',240,'INV029','MED029','BATCH029','DISPOSED'),('2028-06-06',4000.00,'2025-12-06',245,'INV030','MED030','BATCH030','ACTIVE'),('2027-06-06',400.00,'2025-12-06',250,'INV031','MED031','BATCH031','ACTIVE'),('2028-06-06',800.00,'2025-12-06',255,'INV032','MED032','BATCH032','ACTIVE'),('2026-05-06',1200.00,'2025-05-06',260,'INV033','MED033','BATCH033','ACTIVE'),('2028-06-06',1600.00,'2025-12-06',265,'INV034','MED034','BATCH034','ACTIVE'),('2027-06-06',2000.00,'2025-12-06',0,'INV035','MED035','BATCH035','SOLD_OUT'),('2026-06-21',2400.00,'2025-06-21',275,'INV036','MED036','BATCH036','ACTIVE'),('2027-06-06',2800.00,'2025-12-06',280,'INV037','MED037','BATCH037','ACTIVE'),('2028-06-06',3200.00,'2025-12-06',285,'INV038','MED038','BATCH038','ACTIVE'),('2027-06-06',12800.00,'2025-12-06',290,'INV039','MED039','BATCH039','DISPOSED'),('2028-06-06',4000.00,'2025-12-06',295,'INV040','MED040','BATCH040','ACTIVE'),('2027-06-06',400.00,'2025-12-06',300,'INV041','MED041','BATCH041','ACTIVE'),('2028-06-06',800.00,'2025-12-06',305,'INV042','MED042','BATCH042','ACTIVE'),('2026-05-06',1200.00,'2025-05-06',310,'INV043','MED043','BATCH043','ACTIVE'),('2028-06-06',4000.00,'2025-12-06',315,'INV044','MED044','BATCH044','ACTIVE'),('2027-06-06',4800.00,'2025-12-06',0,'INV045','MED045','BATCH045','SOLD_OUT'),('2026-06-21',2400.00,'2025-06-21',325,'INV046','MED046','BATCH046','ACTIVE'),('2027-06-06',2800.00,'2025-12-06',330,'INV047','MED047','BATCH047','ACTIVE'),('2028-06-06',3200.00,'2025-12-06',335,'INV048','MED048','BATCH048','ACTIVE'),('2027-06-06',3600.00,'2025-12-06',340,'INV049','MED049','BATCH049','DISPOSED'),('2028-06-06',4800.00,'2025-12-06',345,'INV050','MED050','BATCH050','ACTIVE'),('2027-06-06',1600.00,'2025-12-06',350,'INV051','MED051','BATCH051','ACTIVE'),('2028-06-06',2400.00,'2025-12-06',355,'INV052','MED052','BATCH052','ACTIVE'),('2026-05-06',1200.00,'2025-05-06',360,'INV053','MED053','BATCH053','ACTIVE'),('2028-06-06',1600.00,'2025-12-06',365,'INV054','MED054','BATCH054','ACTIVE'),('2027-06-06',2000.00,'2025-12-06',0,'INV055','MED055','BATCH055','SOLD_OUT'),('2026-06-21',2400.00,'2025-06-21',375,'INV056','MED056','BATCH056','ACTIVE'),('2027-06-06',2800.00,'2025-12-06',380,'INV057','MED057','BATCH057','ACTIVE'),('2028-06-06',3200.00,'2025-12-06',385,'INV058','MED058','BATCH058','ACTIVE'),('2027-06-06',3600.00,'2025-12-06',390,'INV059','MED059','BATCH059','DISPOSED'),('2028-06-06',4000.00,'2025-12-06',395,'INV060','MED060','BATCH060','ACTIVE'),('2027-06-06',400.00,'2025-12-06',400,'INV061','MED061','BATCH061','ACTIVE'),('2028-06-06',800.00,'2025-12-06',405,'INV062','MED062','BATCH062','ACTIVE'),('2026-05-06',1200.00,'2025-05-06',410,'INV063','MED063','BATCH063','ACTIVE'),('2028-06-06',1600.00,'2025-12-06',415,'INV064','MED064','BATCH064','ACTIVE'),('2027-06-06',14400.00,'2025-12-06',0,'INV065','MED065','BATCH065','SOLD_OUT'),('2026-06-21',8000.00,'2025-06-21',425,'INV066','MED066','BATCH066','ACTIVE'),('2027-06-06',2800.00,'2025-12-06',430,'INV067','MED067','BATCH067','ACTIVE'),('2028-06-06',3200.00,'2025-12-06',435,'INV068','MED068','BATCH068','ACTIVE'),('2027-06-06',3600.00,'2025-12-06',440,'INV069','MED069','BATCH069','DISPOSED'),('2028-06-06',4000.00,'2025-12-06',445,'INV070','MED070','BATCH070','ACTIVE'),('2027-06-06',400.00,'2025-12-06',450,'INV071','MED071','BATCH071','ACTIVE'),('2028-06-06',800.00,'2025-12-06',455,'INV072','MED072','BATCH072','ACTIVE'),('2026-05-06',1200.00,'2025-05-06',460,'INV073','MED073','BATCH073','ACTIVE'),('2028-06-06',1600.00,'2025-12-06',465,'INV074','MED074','BATCH074','ACTIVE'),('2027-06-06',4000.00,'2025-12-06',0,'INV075','MED075','BATCH075','SOLD_OUT');
/*!40000 ALTER TABLE `inventory` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `inventory_transaction`
--

DROP TABLE IF EXISTS `inventory_transaction`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `inventory_transaction` (
  `ending_balance` int NOT NULL,
  `quantity_changed` int NOT NULL,
  `id` bigint NOT NULL AUTO_INCREMENT,
  `transaction_time` datetime(6) NOT NULL,
  `inventory_id` varchar(50) NOT NULL,
  `reference_id` varchar(50) NOT NULL,
  `type` enum('AUDIT_ADJUST','EXPORT','IMPORT','SALE') NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_inv_trans_inv_id_time` (`inventory_id`,`transaction_time`),
  CONSTRAINT `FKedhmc42hqls8qijw68xl48aa5` FOREIGN KEY (`inventory_id`) REFERENCES `inventory` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=31 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `inventory_transaction`
--

LOCK TABLES `inventory_transaction` WRITE;
/*!40000 ALTER TABLE `inventory_transaction` DISABLE KEYS */;
INSERT INTO `inventory_transaction` VALUES (95,-5,1,'2026-05-09 07:08:03.904628','INV002','INV_SALE_1','SALE'),(90,-10,2,'2026-05-10 07:08:03.912512','INV003','GI003','EXPORT'),(98,-2,3,'2026-05-11 07:08:03.920927','INV004','SA004','AUDIT_ADJUST'),(200,100,4,'2026-05-12 07:08:03.928362','INV005','GR005','IMPORT'),(95,-5,5,'2026-05-13 07:08:03.940615','INV006','INV_SALE_5','SALE'),(90,-10,6,'2026-05-14 07:08:03.948237','INV007','GI007','EXPORT'),(98,-2,7,'2026-05-15 07:08:03.955819','INV008','SA008','AUDIT_ADJUST'),(200,100,8,'2026-05-16 07:08:03.965249','INV009','GR009','IMPORT'),(95,-5,9,'2026-05-17 07:08:03.974028','INV010','INV_SALE_9','SALE'),(90,-10,10,'2026-05-18 07:08:03.981687','INV011','GI011','EXPORT'),(98,-2,11,'2026-05-19 07:08:03.988838','INV012','SA012','AUDIT_ADJUST'),(200,100,12,'2026-05-20 07:08:04.004659','INV013','GR013','IMPORT'),(95,-5,13,'2026-05-21 07:08:04.023918','INV014','INV_SALE_13','SALE'),(90,-10,14,'2026-05-22 07:08:04.049251','INV015','GI015','EXPORT'),(98,-2,15,'2026-05-23 07:08:04.058679','INV016','SA016','AUDIT_ADJUST'),(200,100,16,'2026-05-24 07:08:04.065920','INV017','GR017','IMPORT'),(95,-5,17,'2026-05-25 07:08:04.074911','INV018','INV_SALE_17','SALE'),(90,-10,18,'2026-05-26 07:08:04.081818','INV019','GI019','EXPORT'),(98,-2,19,'2026-05-27 07:08:04.089522','INV020','SA020','AUDIT_ADJUST'),(200,100,20,'2026-05-28 07:08:04.096980','INV021','GR021','IMPORT'),(95,-5,21,'2026-05-29 07:08:04.104625','INV022','INV_SALE_21','SALE'),(90,-10,22,'2026-05-30 07:08:04.112867','INV023','GI023','EXPORT'),(98,-2,23,'2026-05-31 07:08:04.121254','INV024','SA024','AUDIT_ADJUST'),(200,100,24,'2026-06-01 07:08:04.144375','INV025','GR025','IMPORT'),(95,-5,25,'2026-06-02 07:08:04.152079','INV026','INV_SALE_25','SALE'),(90,-10,26,'2026-06-03 07:08:04.159434','INV027','GI002','EXPORT'),(98,-2,27,'2026-06-04 07:08:04.166807','INV028','SA003','AUDIT_ADJUST'),(200,100,28,'2026-06-05 07:08:04.173450','INV029','GR004','IMPORT'),(95,-5,29,'2026-06-06 07:08:04.179503','INV030','INV_SALE_29','SALE'),(90,-10,30,'2026-06-07 07:08:04.182535','INV031','GI006','EXPORT');
/*!40000 ALTER TABLE `inventory_transaction` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `invoice`
--

DROP TABLE IF EXISTS `invoice`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `invoice` (
  `invoiceid` int NOT NULL AUTO_INCREMENT,
  `invoice_time` datetime(6) NOT NULL,
  `customer_id` varchar(50) DEFAULT NULL,
  `address` text NOT NULL,
  `payment_method` enum('Card','Cash') NOT NULL,
  `status` enum('Paid','Pending') NOT NULL,
  PRIMARY KEY (`invoiceid`),
  KEY `FK5e32ukwo9uknwhylogvta4po6` (`customer_id`),
  CONSTRAINT `FK5e32ukwo9uknwhylogvta4po6` FOREIGN KEY (`customer_id`) REFERENCES `customer` (`customerid`)
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `invoice`
--

LOCK TABLES `invoice` WRITE;
/*!40000 ALTER TABLE `invoice` DISABLE KEYS */;
INSERT INTO `invoice` VALUES (1,'2026-06-06 23:08:02.495409','CUST002','1 Đường Trần Hưng Đạo, Quận 1, TP. HCM','Card','Paid'),(2,'2026-06-06 23:08:02.518300','CUST003','2 Đường Trần Hưng Đạo, Quận 1, TP. HCM','Cash','Paid'),(3,'2026-06-06 23:08:02.580376','CUST004','3 Đường Trần Hưng Đạo, Quận 1, TP. HCM','Card','Paid'),(4,'2026-06-06 23:08:02.612555','CUST005','4 Đường Trần Hưng Đạo, Quận 1, TP. HCM','Cash','Paid'),(5,'2026-06-06 23:08:02.626927','CUST006','5 Đường Trần Hưng Đạo, Quận 1, TP. HCM','Card','Paid'),(6,'2026-06-06 23:08:02.640237','CUST007','6 Đường Trần Hưng Đạo, Quận 1, TP. HCM','Cash','Pending'),(7,'2026-06-06 23:08:02.666871','CUST008','7 Đường Trần Hưng Đạo, Quận 1, TP. HCM','Card','Paid'),(8,'2026-06-06 23:08:02.678446','CUST009','8 Đường Trần Hưng Đạo, Quận 1, TP. HCM','Cash','Paid'),(9,'2026-06-06 23:08:02.691222','CUST010','9 Đường Trần Hưng Đạo, Quận 1, TP. HCM','Card','Paid'),(10,'2026-06-06 23:08:02.701640','CUST011','10 Đường Trần Hưng Đạo, Quận 1, TP. HCM','Cash','Paid'),(11,'2026-06-06 23:08:02.713714','CUST012','11 Đường Trần Hưng Đạo, Quận 1, TP. HCM','Card','Paid'),(12,'2026-06-06 23:08:02.731188','CUST013','12 Đường Trần Hưng Đạo, Quận 1, TP. HCM','Cash','Pending'),(13,'2026-06-06 23:08:02.755362','CUST014','13 Đường Trần Hưng Đạo, Quận 1, TP. HCM','Card','Paid'),(14,'2026-06-06 23:08:02.784945','CUST015','14 Đường Trần Hưng Đạo, Quận 1, TP. HCM','Cash','Paid'),(15,'2026-06-06 23:08:02.802032','CUST016','15 Đường Trần Hưng Đạo, Quận 1, TP. HCM','Card','Paid'),(16,'2026-06-06 23:08:02.817435','CUST017','16 Đường Trần Hưng Đạo, Quận 1, TP. HCM','Cash','Paid'),(17,'2026-06-06 23:08:02.828414','CUST018','17 Đường Trần Hưng Đạo, Quận 1, TP. HCM','Card','Paid'),(18,'2026-06-06 23:08:02.838826','CUST019','18 Đường Trần Hưng Đạo, Quận 1, TP. HCM','Cash','Pending'),(19,'2026-06-06 23:08:02.852459','CUST020','19 Đường Trần Hưng Đạo, Quận 1, TP. HCM','Card','Paid'),(20,'2026-06-06 23:08:02.863690','CUST021','20 Đường Trần Hưng Đạo, Quận 1, TP. HCM','Cash','Paid'),(21,'2026-06-06 23:08:02.874055','CUST022','21 Đường Trần Hưng Đạo, Quận 1, TP. HCM','Card','Paid'),(22,'2026-06-06 23:08:02.884602','CUST023','22 Đường Trần Hưng Đạo, Quận 1, TP. HCM','Cash','Paid'),(23,'2026-06-06 23:08:02.894242','CUST024','23 Đường Trần Hưng Đạo, Quận 1, TP. HCM','Card','Paid'),(24,'2026-06-06 23:08:02.903435','CUST025','24 Đường Trần Hưng Đạo, Quận 1, TP. HCM','Cash','Pending'),(25,'2026-06-06 23:08:02.913758','CUST026','25 Đường Trần Hưng Đạo, Quận 1, TP. HCM','Card','Paid');
/*!40000 ALTER TABLE `invoice` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `invoice_detail`
--

DROP TABLE IF EXISTS `invoice_detail`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `invoice_detail` (
  `invoice_id` int NOT NULL,
  `quantity` int NOT NULL,
  `unit_price` decimal(10,2) NOT NULL,
  `id` bigint NOT NULL AUTO_INCREMENT,
  `inventory_id` varchar(50) NOT NULL,
  `note` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FKfrl89yikwhmjeog1re93govni` (`inventory_id`),
  KEY `FKit1rbx4thcr6gx6bm3gxub3y4` (`invoice_id`),
  CONSTRAINT `FKfrl89yikwhmjeog1re93govni` FOREIGN KEY (`inventory_id`) REFERENCES `inventory` (`id`),
  CONSTRAINT `FKit1rbx4thcr6gx6bm3gxub3y4` FOREIGN KEY (`invoice_id`) REFERENCES `invoice` (`invoiceid`)
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `invoice_detail`
--

LOCK TABLES `invoice_detail` WRITE;
/*!40000 ALTER TABLE `invoice_detail` DISABLE KEYS */;
INSERT INTO `invoice_detail` VALUES (1,2,1000.00,1,'INV002','Khách mua đợt 1'),(2,3,1500.00,2,'INV003','Khách mua đợt 2'),(3,4,2000.00,3,'INV004','Khách mua đợt 3'),(4,5,2500.00,4,'INV005','Khách mua đợt 4'),(5,6,3000.00,5,'INV006','Khách mua đợt 5'),(6,7,3500.00,6,'INV007','Khách mua đợt 6'),(7,8,4000.00,7,'INV008','Khách mua đợt 7'),(8,9,4500.00,8,'INV009','Khách mua đợt 8'),(9,10,5000.00,9,'INV010','Khách mua đợt 9'),(10,1,500.00,10,'INV011','Khách mua đợt 10'),(11,2,12000.00,11,'INV012','Khách mua đợt 11'),(12,3,1500.00,12,'INV013','Khách mua đợt 12'),(13,4,2000.00,13,'INV014','Khách mua đợt 13'),(14,5,2500.00,14,'INV015','Khách mua đợt 14'),(15,6,3000.00,15,'INV016','Khách mua đợt 15'),(16,7,3500.00,16,'INV017','Khách mua đợt 16'),(17,8,4000.00,17,'INV018','Khách mua đợt 17'),(18,9,16000.00,18,'INV019','Khách mua đợt 18'),(19,10,5000.00,19,'INV020','Khách mua đợt 19'),(20,1,500.00,20,'INV021','Khách mua đợt 20'),(21,2,3000.00,21,'INV022','Khách mua đợt 21'),(22,3,4000.00,22,'INV023','Khách mua đợt 22'),(23,4,2000.00,23,'INV024','Khách mua đợt 23'),(24,5,2500.00,24,'INV025','Khách mua đợt 24'),(25,6,3000.00,25,'INV026','Khách mua đợt 25');
/*!40000 ALTER TABLE `invoice_detail` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `jwt_invalidated_token`
--

DROP TABLE IF EXISTS `jwt_invalidated_token`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `jwt_invalidated_token` (
  `expiry_time` datetime(6) NOT NULL,
  `token_id` varchar(500) NOT NULL,
  PRIMARY KEY (`token_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `jwt_invalidated_token`
--

LOCK TABLES `jwt_invalidated_token` WRITE;
/*!40000 ALTER TABLE `jwt_invalidated_token` DISABLE KEYS */;
/*!40000 ALTER TABLE `jwt_invalidated_token` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `medicine`
--

DROP TABLE IF EXISTS `medicine`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `medicine` (
  `unit_price` decimal(10,2) NOT NULL,
  `catalog_id` varchar(50) NOT NULL,
  `medicineid` varchar(50) NOT NULL,
  `origin_id` varchar(50) NOT NULL,
  `unit_id` varchar(50) NOT NULL,
  `image` varchar(500) DEFAULT NULL,
  `ingredients` text NOT NULL,
  `medicine_name` varchar(255) NOT NULL,
  PRIMARY KEY (`medicineid`),
  KEY `idx_medicine_name` (`medicine_name`),
  KEY `idx_medicine_catalog_id` (`catalog_id`),
  KEY `idx_medicine_origin_id` (`origin_id`),
  KEY `FKbwdi89abgfx5fks1p4gh7uxsh` (`unit_id`),
  CONSTRAINT `FKbwdi89abgfx5fks1p4gh7uxsh` FOREIGN KEY (`unit_id`) REFERENCES `unit` (`unitid`),
  CONSTRAINT `FKikiebwg12nw5830gwxjv3skxm` FOREIGN KEY (`catalog_id`) REFERENCES `catalog` (`catalogid`),
  CONSTRAINT `FKkeo7ddw5f6w2s1wh525wghuwj` FOREIGN KEY (`origin_id`) REFERENCES `origin` (`originid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `medicine`
--

LOCK TABLES `medicine` WRITE;
/*!40000 ALTER TABLE `medicine` DISABLE KEYS */;
INSERT INTO `medicine` VALUES (500.00,'CAT001','MED001','ORG001','UNIT001','https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=300&q=80','Paracetamol 500mg và tá dược vừa đủ','Paracetamol 500mg'),(1000.00,'CAT002','MED002','ORG002','UNIT001','https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=300&q=80','Ibuprofen 400mg và tá dược vừa đủ','Ibuprofen 400mg'),(1500.00,'CAT003','MED003','ORG003','UNIT001','https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=300&q=80','Meloxicam 7.5mg và tá dược vừa đủ','Meloxicam 7.5mg'),(2000.00,'CAT004','MED004','ORG004','UNIT001','https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=300&q=80','Diclofenac 50mg và tá dược vừa đủ','Diclofenac 50mg'),(2500.00,'CAT005','MED005','ORG005','UNIT001','https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=300&q=80','Celecoxib 200mg và tá dược vừa đủ','Celecoxib 200mg'),(3000.00,'CAT006','MED006','ORG006','UNIT001','https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=300&q=80','Aspirin 81mg và tá dược vừa đủ','Aspirin 81mg'),(3500.00,'CAT007','MED007','ORG007','UNIT001','https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=300&q=80','Amoxicillin 500mg và tá dược vừa đủ','Amoxicillin 500mg'),(4000.00,'CAT008','MED008','ORG008','UNIT001','https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=300&q=80','Amoxicillin 875mg + Clavulanic Acid 125mg và tá dược vừa đủ','Augmentin 1g'),(4500.00,'CAT009','MED009','ORG009','UNIT001','https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=300&q=80','Amoxicillin 500mg + Clavulanic Acid 125mg và tá dược vừa đủ','Klamentin 625mg'),(5000.00,'CAT010','MED010','ORG010','UNIT001','https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=300&q=80','Cephalexin 500mg và tá dược vừa đủ','Cephalexin 500mg'),(500.00,'CAT011','MED011','ORG011','UNIT001','https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=300&q=80','Cefuroxime Axetil 500mg và tá dược vừa đủ','Cefuroxime Axetil 500mg'),(12000.00,'CAT012','MED012','ORG012','UNIT001','https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=300&q=80','Cefuroxime 250mg và tá dược vừa đủ','Zinnat 250mg'),(1500.00,'CAT013','MED013','ORG013','UNIT001','https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=300&q=80','Cefixime 200mg và tá dược vừa đủ','Cefixime 200mg'),(2000.00,'CAT014','MED014','ORG014','UNIT001','https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=300&q=80','Azithromycin 500mg và tá dược vừa đủ','Azithromycin 500mg'),(2500.00,'CAT015','MED015','ORG015','UNIT001','https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=300&q=80','Azithromycin 250mg và tá dược vừa đủ','Zithromax 250mg'),(3000.00,'CAT016','MED016','ORG016','UNIT001','https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=300&q=80','Clarithromycin 500mg và tá dược vừa đủ','Clarithromycin 500mg'),(3500.00,'CAT017','MED017','ORG017','UNIT001','https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=300&q=80','Clarithromycin 500mg và tá dược vừa đủ','Klacid MR 500mg'),(4000.00,'CAT018','MED018','ORG018','UNIT001','https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=300&q=80','Levofloxacin 500mg và tá dược vừa đủ','Levofloxacin 500mg'),(16000.00,'CAT019','MED019','ORG019','UNIT001','https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=300&q=80','Levofloxacin 500mg và tá dược vừa đủ','Tavanic 500mg'),(5000.00,'CAT020','MED020','ORG020','UNIT001','https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=300&q=80','Ciprofloxacin 500mg và tá dược vừa đủ','Ciprofloxacin 500mg'),(500.00,'CAT021','MED021','ORG021','UNIT001','https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=300&q=80','Metronidazole 250mg và tá dược vừa đủ','Metronidazole 250mg'),(3000.00,'CAT022','MED022','ORG022','UNIT006','https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=300&q=80','Acetylcysteine 200mg và tá dược vừa đủ','Acetylcysteine 200mg'),(4000.00,'CAT023','MED023','ORG023','UNIT006','https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=300&q=80','Acetylcysteine 200mg và tá dược vừa đủ','Acemuc 200mg'),(2000.00,'CAT024','MED024','ORG024','UNIT001','https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=300&q=80','Ambroxol hydrochloride 30mg và tá dược vừa đủ','Ambroxol 30mg'),(2500.00,'CAT025','MED025','ORG025','UNIT001','https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=300&q=80','Bromhexine hydrochloride 8mg và tá dược vừa đủ','Bisolvon 8mg'),(3000.00,'CAT026','MED026','ORG026','UNIT001','https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=300&q=80','Dextromethorphan HBr 15mg và tá dược vừa đủ','Dextromethorphan 15mg'),(6500.00,'CAT001','MED027','ORG001','UNIT007','https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=300&q=80','Salbutamol 2.5mg và tá dược vừa đủ','Ventolin Nebules 2.5mg'),(120000.00,'CAT002','MED028','ORG002','UNIT011','https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=300&q=80','Salmeterol 25mcg + Fluticasone Propionate 250mcg và tá dược vừa đủ','Seretide Evohaler 25/250mcg'),(16000.00,'CAT003','MED029','ORG003','UNIT001','https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=300&q=80','Montelukast natri 4mg và tá dược vừa đủ','Singulair 4mg'),(5000.00,'CAT004','MED030','ORG004','UNIT001','https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=300&q=80','Loratadine 10mg và tá dược vừa đủ','Loratadine 10mg'),(500.00,'CAT005','MED031','ORG005','UNIT001','https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=300&q=80','Loratadine 10mg và tá dược vừa đủ','Clarityne 10mg'),(1000.00,'CAT006','MED032','ORG006','UNIT001','https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=300&q=80','Cetirizine dihydrochloride 10mg và tá dược vừa đủ','Cetirizine 10mg'),(1500.00,'CAT007','MED033','ORG007','UNIT001','https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=300&q=80','Cetirizine dihydrochloride 10mg và tá dược vừa đủ','Zyrtec 10mg'),(2000.00,'CAT008','MED034','ORG008','UNIT001','https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=300&q=80','Fexofenadine hydrochloride 180mg và tá dược vừa đủ','Fexofenadine 180mg'),(2500.00,'CAT009','MED035','ORG009','UNIT001','https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=300&q=80','Fexofenadine hydrochloride 60mg và tá dược vừa đủ','Telfast 60mg'),(3000.00,'CAT010','MED036','ORG010','UNIT001','https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=300&q=80','Desloratadine 5mg và tá dược vừa đủ','Aerius 5mg'),(3500.00,'CAT011','MED037','ORG011','UNIT001','https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=300&q=80','Chlorpheniramine maleate 4mg và tá dược vừa đủ','Chlorpheniramine 4mg'),(4000.00,'CAT012','MED038','ORG012','UNIT001','https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=300&q=80','Omeprazole 20mg và tá dược vừa đủ','Omeprazole 20mg'),(16000.00,'CAT013','MED039','ORG013','UNIT001','https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=300&q=80','Esomeprazole magnesium trihydrate 40mg và tá dược vừa đủ','Nexium mups 40mg'),(5000.00,'CAT014','MED040','ORG014','UNIT001','https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=300&q=80','Pantoprazole 40mg và tá dược vừa đủ','Pantoprazole 40mg'),(500.00,'CAT015','MED041','ORG015','UNIT001','https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=300&q=80','Rabeprazole natri 20mg và tá dược vừa đủ','Pariet 20mg'),(1000.00,'CAT016','MED042','ORG016','UNIT001','https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=300&q=80','Ranitidine 150mg và tá dược vừa đủ','Ranitidine 150mg'),(1500.00,'CAT017','MED043','ORG017','UNIT001','https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=300&q=80','Famotidine 20mg và tá dược vừa đủ','Famotidine 20mg'),(5000.00,'CAT018','MED044','ORG018','UNIT006','https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=300&q=80','Colloid Alumini phosphat 20% và tá dược vừa đủ','Phosphalugel'),(6000.00,'CAT019','MED045','ORG019','UNIT006','https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=300&q=80','Natri alginate + Calci carbonat và tá dược vừa đủ','Gaviscon Dual Action'),(3000.00,'CAT020','MED046','ORG020','UNIT001','https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=300&q=80','Domperidone 10mg và tá dược vừa đủ','Motilium 10mg'),(3500.00,'CAT021','MED047','ORG021','UNIT001','https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=300&q=80','Metoclopramide hydrochloride 10mg và tá dược vừa đủ','Primperan 10mg'),(4000.00,'CAT022','MED048','ORG022','UNIT001','https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=300&q=80','Ondansetron 8mg và tá dược vừa đủ','Zofran 8mg'),(4500.00,'CAT023','MED049','ORG023','UNIT001','https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=300&q=80','Loperamide hydrochloride 2mg và tá dược vừa đủ','Imodium 2mg'),(6000.00,'CAT024','MED050','ORG024','UNIT006','https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=300&q=80','Dioctahedral smectite 3g và tá dược vừa đủ','Smecta 3g'),(2000.00,'CAT025','MED051','ORG025','UNIT006','https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=300&q=80','Natri clorid, Natri citrat, Kali clorid, Glucose khan và tá dược vừa đủ','Oresol 27.9g'),(3000.00,'CAT026','MED052','ORG026','UNIT006','https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=300&q=80','Lactulose 10g/15ml và tá dược vừa đủ','Duphalac 667mg/ml'),(1500.00,'CAT001','MED053','ORG001','UNIT001','https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=300&q=80','Bisacodyl 5mg và tá dược vừa đủ','Dulcolax 5mg'),(2000.00,'CAT002','MED054','ORG002','UNIT001','https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=300&q=80','Metformin hydrochloride 850mg và tá dược vừa đủ','Glucophage 850mg'),(2500.00,'CAT003','MED055','ORG003','UNIT001','https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=300&q=80','Gliclazide 60mg và tá dược vừa đủ','Diamicron MR 60mg'),(3000.00,'CAT004','MED056','ORG004','UNIT001','https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=300&q=80','Glimepiride 2mg và tá dược vừa đủ','Amaryl 2mg'),(3500.00,'CAT005','MED057','ORG005','UNIT001','https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=300&q=80','Amlodipine besylate 5mg và tá dược vừa đủ','Amlor 5mg'),(4000.00,'CAT006','MED058','ORG006','UNIT001','https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=300&q=80','Nifedipine 30mg và tá dược vừa đủ','Adalat LA 30mg'),(4500.00,'CAT007','MED059','ORG007','UNIT001','https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=300&q=80','Losartan kali 50mg và tá dược vừa đủ','Cozaar 50mg'),(5000.00,'CAT008','MED060','ORG008','UNIT001','https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=300&q=80','Valsartan 80mg và tá dược vừa đủ','Diovan 80mg'),(500.00,'CAT009','MED061','ORG009','UNIT001','https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=300&q=80','Telmisartan 40mg và tá dược vừa đủ','Micardis 40mg'),(1000.00,'CAT010','MED062','ORG010','UNIT001','https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=300&q=80','Captopril 25mg và tá dược vừa đủ','Captopril 25mg'),(1500.00,'CAT011','MED063','ORG011','UNIT001','https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=300&q=80','Metoprolol succinate 50mg và tá dược vừa đủ','Betaloc ZOK 50mg'),(2000.00,'CAT012','MED064','ORG012','UNIT001','https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=300&q=80','Bisoprolol fumarate 5mg và tá dược vừa đủ','Concor 5mg'),(18000.00,'CAT013','MED065','ORG013','UNIT001','https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=300&q=80','Atorvastatin calcium trihydrate 20mg và tá dược vừa đủ','Lipitor 20mg'),(10000.00,'CAT014','MED066','ORG014','UNIT001','https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=300&q=80','Rosuvastatin calcium 10mg và tá dược vừa đủ','Crestor 10mg'),(3500.00,'CAT015','MED067','ORG015','UNIT001','https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=300&q=80','Simvastatin 20mg và tá dược vừa đủ','Zocor 20mg'),(4000.00,'CAT016','MED068','ORG016','UNIT001','https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=300&q=80','Fenofibrate 145mg và tá dược vừa đủ','Lipanthyl NT 145mg'),(4500.00,'CAT017','MED069','ORG017','UNIT001','https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=300&q=80','Diazepam 5mg và tá dược vừa đủ','Seduxen 5mg'),(5000.00,'CAT018','MED070','ORG018','UNIT001','https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=300&q=80','Ginkgo biloba extract 40mg và tá dược vừa đủ','Tanakan 40mg'),(500.00,'CAT019','MED071','ORG019','UNIT001','https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=300&q=80','Piracetam 800mg và tá dược vừa đủ','Nootropil 800mg'),(1000.00,'CAT020','MED072','ORG020','UNIT001','https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=300&q=80','Betahistine mesilate 6mg và tá dược vừa đủ','Merislon 6mg'),(1500.00,'CAT021','MED073','ORG021','UNIT001','https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=300&q=80','Flunarizine hydrochloride 5mg và tá dược vừa đủ','Sibelium 5mg'),(2000.00,'CAT022','MED074','ORG022','UNIT001','https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=300&q=80','Glucosamine sulfate 1500mg và tá dược vừa đủ','Glucosamine Chondroitin'),(5000.00,'CAT023','MED075','ORG023','UNIT019','https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=300&q=80','Calcium lactate gluconate + Calcium carbonate + Vitamin D3 và tá dược vừa đủ','Calcium D3 Sandoz');
/*!40000 ALTER TABLE `medicine` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `medicine_unit_conversion`
--

DROP TABLE IF EXISTS `medicine_unit_conversion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `medicine_unit_conversion` (
  `conversion_rate` int DEFAULT NULL,
  `id` int NOT NULL AUTO_INCREMENT,
  `medicine_id` varchar(50) NOT NULL,
  `unit_id` varchar(50) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FKsr6vnucsq3fyc4xtie7c2d8au` (`medicine_id`),
  KEY `FKff4fl4t3hd4nvp7li510gxog3` (`unit_id`),
  CONSTRAINT `FKff4fl4t3hd4nvp7li510gxog3` FOREIGN KEY (`unit_id`) REFERENCES `unit` (`unitid`),
  CONSTRAINT `FKsr6vnucsq3fyc4xtie7c2d8au` FOREIGN KEY (`medicine_id`) REFERENCES `medicine` (`medicineid`)
) ENGINE=InnoDB AUTO_INCREMENT=141 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `medicine_unit_conversion`
--

LOCK TABLES `medicine_unit_conversion` WRITE;
/*!40000 ALTER TABLE `medicine_unit_conversion` DISABLE KEYS */;
INSERT INTO `medicine_unit_conversion` VALUES (10,1,'MED001','UNIT004'),(100,2,'MED001','UNIT002'),(10,3,'MED002','UNIT004'),(100,4,'MED002','UNIT002'),(10,5,'MED003','UNIT004'),(100,6,'MED003','UNIT002'),(10,7,'MED004','UNIT004'),(100,8,'MED004','UNIT002'),(10,9,'MED005','UNIT004'),(100,10,'MED005','UNIT002'),(10,11,'MED006','UNIT004'),(100,12,'MED006','UNIT002'),(10,13,'MED007','UNIT004'),(100,14,'MED007','UNIT002'),(10,15,'MED008','UNIT004'),(100,16,'MED008','UNIT002'),(10,17,'MED009','UNIT004'),(100,18,'MED009','UNIT002'),(10,19,'MED010','UNIT004'),(100,20,'MED010','UNIT002'),(10,21,'MED011','UNIT004'),(100,22,'MED011','UNIT002'),(10,23,'MED012','UNIT004'),(100,24,'MED012','UNIT002'),(10,25,'MED013','UNIT004'),(100,26,'MED013','UNIT002'),(10,27,'MED014','UNIT004'),(100,28,'MED014','UNIT002'),(10,29,'MED015','UNIT004'),(100,30,'MED015','UNIT002'),(10,31,'MED016','UNIT004'),(100,32,'MED016','UNIT002'),(10,33,'MED017','UNIT004'),(100,34,'MED017','UNIT002'),(10,35,'MED018','UNIT004'),(100,36,'MED018','UNIT002'),(10,37,'MED019','UNIT004'),(100,38,'MED019','UNIT002'),(10,39,'MED020','UNIT004'),(100,40,'MED020','UNIT002'),(10,41,'MED021','UNIT004'),(100,42,'MED021','UNIT002'),(20,43,'MED022','UNIT002'),(20,44,'MED023','UNIT002'),(10,45,'MED024','UNIT004'),(100,46,'MED024','UNIT002'),(10,47,'MED025','UNIT004'),(100,48,'MED025','UNIT002'),(10,49,'MED026','UNIT004'),(100,50,'MED026','UNIT002'),(10,51,'MED027','UNIT002'),(10,52,'MED028','UNIT002'),(10,53,'MED029','UNIT004'),(100,54,'MED029','UNIT002'),(10,55,'MED030','UNIT004'),(100,56,'MED030','UNIT002'),(10,57,'MED031','UNIT004'),(100,58,'MED031','UNIT002'),(10,59,'MED032','UNIT004'),(100,60,'MED032','UNIT002'),(10,61,'MED033','UNIT004'),(100,62,'MED033','UNIT002'),(10,63,'MED034','UNIT004'),(100,64,'MED034','UNIT002'),(10,65,'MED035','UNIT004'),(100,66,'MED035','UNIT002'),(10,67,'MED036','UNIT004'),(100,68,'MED036','UNIT002'),(10,69,'MED037','UNIT004'),(100,70,'MED037','UNIT002'),(10,71,'MED038','UNIT004'),(100,72,'MED038','UNIT002'),(10,73,'MED039','UNIT004'),(100,74,'MED039','UNIT002'),(10,75,'MED040','UNIT004'),(100,76,'MED040','UNIT002'),(10,77,'MED041','UNIT004'),(100,78,'MED041','UNIT002'),(10,79,'MED042','UNIT004'),(100,80,'MED042','UNIT002'),(10,81,'MED043','UNIT004'),(100,82,'MED043','UNIT002'),(20,83,'MED044','UNIT002'),(20,84,'MED045','UNIT002'),(10,85,'MED046','UNIT004'),(100,86,'MED046','UNIT002'),(10,87,'MED047','UNIT004'),(100,88,'MED047','UNIT002'),(10,89,'MED048','UNIT004'),(100,90,'MED048','UNIT002'),(10,91,'MED049','UNIT004'),(100,92,'MED049','UNIT002'),(20,93,'MED050','UNIT002'),(20,94,'MED051','UNIT002'),(20,95,'MED052','UNIT002'),(10,96,'MED053','UNIT004'),(100,97,'MED053','UNIT002'),(10,98,'MED054','UNIT004'),(100,99,'MED054','UNIT002'),(10,100,'MED055','UNIT004'),(100,101,'MED055','UNIT002'),(10,102,'MED056','UNIT004'),(100,103,'MED056','UNIT002'),(10,104,'MED057','UNIT004'),(100,105,'MED057','UNIT002'),(10,106,'MED058','UNIT004'),(100,107,'MED058','UNIT002'),(10,108,'MED059','UNIT004'),(100,109,'MED059','UNIT002'),(10,110,'MED060','UNIT004'),(100,111,'MED060','UNIT002'),(10,112,'MED061','UNIT004'),(100,113,'MED061','UNIT002'),(10,114,'MED062','UNIT004'),(100,115,'MED062','UNIT002'),(10,116,'MED063','UNIT004'),(100,117,'MED063','UNIT002'),(10,118,'MED064','UNIT004'),(100,119,'MED064','UNIT002'),(10,120,'MED065','UNIT004'),(100,121,'MED065','UNIT002'),(10,122,'MED066','UNIT004'),(100,123,'MED066','UNIT002'),(10,124,'MED067','UNIT004'),(100,125,'MED067','UNIT002'),(10,126,'MED068','UNIT004'),(100,127,'MED068','UNIT002'),(10,128,'MED069','UNIT004'),(100,129,'MED069','UNIT002'),(10,130,'MED070','UNIT004'),(100,131,'MED070','UNIT002'),(10,132,'MED071','UNIT004'),(100,133,'MED071','UNIT002'),(10,134,'MED072','UNIT004'),(100,135,'MED072','UNIT002'),(10,136,'MED073','UNIT004'),(100,137,'MED073','UNIT002'),(10,138,'MED074','UNIT004'),(100,139,'MED074','UNIT002'),(10,140,'MED075','UNIT002');
/*!40000 ALTER TABLE `medicine_unit_conversion` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `medicines_supplier`
--

DROP TABLE IF EXISTS `medicines_supplier`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `medicines_supplier` (
  `phone_number` varchar(15) NOT NULL,
  `supplierid` varchar(50) NOT NULL,
  `address` text NOT NULL,
  `supplier_name` varchar(255) NOT NULL,
  PRIMARY KEY (`supplierid`),
  UNIQUE KEY `UKd4veal5yu761ttvxlj5j4j2q0` (`phone_number`),
  UNIQUE KEY `UKr7gy4afekqltllifojej58qty` (`supplier_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `medicines_supplier`
--

LOCK TABLES `medicines_supplier` WRITE;
/*!40000 ALTER TABLE `medicines_supplier` DISABLE KEYS */;
INSERT INTO `medicines_supplier` VALUES ('0900123001','SUP001','Địa chỉ tại TỒN KHO KHỞI TẠO','TỒN KHO KHỞI TẠO'),('0900123002','SUP002','Địa chỉ tại Công ty Cổ phần Dược phẩm Trung ương 1 (CPC1)','Công ty Cổ phần Dược phẩm Trung ương 1 (CPC1)'),('0900123003','SUP003','Địa chỉ tại Công ty Cổ phần Dược Hậu Giang (DHG)','Công ty Cổ phần Dược Hậu Giang (DHG)'),('0900123004','SUP004','Địa chỉ tại Công ty Cổ phần Traphaco','Công ty Cổ phần Traphaco'),('0900123005','SUP005','Địa chỉ tại Công ty Cổ phần Dược phẩm Imexpharm','Công ty Cổ phần Dược phẩm Imexpharm'),('0900123006','SUP006','Địa chỉ tại Công ty Cổ phần Dược phẩm Domesco','Công ty Cổ phần Dược phẩm Domesco'),('0900123007','SUP007','Địa chỉ tại Công ty Cổ phần Dược Phẩm OPC','Công ty Cổ phần Dược Phẩm OPC'),('0900123008','SUP008','Địa chỉ tại Công ty Cổ phần Dược Hà Tây','Công ty Cổ phần Dược Hà Tây'),('0900123009','SUP009','Địa chỉ tại Công ty Cổ phần Pharmedic','Công ty Cổ phần Pharmedic'),('0900123010','SUP010','Địa chỉ tại Công ty TNHH Sanofi-Aventis Việt Nam','Công ty TNHH Sanofi-Aventis Việt Nam'),('0900123011','SUP011','Địa chỉ tại Công ty Cổ phần Dược Lâm Đồng (Ladophar)','Công ty Cổ phần Dược Lâm Đồng (Ladophar)'),('0900123012','SUP012','Địa chỉ tại Công ty Cổ phần Dược Cửu Long (Pharimexco)','Công ty Cổ phần Dược Cửu Long (Pharimexco)'),('0900123013','SUP013','Địa chỉ tại Công ty Cổ phần Dược phẩm Boston Việt Nam','Công ty Cổ phần Dược phẩm Boston Việt Nam'),('0900123014','SUP014','Địa chỉ tại Công ty Cổ phần Dược phẩm Nam Hà','Công ty Cổ phần Dược phẩm Nam Hà'),('0900123015','SUP015','Địa chỉ tại Công ty Cổ phần Dược phẩm Khánh Hòa','Công ty Cổ phần Dược phẩm Khánh Hòa'),('0900123016','SUP016','Địa chỉ tại Công ty Cổ phần Dược phẩm Savi (Savipharm)','Công ty Cổ phần Dược phẩm Savi (Savipharm)'),('0900123017','SUP017','Địa chỉ tại Công ty Cổ phần Dược Vĩnh Phúc (Vinphaco)','Công ty Cổ phần Dược Vĩnh Phúc (Vinphaco)'),('0900123018','SUP018','Địa chỉ tại Công ty Cổ phần Dược Medipharco','Công ty Cổ phần Dược Medipharco'),('0900123019','SUP019','Địa chỉ tại Công ty Cổ phần Dược phẩm Danapha','Công ty Cổ phần Dược phẩm Danapha'),('0900123020','SUP020','Địa chỉ tại Công ty Cổ phần Hóa - Dược phẩm Mekophar','Công ty Cổ phần Hóa - Dược phẩm Mekophar'),('0900123021','SUP021','Địa chỉ tại Công ty Cổ phần Dược vật tư y tế Bình Định (Bidiphar)','Công ty Cổ phần Dược vật tư y tế Bình Định (Bidiphar)'),('0900123022','SUP022','Địa chỉ tại Công ty Cổ phần Dược Phẩm Yên Bái','Công ty Cổ phần Dược Phẩm Yên Bái'),('0900123023','SUP023','Địa chỉ tại Công ty Cổ phần Dược phẩm Gia Lai','Công ty Cổ phần Dược phẩm Gia Lai'),('0900123024','SUP024','Địa chỉ tại Công ty Cổ phần Dược phẩm Tipharco','Công ty Cổ phần Dược phẩm Tipharco'),('0900123025','SUP025','Địa chỉ tại Công ty Cổ phần Dược phẩm Quảng Bình','Công ty Cổ phần Dược phẩm Quảng Bình'),('0900123026','SUP026','Địa chỉ tại Công ty TNHH AstraZeneca Việt Nam','Công ty TNHH AstraZeneca Việt Nam'),('0900123027','SUP027','Địa chỉ tại Công ty TNHH Pfizer Việt Nam','Công ty TNHH Pfizer Việt Nam');
/*!40000 ALTER TABLE `medicines_supplier` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `origin`
--

DROP TABLE IF EXISTS `origin`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `origin` (
  `originid` varchar(50) NOT NULL,
  `origin_name` varchar(100) NOT NULL,
  PRIMARY KEY (`originid`),
  UNIQUE KEY `UKd6mrs4ptcnev11b9vnmfmvdfw` (`origin_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `origin`
--

LOCK TABLES `origin` WRITE;
/*!40000 ALTER TABLE `origin` DISABLE KEYS */;
INSERT INTO `origin` VALUES ('ORG005','Ấn Độ'),('ORG006','Anh'),('ORG026','Áo'),('ORG018','Bỉ'),('ORG012','Canada'),('ORG022','Đài Loan'),('ORG021','Đan Mạch'),('ORG004','Đức'),('ORG019','Hà Lan'),('ORG009','Hàn Quốc'),('ORG023','Hồng Kông'),('ORG015','Malaysia'),('ORG002','Mỹ'),('ORG025','New Zealand'),('ORG024','Nga'),('ORG008','Nhật Bản'),('ORG003','Pháp'),('ORG013','Singapore'),('ORG017','Tây Ban Nha'),('ORG014','Thái Lan'),('ORG020','Thụy Điển'),('ORG010','Thụy Sĩ'),('ORG016','Trung Quốc'),('ORG011','Úc'),('ORG001','Việt Nam'),('ORG007','Ý');
/*!40000 ALTER TABLE `origin` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `refresh_token`
--

DROP TABLE IF EXISTS `refresh_token`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `refresh_token` (
  `expiry_date` datetime(6) NOT NULL,
  `id` bigint NOT NULL AUTO_INCREMENT,
  `username` varchar(100) NOT NULL,
  `token` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UKr4k4edos30bx9neoq81mdvwph` (`token`),
  KEY `idx_refresh_token_username` (`username`),
  KEY `idx_refresh_token_expiry` (`expiry_date`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `refresh_token`
--

LOCK TABLES `refresh_token` WRITE;
/*!40000 ALTER TABLE `refresh_token` DISABLE KEYS */;
INSERT INTO `refresh_token` VALUES ('2026-06-13 16:22:49.813221',1,'admin','76802644-1857-4ecf-8644-d8fd9be2659a'),('2026-06-13 16:23:22.567356',2,'admin','21078338-8c26-45b0-8daa-273b13854924'),('2026-06-13 16:24:55.258724',3,'manager','247419fc-a3f7-4542-af9b-8d85a2805733'),('2026-06-13 16:25:04.797376',4,'sales','597a94d1-980b-475b-a6d7-759518683ff7'),('2026-06-13 16:25:19.087081',5,'admin','7e2d8c4b-af70-482a-99db-7b588775c44a');
/*!40000 ALTER TABLE `refresh_token` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `role`
--

DROP TABLE IF EXISTS `role`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `role` (
  `roleid` int NOT NULL AUTO_INCREMENT,
  `role_name` enum('Admin','Product_manager','Sales') NOT NULL,
  PRIMARY KEY (`roleid`),
  UNIQUE KEY `UKiubw515ff0ugtm28p8g3myt0h` (`role_name`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `role`
--

LOCK TABLES `role` WRITE;
/*!40000 ALTER TABLE `role` DISABLE KEYS */;
INSERT INTO `role` VALUES (1,'Admin'),(3,'Product_manager'),(2,'Sales');
/*!40000 ALTER TABLE `role` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `stock_audit`
--

DROP TABLE IF EXISTS `stock_audit`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `stock_audit` (
  `audit_time` datetime(6) NOT NULL,
  `approved_by` varchar(50) DEFAULT NULL,
  `audit_id` varchar(50) NOT NULL,
  `created_by` varchar(50) NOT NULL,
  `note` text,
  `status` enum('CANCELLED','CONFIRMED','DRAFT','IN_PROGRESS') NOT NULL,
  PRIMARY KEY (`audit_id`),
  KEY `FKarofxuxcrrne90spjcrrfaxe3` (`approved_by`),
  KEY `FK3dr27sgniw0wi1akei8xhd784` (`created_by`),
  CONSTRAINT `FK3dr27sgniw0wi1akei8xhd784` FOREIGN KEY (`created_by`) REFERENCES `employee` (`employeeid`),
  CONSTRAINT `FKarofxuxcrrne90spjcrrfaxe3` FOREIGN KEY (`approved_by`) REFERENCES `employee` (`employeeid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `stock_audit`
--

LOCK TABLES `stock_audit` WRITE;
/*!40000 ALTER TABLE `stock_audit` DISABLE KEYS */;
INSERT INTO `stock_audit` VALUES ('2026-06-06 23:08:02.937634','EMP001','SA001','EMP002','Kiểm kê định kỳ thực tế đợt 1','CONFIRMED'),('2026-06-06 23:08:02.956862','EMP001','SA002','EMP003','Kiểm kê định kỳ thực tế đợt 2','CONFIRMED'),('2026-06-06 23:08:02.985508','EMP001','SA003','EMP004','Kiểm kê định kỳ thực tế đợt 3','CONFIRMED'),('2026-06-06 23:08:03.013982','EMP001','SA004','EMP005','Kiểm kê định kỳ thực tế đợt 4','CONFIRMED'),('2026-06-06 23:08:03.032557',NULL,'SA005','EMP001','Kiểm kê định kỳ thực tế đợt 5','DRAFT'),('2026-06-06 23:08:03.075101','EMP001','SA006','EMP002','Kiểm kê định kỳ thực tế đợt 6','CONFIRMED'),('2026-06-06 23:08:03.112478','EMP001','SA007','EMP003','Kiểm kê định kỳ thực tế đợt 7','CONFIRMED'),('2026-06-06 23:08:03.129444','EMP001','SA008','EMP004','Kiểm kê định kỳ thực tế đợt 8','CONFIRMED'),('2026-06-06 23:08:03.147036','EMP001','SA009','EMP005','Kiểm kê định kỳ thực tế đợt 9','CONFIRMED'),('2026-06-06 23:08:03.169198',NULL,'SA010','EMP001','Kiểm kê định kỳ thực tế đợt 10','DRAFT'),('2026-06-06 23:08:03.199075','EMP001','SA011','EMP002','Kiểm kê định kỳ thực tế đợt 11','CONFIRMED'),('2026-06-06 23:08:03.221363','EMP001','SA012','EMP003','Kiểm kê định kỳ thực tế đợt 12','CONFIRMED'),('2026-06-06 23:08:03.275345','EMP001','SA013','EMP004','Kiểm kê định kỳ thực tế đợt 13','CONFIRMED'),('2026-06-06 23:08:03.405679','EMP001','SA014','EMP005','Kiểm kê định kỳ thực tế đợt 14','CONFIRMED'),('2026-06-06 23:08:03.577260',NULL,'SA015','EMP001','Kiểm kê định kỳ thực tế đợt 15','DRAFT'),('2026-06-06 23:08:03.670061','EMP001','SA016','EMP002','Kiểm kê định kỳ thực tế đợt 16','CONFIRMED'),('2026-06-06 23:08:03.700136','EMP001','SA017','EMP003','Kiểm kê định kỳ thực tế đợt 17','CONFIRMED'),('2026-06-06 23:08:03.722180','EMP001','SA018','EMP004','Kiểm kê định kỳ thực tế đợt 18','CONFIRMED'),('2026-06-06 23:08:03.738653','EMP001','SA019','EMP005','Kiểm kê định kỳ thực tế đợt 19','CONFIRMED'),('2026-06-06 23:08:03.752579',NULL,'SA020','EMP001','Kiểm kê định kỳ thực tế đợt 20','DRAFT'),('2026-06-06 23:08:03.769584','EMP001','SA021','EMP002','Kiểm kê định kỳ thực tế đợt 21','CONFIRMED'),('2026-06-06 23:08:03.782792','EMP001','SA022','EMP003','Kiểm kê định kỳ thực tế đợt 22','CONFIRMED'),('2026-06-06 23:08:03.802054','EMP001','SA023','EMP004','Kiểm kê định kỳ thực tế đợt 23','CONFIRMED'),('2026-06-06 23:08:03.870338','EMP001','SA024','EMP005','Kiểm kê định kỳ thực tế đợt 24','CONFIRMED'),('2026-06-06 23:08:03.889346',NULL,'SA025','EMP001','Kiểm kê định kỳ thực tế đợt 25','DRAFT');
/*!40000 ALTER TABLE `stock_audit` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `stock_audit_detail`
--

DROP TABLE IF EXISTS `stock_audit_detail`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `stock_audit_detail` (
  `actual_quantity` int DEFAULT NULL,
  `discrepancy` int DEFAULT NULL,
  `system_quantity` int NOT NULL,
  `id` bigint NOT NULL AUTO_INCREMENT,
  `audit_id` varchar(50) NOT NULL,
  `inventory_id` varchar(50) NOT NULL,
  `note` text,
  PRIMARY KEY (`id`),
  KEY `FK1sdudfybod96948mauuv6293b` (`audit_id`),
  KEY `FK3blrf9g50cxfetsc6okld096y` (`inventory_id`),
  CONSTRAINT `FK1sdudfybod96948mauuv6293b` FOREIGN KEY (`audit_id`) REFERENCES `stock_audit` (`audit_id`),
  CONSTRAINT `FK3blrf9g50cxfetsc6okld096y` FOREIGN KEY (`inventory_id`) REFERENCES `inventory` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `stock_audit_detail`
--

LOCK TABLES `stock_audit_detail` WRITE;
/*!40000 ALTER TABLE `stock_audit_detail` DISABLE KEYS */;
INSERT INTO `stock_audit_detail` VALUES (100,-1,101,1,'SA001','INV002','Kiểm kê thực tế'),(100,-2,102,2,'SA002','INV003','Kiểm kê thực tế'),(103,0,103,3,'SA003','INV004','Kiểm kê thực tế'),(103,-1,104,4,'SA004','INV005','Kiểm kê thực tế'),(103,-2,105,5,'SA005','INV006','Kiểm kê thực tế'),(106,0,106,6,'SA006','INV007','Kiểm kê thực tế'),(106,-1,107,7,'SA007','INV008','Kiểm kê thực tế'),(106,-2,108,8,'SA008','INV009','Kiểm kê thực tế'),(109,0,109,9,'SA009','INV010','Kiểm kê thực tế'),(109,-1,110,10,'SA010','INV011','Kiểm kê thực tế'),(109,-2,111,11,'SA011','INV012','Kiểm kê thực tế'),(112,0,112,12,'SA012','INV013','Kiểm kê thực tế'),(112,-1,113,13,'SA013','INV014','Kiểm kê thực tế'),(112,-2,114,14,'SA014','INV015','Kiểm kê thực tế'),(115,0,115,15,'SA015','INV016','Kiểm kê thực tế'),(115,-1,116,16,'SA016','INV017','Kiểm kê thực tế'),(115,-2,117,17,'SA017','INV018','Kiểm kê thực tế'),(118,0,118,18,'SA018','INV019','Kiểm kê thực tế'),(118,-1,119,19,'SA019','INV020','Kiểm kê thực tế'),(118,-2,120,20,'SA020','INV021','Kiểm kê thực tế'),(121,0,121,21,'SA021','INV022','Kiểm kê thực tế'),(121,-1,122,22,'SA022','INV023','Kiểm kê thực tế'),(121,-2,123,23,'SA023','INV024','Kiểm kê thực tế'),(124,0,124,24,'SA024','INV025','Kiểm kê thực tế'),(124,-1,125,25,'SA025','INV026','Kiểm kê thực tế');
/*!40000 ALTER TABLE `stock_audit_detail` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `unit`
--

DROP TABLE IF EXISTS `unit`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `unit` (
  `unit_name` varchar(50) NOT NULL,
  `unitid` varchar(50) NOT NULL,
  PRIMARY KEY (`unitid`),
  UNIQUE KEY `UKda8eog93rhwgf6726q1nftsr6` (`unit_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `unit`
--

LOCK TABLES `unit` WRITE;
/*!40000 ALTER TABLE `unit` DISABLE KEYS */;
INSERT INTO `unit` VALUES ('Amput','UNIT018'),('Bánh','UNIT021'),('Bình','UNIT011'),('Cái','UNIT012'),('Cặp','UNIT025'),('Chai','UNIT003'),('Chiếc','UNIT013'),('Cốc','UNIT009'),('Cuộn','UNIT014'),('Cuộn băng','UNIT023'),('Gói','UNIT006'),('Hộp','UNIT002'),('Hũ','UNIT026'),('Liều','UNIT022'),('Lọ','UNIT008'),('Miếng','UNIT015'),('Ống','UNIT007'),('Ống hít','UNIT024'),('Ống tiêm','UNIT017'),('Thìa','UNIT010'),('Tờ','UNIT016'),('Túi','UNIT020'),('Tuýp','UNIT005'),('Vỉ','UNIT004'),('Viên','UNIT001'),('Viên sủi','UNIT019');
/*!40000 ALTER TABLE `unit` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-06-06 23:26:30
