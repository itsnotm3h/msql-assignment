INSERT INTO students (student_id, first_name, last_name, start_date, programme_id)
VALUES 
    ('S1001', 'John', 'Doe', '2022-09-01', 'P001'),
    ('S1002', 'Jane', 'Smith', '2022-09-01', 'P001'),
    ('S1003', 'Emily', 'Johnson', '2022-09-01', 'P002'),
    ('S1004', 'Michael', 'Brown', '2023-01-15', 'P002'),
    ('S1005', 'Sarah', 'Davis', '2023-01-15', 'P003');

INSERT INTO programmes (programme_id, programme_name, duration_years)
VALUES 
    ('P001', 'Computer Science', 4),
    ('P002', 'Business Administration', 3),
    ('P003', 'Mechanical Engineering', 4);

INSERT INTO lecturers (lecturer_id, first_name, last_name, contact_email)
VALUES 
    ('L001', 'Hiroshi', 'Yamamoto', 'hiroshi.yamamoto@university.edu'),
    ('L002', 'Mei', 'Chen', 'mei.chen@university.edu'),
    ('L003', 'Raj', 'Patel', 'raj.patel@university.edu');

INSERT INTO modules (module_id, module_name, programme_id, lecturer_id)
VALUES 
    ('M001', 'Introduction to Programming', 'P001', 'L001'),
    ('M002', 'Data Structures', 'P001', 'L001'),
    ('M003', 'Marketing Principles', 'P002', 'L002'),
    ('M004', 'Corporate Finance', 'P002', 'L003'),
    ('M005', 'Thermodynamics', 'P003', 'L002');

INSERT INTO venue (venue_id, venue_name,capacity)
VALUES 
    (1, 'Room A101',20),
    (2, 'Room B203',24),
    (3, 'Lab C301',10);


INSERT INTO lesson_days (lesson_id, module_id, date, start_time, end_time, lecturer_id, venue_id)
VALUES 
    ('L001', 'M001', '2024-01-15', '09:00:00', '10:30:00', 'L001', 1),
    ('L002', 'M001', '2024-01-17', '09:00:00', '10:30:00', 'L001', 1),
    ('L003', 'M002', '2024-01-15', '11:00:00', '12:30:00', 'L001', 1),
    ('L004', 'M003', '2024-01-15', '13:00:00', '14:30:00', 'L002', 2),
    ('L005', 'M004', '2024-01-16', '09:00:00', '10:30:00', 'L003', 2),
    ('L006', 'M005', '2024-01-17', '11:00:00', '12:30:00', 'L002', 3);

ALTER TABLE lesson_days MODIFY lesson_id VARCHAR(50);

SELECT * FROM students;
SELECT * FROM modules;
SELECT * FROM lecturers;
SELECT * FROM attendance;
SELECT * FROM programmes;
SELECT * FROM venue;
SELECT * FROM lesson_days;


INSERT INTO students (student_id, first_name, last_name, start_date, programme_id)
VALUES 
    ('S1001', 'Wei', 'Zhang', '2022-09-01', 'P001'),
    ('S1002', 'Yuna', 'Kim', '2022-09-01', 'P001'),
    ('S1003', 'Akira', 'Tanaka', '2022-09-01', 'P002'),
    ('S1004', 'Siti', 'Hassan', '2023-01-15', 'P002'),
    ('S1005', 'An', 'Nguyen', '2023-01-15', 'P003');

    INSERT INTO attendance (attendance_id, date_time, student_id, lecturer_id, module_id)
VALUES 
    (1, '2024-01-15 09:05:00', 'S1001', 'L001', 'M001'),
    (2, '2024-01-15 09:06:00', 'S1002', 'L001', 'M001'),
    (3, '2024-01-15 11:10:00', 'S1003', 'L001', 'M002'),
    (4, '2024-01-15 13:05:00', 'S1004', 'L002', 'M003'),
    (5, '2024-01-16 09:02:00', 'S1005', 'L003', 'M004');

ALTER TABLE attendance MODIFY attendance_id INT UNSIGNED auto_increment;


ALTER TABLE attendance CHANGE attendance attendance_id INT UNSIGNED;-- change type and name of column

