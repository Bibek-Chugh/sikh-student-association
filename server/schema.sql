CREATE DATABASE sikh_student_association;
USE sikh_student_association;

CREATE TABLE IF NOT EXISTS mentors (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  university VARCHAR(255),
  program VARCHAR(255),
  graduation_year INT CHECK (graduation_year BETWEEN 1900 AND 2100),
  location VARCHAR(255),
  gender VARCHAR(50),
  religion VARCHAR(50),
  bio TEXT,
  photo_url VARCHAR(255),
  job_title VARCHAR(255),
  employer VARCHAR(255),
  area_professional_focus VARCHAR(255),
  area_sikhi_focus VARCHAR(255),
  undergraduate VARCHAR(255),
  post_graduate VARCHAR(255),
  favourite_kirtani VARCHAR(255),
  favourite_show VARCHAR(255),
  favourite_food VARCHAR(255),
  favourite_hobby VARCHAR(255)
);
CREATE TABLE IF NOT EXISTS admins (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL
);
