CREATE DATABASE sikh_student_association;
USE sikh_student_association;

CREATE TABLE IF NOT EXISTS mentors (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  university VARCHAR(255),
  program VARCHAR(255),
  graduation_year INT,
  location VARCHAR(255),
  gender VARCHAR(50),
  religion VARCHAR(50),
  bio TEXT,
  photo_url VARCHAR(255)
);
