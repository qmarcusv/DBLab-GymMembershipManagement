CREATE TABLE GYMBRANCH (
    GymBranchID INT PRIMARY KEY,	-- INT for flexible branch numbering
    Address VARCHAR(255) UNIQUE NOT NULL
);

CREATE TABLE USERS (
    SSN CHAR(12) PRIMARY KEY,
    FName VARCHAR(50) NOT NULL,
    LName VARCHAR(50) NOT NULL,
    PhoneNum VARCHAR(12) UNIQUE NOT NULL,
	Password VARCHAR(255) NOT NULL, -- encrypted
    DoB DATE
);
-- Add the `role` column if it does not exist
ALTER TABLE USERS
ADD COLUMN IF NOT EXISTS role VARCHAR(20) DEFAULT 'member';

-- Make sure any existing records without a role have 'member' as default
UPDATE USERS
SET role = 'member'
WHERE role IS NULL;

CREATE TABLE TRAINER (
    TrainerID SERIAL PRIMARY KEY,
    SSN CHAR(12) UNIQUE NOT NULL,	-- all TRAINERs must be in USERS
    Specialization VARCHAR(50),
	-- An trainer must either work as 'parttime' or 'fulltime' trainer
    EmploymentType VARCHAR(20) NOT NULL CHECK(EmploymentType IN ('parttime','fulltime')),
    Workplace INT NOT NULL,			-- every trainer must work at a specific GYMBRANCH
    FOREIGN KEY (SSN) REFERENCES USERS(SSN),
    FOREIGN KEY (Workplace) REFERENCES GYMBRANCH(GymBranchID)
);

CREATE TABLE MEMBER (
    MemberID SERIAL PRIMARY KEY,
    SSN CHAR(12) UNIQUE NOT NULL,	-- all MEMBERs must be in USERS
    JoinDate DATE NOT NULL,
    TrainerID SERIAL,				-- not every MEMBER associated with a TRAINER
    FOREIGN KEY (SSN) REFERENCES USERS(SSN),
    FOREIGN KEY (TrainerID) REFERENCES TRAINER(TrainerID)
);

CREATE TABLE AREA (
    GymBranchID SERIAL,
    Floor INT,
    Name VARCHAR(50),
    PRIMARY KEY (GymBranchID, Floor, Name),
    FOREIGN KEY (GymBranchID) REFERENCES GYMBRANCH(GymBranchID)
);

CREATE TABLE MEMBERSHIP (
    ProgramID SERIAL PRIMARY KEY,
    ProgramName VARCHAR(100) NOT NULL,
    Price NUMERIC(10, 2) NOT NULL,
    Status VARCHAR(20) NOT NULL
);

CREATE TABLE BASIC (
    ProgramID INT PRIMARY KEY,
    Duration INTERVAL NOT NULL,
    FOREIGN KEY (ProgramID) REFERENCES MEMBERSHIP(ProgramID)
);

CREATE TABLE GYMSTORE (
    GymstoreID SERIAL PRIMARY KEY,
    Name VARCHAR(100) NOT NULL,
    DiscountAmount NUMERIC(5, 2) CHECK (DiscountAmount < 100),
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
    FOREIGN KEY (GymBranchID,Floor, Area) REFERENCES AREA(GymBranchID,Floor, Name),
    FOREIGN KEY (TrainerID) REFERENCES TRAINER(TrainerID)
);

CREATE TABLE CLASS_SHED (
	ProgramID INT,
	DayOfWeek VARCHAR(10) CHECK (DayOfWeek IN ('Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun')),
	TimeOfDay TIME,
	SessionDuration INTERVAL
);

CREATE TABLE REGISTER (
    MemberID INT,
    ProgramID INT,
    Number SERIAL UNIQUE NOT NULL, -- Auto increasing number represent invoice number
    StartDate DATE NOT NULL,
    EndDate DATE NOT NULL,
    PRIMARY KEY (MemberID, ProgramID),
    FOREIGN KEY (MemberID) REFERENCES MEMBER(MemberID),
    FOREIGN KEY (ProgramID) REFERENCES MEMBERSHIP(ProgramID),
    Method VARCHAR(50) CHECK (Method IN ('cash', 'ebanking', 'credit')),
    Date DATE NOT NULL,
    Amount INT NOT NULL
);