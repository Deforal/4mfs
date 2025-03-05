-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Хост: 127.0.0.1:3306
-- Время создания: Мар 05 2025 г., 08:32
-- Версия сервера: 8.0.30
-- Версия PHP: 7.2.34

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- База данных: `ZOP`
--

-- --------------------------------------------------------

--
-- Структура таблицы `Feedback`
--

CREATE TABLE `Feedback` (
  `id` int NOT NULL,
  `Name` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `E-mail` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `Phone` varchar(15) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `Comment` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Структура таблицы `Offers`
--

CREATE TABLE `Offers` (
  `Offer_id` int NOT NULL,
  `Product_id` int NOT NULL,
  `User_id` int NOT NULL,
  `Stage` varchar(20) COLLATE utf8mb4_general_ci NOT NULL,
  `Count` int NOT NULL DEFAULT '1'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Дамп данных таблицы `Offers`
--

INSERT INTO `Offers` (`Offer_id`, `Product_id`, `User_id`, `Stage`, `Count`) VALUES
(1, 2, 15, 'в корзине', 4),
(9, 1, 15, 'в корзине', 1),
(10, 3, 15, 'в корзине', 1),
(11, 4, 15, 'в корзине', 1),
(12, 5, 15, 'в корзине', 1),
(13, 6, 15, 'в корзине', 1);

-- --------------------------------------------------------

--
-- Структура таблицы `Products`
--

CREATE TABLE `Products` (
  `id` int NOT NULL,
  `Name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `Img_name` varchar(25) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Special_price` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Price` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `Desciption` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `Category` varchar(25) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Дамп данных таблицы `Products`
--

INSERT INTO `Products` (`id`, `Name`, `Img_name`, `Special_price`, `Price`, `Desciption`, `Category`) VALUES
(1, 'Optimum Nutrition 100% Whey Gold Standard', 'PROTEIN/1.jpg', '2943', '3872', NULL, 'Протеин'),
(2, 'Maxler 100% Golden Whey', 'PROTEIN/2.jpg', NULL, '3453', NULL, 'Протеин'),
(3, 'BSN Syntha-6 Edge', 'PROTEIN/3.jpg', NULL, '4982', NULL, 'Протеин'),
(4, 'Rule 1 R1 Protein', 'PROTEIN/4.jpg', NULL, '8992', NULL, 'Протеин'),
(5, 'Казеин 100% Casein Gold Standard от Optimum Nutrition', 'PROTEIN/5.jpg', NULL, '7895', NULL, 'Протеин'),
(6, 'Протеин казеин Syntrax Micellar Creme', 'PROTEIN/6.jpg', NULL, '2893', NULL, 'Протеин'),
(7, 'Протеин QNT Metapure Zero Carb', 'PROTEIN/7.jpg', NULL, '8195', NULL, 'Протеин'),
(8, 'Протеин Scitec 100% Whey Protein Professional', 'PROTEIN/8.jpg', NULL, '5495', NULL, 'Протеин'),
(9, 'BCAA 12000 Powder от Ultimate Nutrition', 'BCAA/1.jpg', '2333', '2500', NULL, 'Аминокислоты'),
(10, 'BCAA Amino X от BSN', 'BCAA/2.jpg', NULL, '2893', NULL, 'Аминокислоты'),
(11, 'Maxler Amino Max Hydrolysate', 'BCAA/3.jpg', NULL, '2679', NULL, 'Аминокислоты'),
(12, 'BCAA 1000 caps от Optimum Nutrition', 'BCAA/4.jpg', '3399', '3794', NULL, 'Аминокислоты'),
(13, 'Essential Amino Energy от Optimum Nutrition', 'BCAA/5.jpg', NULL, '1895', NULL, 'Аминокислоты'),
(14, 'Scivation Xtend BCAA', 'BCAA/6.jpg', NULL, '2594', NULL, 'Аминокислоты'),
(15, 'Mutant BCAA 9,7', 'BCAA/7.jpg', NULL, '1573', NULL, 'Аминокислоты'),
(16, 'BCAA-PRO 5000 от SAN', 'BCAA/8.jpg', '1645', '1899', NULL, 'Аминокислоты'),
(17, 'Гейнер BSN True-Mass 1200', 'Gainer/1.jpg', '6958', '7399', NULL, 'Гейнеры'),
(18, 'Гейнер Mutant Mass', 'Gainer/2.jpg', NULL, '6894', NULL, 'Гейнеры'),
(19, 'Гейнер Maxler Mega Gainer', 'Gainer/3.jpg', NULL, '996 ', NULL, 'Гейнеры'),
(20, 'Гейнер Serious Mass от Optimum Nutrition', 'Gainer/4.jpg', NULL, '8492', NULL, 'Гейнеры'),
(21, 'Optimum Nutrition Gold Standard Pro Gainer', 'Gainer/5.jpg', '10600', '11794', NULL, 'Гейнеры'),
(22, 'SAN Mass Effect Revolution', 'Gainer/6.jpg', NULL, '6667', NULL, 'Гейнеры'),
(23, 'Muscle Juice Revolution 2600 от Ultimate Nutrition', 'Gainer/7.jpg', NULL, '8495', NULL, 'Гейнеры'),
(24, 'Гейнер BSN True-Mass', 'Gainer/8.jpg', NULL, '8492', NULL, 'Гейнеры'),
(25, 'Жиросжигатель JNX Sport The Ripper', 'fatburner/1.jpg', NULL, '2272', NULL, 'Жиросжигатели'),
(26, 'Nutrex Lipo 6 Black US', 'fatburner/2.png', '2250', '2395', NULL, 'Жиросжигатели'),
(27, 'Nutrex Lipo-6 Black Hers Ultra Concentrate US', 'fatburner/3.jpg', NULL, '1892', NULL, 'Жиросжигатели'),
(28, 'Жиросжигатель Scitec Nutrition Thermo-X', 'fatburner/4.jpg', NULL, '975', NULL, 'Жиросжигатели'),
(29, 'Карнитин FIT-Rx NRG Xtreme', 'fatburner/5.jpg', NULL, '1995', NULL, 'Жиросжигатели'),
(30, 'Жиросжигатель QNT Burner', 'fatburner/6.jpg', '1800', '2073', NULL, 'Жиросжигатели'),
(31, 'Карнитин GEON L-Carnitine 7500', 'fatburner/7.jpg', NULL, '853 ', NULL, 'Жиросжигатели'),
(32, 'Карнитин BombBar L-Carnitine 3500 Shot', 'fatburner/8.jpg', NULL, '60 ', NULL, 'Жиросжигатели'),
(33, 'QNT Burner', 'termogenics/1.jpg', NULL, '2073', NULL, 'Термогеники'),
(34, 'FIT-Rx NRG Xtreme', 'termogenics/2.jpg', NULL, '2395', NULL, 'Термогеники'),
(35, 'Mutant Stimutant', 'termogenics/3.jpg', NULL, '5690', NULL, 'Термогеники'),
(36, 'MuscleTech Hydroxycut Hardcore Elite Performance Series', 'termogenics/4.jpg', NULL, '1603', NULL, 'Термогеники'),
(37, 'Animal Cuts', 'termogenics/5.jpg', '3013', '3195', NULL, 'Термогеники'),
(38, 'FIT-Rx NRG Xtreme', 'termogenics/6.jpg', NULL, '990', NULL, 'Термогеники'),
(39, 'Vplab LipoJets', 'termogenics/7.jpg', NULL, '1372', NULL, 'Термогеники'),
(40, 'MuscleTech Hydroxycut Hardcore Elite Performance Series', 'termogenics/8.jpg', NULL, '1389', NULL, 'Термогеники'),
(42, 'Кофеин Maxler Caffeine 200', 'cafeine/2.jpg', NULL, '593', NULL, 'Кафеин'),
(43, 'Кофеин Scitec Nutrition Caffeine', 'cafeine/3.jpg', NULL, '432 ', NULL, 'Кафеин'),
(44, 'Wow Energy Zero Sugar Energy drink', 'cafeine/4.jpg', NULL, '110 ', NULL, 'Кафеин'),
(45, 'Essential Amino Energy от Optimum Nutrition', 'cafeine/5.jpg', NULL, '1895', NULL, 'Кафеин'),
(46, 'Essential Amino Energy от Optimum Nutrition', 'cafeine/6.jpg', NULL, '1895', NULL, 'Кафеин'),
(47, 'Essential Amino Energy от Optimum Nutrition', 'cafeine/7.jpg', '1800', '1895', NULL, 'Кафеин'),
(48, 'Essential Amino Energy от Optimum Nutrition', 'cafeine/8.jpg', NULL, '1895', NULL, 'Кафеин'),
(49, 'Beta Alanine от Scitec Nutrition', 'Beta-alanine/1.jpg', NULL, '1154', NULL, 'Бета-аланин'),
(50, 'Be First Beta Alanine', 'Beta-alanine/2.jpg', NULL, '876', NULL, 'Бета-аланин'),
(51, 'Предтренировочный комплекс Vplab Nitric Ingnition', 'Beta-alanine/3.jpg', NULL, '694', NULL, 'Бета-аланин'),
(52, 'BioTech USA Beta-Alalnine 4000 мг 90 капс', 'Beta-alanine/4.jpg', NULL, '892 ', NULL, 'Бета-аланин'),
(53, 'Beta Alanine от Scitec Nutrition', 'Beta-alanine/5.jpg', NULL, '1632', NULL, 'Бета-аланин'),
(54, 'VP laboratory Beta-Alanine 90 капс', 'Beta-alanine/6.jpg', NULL, '737', NULL, 'Бета-аланин'),
(55, 'BioTech USA Beta Alanine 120 капс', 'Beta-alanine/7.jpg', NULL, '614', NULL, 'Бета-аланин'),
(56, 'Olimp Beta-Alanine Xplode 420 г', 'Beta-alanine/8.jpg', NULL, '1994', NULL, 'Бета-аланин'),
(57, 'BCAA 12000 Powder от Ultimate Nutrition', 'sales/1.jpg', '1222', '1346', NULL, 'Аминокислоты'),
(68, 'Аминокислоты Maxler Amino Magic Fuel', 'sales/12.jpg', '1453', '1573', NULL, 'Аминокислоты');

-- --------------------------------------------------------

--
-- Структура таблицы `Users`
--

CREATE TABLE `Users` (
  `id` int NOT NULL,
  `role` int NOT NULL DEFAULT '0',
  `Email` text COLLATE utf8mb4_general_ci NOT NULL,
  `Phone` varchar(15) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `Password` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Дамп данных таблицы `Users`
--

INSERT INTO `Users` (`id`, `role`, `Email`, `Phone`, `Name`, `Password`) VALUES
(15, 1, 'g@g.gh', '+79501197803', 'g', '$2y$10$JYZNz9ZM6xSc/SrBPAUyJOwVmsCWVpeSpoIDxMVEsyXXaEw0hSJQe'),
(16, 0, 'g@g.gb', NULL, 'g', '$2y$10$vUZtAelyxyWCn6mdv432ueup3Pk2Jq4X9fE7YlWsgrmxqj04wmAFu');

--
-- Индексы сохранённых таблиц
--

--
-- Индексы таблицы `Feedback`
--
ALTER TABLE `Feedback`
  ADD PRIMARY KEY (`id`);

--
-- Индексы таблицы `Offers`
--
ALTER TABLE `Offers`
  ADD PRIMARY KEY (`Offer_id`),
  ADD KEY `Product_id` (`Product_id`),
  ADD KEY `User_id` (`User_id`);

--
-- Индексы таблицы `Products`
--
ALTER TABLE `Products`
  ADD PRIMARY KEY (`id`);

--
-- Индексы таблицы `Users`
--
ALTER TABLE `Users`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT для сохранённых таблиц
--

--
-- AUTO_INCREMENT для таблицы `Feedback`
--
ALTER TABLE `Feedback`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT для таблицы `Offers`
--
ALTER TABLE `Offers`
  MODIFY `Offer_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT для таблицы `Products`
--
ALTER TABLE `Products`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=81;

--
-- AUTO_INCREMENT для таблицы `Users`
--
ALTER TABLE `Users`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- Ограничения внешнего ключа сохраненных таблиц
--

--
-- Ограничения внешнего ключа таблицы `Offers`
--
ALTER TABLE `Offers`
  ADD CONSTRAINT `offers_ibfk_1` FOREIGN KEY (`Product_id`) REFERENCES `Products` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `offers_ibfk_2` FOREIGN KEY (`User_id`) REFERENCES `Users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
