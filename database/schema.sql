-- Drop existing tables if they exist
DROP TABLE IF EXISTS REGISTER;
DROP TABLE IF EXISTS CLASS_SCHED;
DROP TABLE IF EXISTS CLASS;
DROP TABLE IF EXISTS GYMSTORE;
DROP TABLE IF EXISTS BASIC;
DROP TABLE IF EXISTS MEMBERSHIP;
DROP TABLE IF EXISTS AREA;
DROP TABLE IF EXISTS MEMBER;
DROP TABLE IF EXISTS TRAINER;
DROP TABLE IF EXISTS USERS;
DROP TABLE IF EXISTS GYMBRANCH;

-- Create tables as per your provided structure
CREATE TABLE GYMBRANCH (
    GymBranchID INT PRIMARY KEY,  -- INT for flexible branch numbering
    Address VARCHAR(255) UNIQUE NOT NULL
);

CREATE TABLE USERS (
    SSN CHAR(12) PRIMARY KEY,
    FName VARCHAR(50) NOT NULL,
    LName VARCHAR(50) NOT NULL,
    PhoneNum VARCHAR(12) UNIQUE NOT NULL,
    Password VARCHAR(255) NOT NULL,  -- encrypted
    DoB DATE
);

CREATE TABLE TRAINER (
    TrainerID SERIAL PRIMARY KEY,
    SSN CHAR(12),  -- all TRAINERs must be in USERS
    Specialization VARCHAR(50) CHECK (Specialization IN ('Gym', 'Pilate', 'Calisthenic', 'Kickboxing', 'Boxing', 'Yoga', 'Meditate')) DEFAULT 'Gym',  -- Specialization of a trainer, default is 'Gym'
    EmploymentType VARCHAR(20) NOT NULL CHECK(EmploymentType IN ('parttime','fulltime')) DEFAULT 'parttime',  -- An trainer must either work as 'parttime' or 'fulltime' trainer
    Workplace INT NOT NULL DEFAULT 1,  -- every trainer must work at a specific GYMBRANCH
    FOREIGN KEY (SSN) REFERENCES USERS(SSN),
    FOREIGN KEY (Workplace) REFERENCES GYMBRANCH(GymBranchID)
);

-- Trigger Function to adjust TrainerID after deletion
CREATE OR REPLACE FUNCTION adjust_trainer_ids()
RETURNS TRIGGER AS $$
BEGIN
  -- Decrease the TrainerID for all trainers with ID greater than the deleted trainer
  UPDATE trainer
  SET TrainerID = TrainerID - 1
  WHERE TrainerID > OLD.TrainerID;

  RETURN OLD;  -- Return OLD to confirm the delete operation
END;
$$ LANGUAGE plpgsql;

-- Trigger to call the function after deletion
CREATE TRIGGER after_trainer_delete
AFTER DELETE ON trainer
FOR EACH ROW
EXECUTE FUNCTION adjust_trainer_ids();


CREATE TABLE AREA (
    GymBranchID SERIAL,
    Floor INT,
    Name VARCHAR(50),
    PRIMARY KEY (GymBranchID, Floor, Name),
    FOREIGN KEY (GymBranchID) REFERENCES GYMBRANCH(GymBranchID)
);
CREATE TABLE MEMBER (
    MemberID SERIAL PRIMARY KEY,
    SSN CHAR(12),  -- all MEMBERs must be in USERS
    JoinDate DATE DEFAULT CURRENT_DATE,
    TrainerID INT,  -- not every MEMBER associated with a TRAINER
    FOREIGN KEY (SSN) REFERENCES USERS(SSN),
    FOREIGN KEY (TrainerID) REFERENCES TRAINER(TrainerID)
);

CREATE TABLE MEMBERSHIP (
    ProgramID SERIAL PRIMARY KEY,
    ProgramName VARCHAR(100) NOT NULL,
    Price INT NOT NULL,
    Status VARCHAR(20) NOT NULL
);

CREATE TABLE BASIC (
    ProgramID INT PRIMARY KEY,
    Duration INTERVAL NOT NULL DEFAULT '1 month',
    FOREIGN KEY (ProgramID) REFERENCES MEMBERSHIP(ProgramID)
);

CREATE TABLE GYMSTORE (
    GymstoreID SERIAL PRIMARY KEY,
    Name VARCHAR(100) NOT NULL,
    DiscountAmount INT CHECK (DiscountAmount < 100),
    ProgramID INT,
    FOREIGN KEY (ProgramID) REFERENCES BASIC(ProgramID)
);

CREATE TABLE CLASS (
    ProgramID INT,
    PeriodNum INT,
    SessionDuration INTERVAL,
    GymBranchID INT,
    Floor INT,
    Area VARCHAR(50),
    TrainerID INT NOT NULL,
    PRIMARY KEY (ProgramID),
    FOREIGN KEY (ProgramID) REFERENCES MEMBERSHIP(ProgramID),
    FOREIGN KEY (GymBranchID, Floor, Area) REFERENCES AREA(GymBranchID, Floor, Name),
    FOREIGN KEY (TrainerID) REFERENCES TRAINER(TrainerID)
);

CREATE TABLE CLASS_SCHED (
    ProgramID INT,
    DayOfWeek VARCHAR(10) CHECK (DayOfWeek IN ('Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun')),
    TimeOfDay TIME,
    SessionDuration INTERVAL
);

CREATE TABLE REGISTER (
    SSN CHAR(12),
    ProgramID INT,
    Number SERIAL UNIQUE NOT NULL,  -- Auto increasing number represents invoice number
    StartDate DATE NOT NULL,
    EndDate DATE NOT NULL,
    PRIMARY KEY (SSN, ProgramID),
    FOREIGN KEY (SSN) REFERENCES USERS(SSN),
    FOREIGN KEY (ProgramID) REFERENCES MEMBERSHIP(ProgramID),
    Method VARCHAR(50) CHECK (Method IN ('cash', 'ebanking', 'credit')) DEFAULT 'ebanking',
    PurchaseDate DATE NOT NULL DEFAULT CURRENT_DATE,
    Amount INT NOT NULL
);

-- Insert data into GYMBRANCH
INSERT INTO GYMBRANCH (GymBranchID, Address) VALUES
(1, '600 Dien Bien Phu, HCMC'),
(2, '280 Ly Thuong Kiet, HCMC'),
(3, '123 Nguyen Van Linh, HCMC'),
(4, '456 Le Van Luong, HCMC'),
(5, '789 Nguyen Van Cu, HCMC');
-- Insert data into AREA
INSERT INTO AREA (GymBranchID, Floor, Name) VALUES
(1, 1, 'Cardio Zone'),
(1, 2, 'Weightlifting Area'),
(2, 1, 'Yoga Studio');

-- Insert data into MEMBERSHIP
INSERT INTO MEMBERSHIP (ProgramID, ProgramName, Price, Status) VALUES
(1, 'Basic Gym 1 month', 50000, 'Active'),
(2, 'Advanced Yoga', 70000, 'Active'),
(3, 'Premium Pilate', 90000, 'Active'),
(4, 'Kickboxing', 75000, 'Active'),
(5, 'Boxing', 60000, 'Active'),
(6, 'Meditation', 40000, 'Active'),
(7, 'Calisthenic', 95000, 'Active');

-- Insert data into BASIC
INSERT INTO BASIC (ProgramID, Duration) VALUES
(1, '1 month');

-- Insert data into GYMSTORE
INSERT INTO GYMSTORE (GymstoreID, Name, DiscountAmount, ProgramID) VALUES
(1, 'Gym Wear Shop', 5, 1);

-- Insert data into CLASS
-- INSERT INTO CLASS (ProgramID, PeriodNum, SessionDuration, GymBranchID, Floor, Area, TrainerID) VALUES
-- (1, 1, '1 hour', 1, 1, 'Cardio Zone', 1),
-- (2, 1, '1.5 hours', 2, 1, 'Yoga Studio', 1);

-- Insert data into CLASS_SCHED
INSERT INTO CLASS_SCHED (ProgramID, DayOfWeek, TimeOfDay, SessionDuration) VALUES
(1, 'Mon', '09:00:00', '1 hour'),
(2, 'Wed', '18:00:00', '1.5 hours');
