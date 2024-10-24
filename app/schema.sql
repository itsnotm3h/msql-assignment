CREATE DATABASE academy_itm;

USE academy_itm;

-- Create students table first
CREATE TABLE students(
    student_id VARCHAR(50) primary key,
    first_name varchar(100) not null,
    last_name varchar(100) not null,
    start_date date not null
) engine = innodb;

CREATE TABLE programmes(
    programme_id VARCHAR(50) primary key,
    programme_name varchar(200) not null,
    duration_days int UNSIGNED not null
) engine = innodb;

--1. Adding Foreign Key to for students.
alter table students add column programme_id VARCHAR(50);
ALTER TABLE students ADD CONSTRAINT fk_students_programme FOREIGN KEY (programme_id) REFERENCES programmes(programme_id);


-- Create Lecturers and Modules Table
CREATE TABLE lecturers(
    lecturer_id VARCHAR(50) primary key,
    first_name varchar(100) not null,
    last_name varchar(100) not null,
    contact_email VARCHAR(255) not null
) engine = innodb;

CREATE TABLE modules(
    module_id VARCHAR(50) primary key,
    module_name VARCHAR(255) NOT NULL
) engine = innodb;

--2. Adding Foreign Key to for modules.
alter table modules add column lecturer_id VARCHAR(50);
ALTER TABLE modules ADD CONSTRAINT fk_modules_lecturers FOREIGN KEY (lecturer_id) REFERENCES lecturers(lecturer_id);

-- Create attendance
CREATE TABLE attendance(
    attendance VARCHAR(50) primary key,
    date_time DATETIME not null
)engine = innodb;

alter table attendance add column student_id VARCHAR(50)not null;
alter table attendance add column module_id VARCHAR(50) not null;
alter table attendance add column lecturer_id VARCHAR(50)not null;

ALTER TABLE attendance ADD CONSTRAINT fk_attendance_students FOREIGN KEY (student_id) REFERENCES students(student_id);

ALTER TABLE attendance ADD CONSTRAINT fk_attendance_modules FOREIGN KEY (module_id) REFERENCES modules(module_id);

ALTER TABLE attendance ADD CONSTRAINT fk_attendance_lecturers FOREIGN KEY (lecturer_id) REFERENCES lecturers(lecturer_id);

-- Create lessons_days + venue
CREATE TABLE venue(
    venue_id INT UNSIGNED primary key,
    venue_name VARCHAR(50) not null,
    capacity INT UNSIGNED not null
)engine = innodb;

CREATE TABLE lesson_days(
    lesson_id INT UNSIGNED primary key,
    date DATE not null,
    start_time TIME not null,
    end_time TIME not null
)engine = innodb;


alter table lesson_days add column venue_id INT UNSIGNED not null;
alter table lesson_days add column module_id VARCHAR(50) not null;
alter table lesson_days add column lecturer_id VARCHAR(50) not null;

ALTER TABLE lesson_days ADD CONSTRAINT fk_lesson_days_modules FOREIGN KEY (module_id) REFERENCES modules(module_id);

ALTER TABLE lesson_days ADD CONSTRAINT fk_lesson_days_lecturers FOREIGN KEY (lecturer_id) REFERENCES lecturers(lecturer_id);


ALTER TABLE lesson_days ADD CONSTRAINT fk_lesson_days_venue FOREIGN KEY (venue_id) REFERENCES venue(venue_id);

describe students;
describe modules;
describe lecturers;
describe attendance;
describe programmes;
describe venue;
describe lesson_days;
