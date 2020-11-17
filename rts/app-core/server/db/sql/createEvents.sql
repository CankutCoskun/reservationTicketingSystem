CREATE TABLE `reservations`.`Events` (
  `eId` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `title` VARCHAR(45) NOT NULL DEFAULT 'Title',
  `detail` VARCHAR(245) NOT NULL DEFAULT 'Detail',
  `address` VARCHAR(145) NOT NULL DEFAULT 'Address',
  `date` DATETIME NOT NULL,
  `capacity` INT NOT NULL,
  `createdDate` DATETIME NOT NULL,
  `updatedDate` DATETIME NOT NULL,
  `status` ENUM('ACTIVE', 'CANCELLED', 'PAST') NOT NULL DEFAULT 'ACTIVE',
  `imagePath` VARCHAR(145) NOT NULL,
  PRIMARY KEY (`eId`),
  UNIQUE INDEX `image_UNIQUE` (`imagePath` ASC) VISIBLE);