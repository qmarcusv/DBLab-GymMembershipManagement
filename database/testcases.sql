----- test case 1: total participations of GYMBRANCH -----

-- valid input
INSERT INTO USERS (SSN, FName, LName, PhoneNum, Password, DoB) 
VALUES 
('123456789012', 'John', 'Doe', '123-456-7890', 'encryptedpassword1', '1980-01-01'),
('234567890123', 'Jane', 'Smith', '234-567-8901', 'encryptedpassword2', '1990-05-15');
INSERT INTO USERS (SSN, FName, LName, PhoneNum, Password, DoB) 
VALUES 
('985697454518', 'Takanashi', 'Hoshino', '852-741-9632', 'encryptedpassword1', '2001-01-02'),
('985697454514', 'Sorasaki', 'Hina', '789-987-4561', 'encryptedpassword2', '2001-02-19');


INSERT INTO GYMBRANCH (GymBranchID, Address) 
VALUES 
(1, '123 Main St, New York');

INSERT INTO TRAINER (TrainerID, SSN, Specialization, EmploymentType, Workplace) 
VALUES 
(1, '123456789012', 'Yoga', 'parttime', 1),
(2, '234567890123', 'Personal Training', 'fulltime', 1),
(3, '985697454518', 'Cardio', 'fulltime', 1);
INSERT INTO TRAINER (SSN, Specialization, EmploymentType, Workplace) -- Test SERIAL type
VALUES 
('985697454514', 'Body buiding', 'fulltime', 1);

INSERT INTO AREA (GymBranchID, Floor, Name) 
VALUES 
(1, 1, 'Cardio Zone'), 
(1, 2, 'Weight Room'), 
(2, 1, 'Yoga Studio');


-- error inserts
INSERT INTO TRAINER (SSN, Specialization, EmploymentType, Workplace) 
VALUES 
('987654321012', 'CrossFit', 'fulltime', 1); -- SSN '987654321012' does not exist in USERS

INSERT INTO TRAINER (SSN, Specialization, EmploymentType, Workplace) 
VALUES 
('234567890123', 'Personal Training', 'intern', 1);  -- EmploymentType must be 'parttime' or 'fulltime'

INSERT INTO GYMBRANCH (GymBranchID, Address) 
VALUES 
(3, '123 Main St, New York');  -- Address already exists

INSERT INTO AREA (GymBranchID, Floor, Name) 
VALUES 
(3, 1, 'Pilates Studio');  -- GymBranchID '3' does not exist in GYMBRANCH







