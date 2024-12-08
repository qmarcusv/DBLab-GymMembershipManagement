CREATE TABLE GYMBRANCH (
    GymBranchID INT PRIMARY KEY,
    Address VARCHAR(255) UNIQUE NOT NULL
);

CREATE TABLE USERS (
    SSN CHAR(12) PRIMARY KEY,
    FName VARCHAR(50) NOT NULL,
    LName VARCHAR(50) NOT NULL,	
    PhoneNum VARCHAR(12) UNIQUE NOT NULL,
	Password VARCHAR(255) NOT NULL, -- encrypted
    DoB DATE,
	AccType VARCHAR(10) CHECK (AccType IN ('user', 'member', 'trainer'))
);

-- ALTER TABLE USERS ADD COLUMN acc_type VARCHAR(10) CHECK (acc_type IN ('user', 'member', 'trainer'));
-- ALTER TABLE USERS ALTER COLUMN acc_type SET DEFAULT 'user';

CREATE TABLE TRAINER (
    TrainerID SERIAL PRIMARY KEY,
    SSN CHAR(12) UNIQUE NOT NULL,	-- all TRAINERs must be in USERS
    Specialization VARCHAR(50),
	-- An employee must either work as 'parttime' or 'fulltime' employee
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
-- ALTER TABLE BASIC ADD COLUMN tier CHECK (tier in ('silver', 'gold', 'diamond'))

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
    GymBranchID INT,
    Floor INT,
    Area VARCHAR(50),
    TrainerID SERIAL NOT NULL,  -- Class must have trainer
    PRIMARY KEY (ProgramID),
    FOREIGN KEY (ProgramID) REFERENCES MEMBERSHIP(ProgramID),
    FOREIGN KEY (GymBranchID,Floor, Area) REFERENCES AREA(GymBranchID,Floor, Name),
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
    Number SERIAL UNIQUE NOT NULL, -- Auto increasing number represent invoice number
    StartDate DATE NOT NULL,
    EndDate DATE NOT NULL,
    PRIMARY KEY (SSN, ProgramID),
    FOREIGN KEY (SSN) REFERENCES USERS(SSN),
    FOREIGN KEY (ProgramID) REFERENCES MEMBERSHIP(ProgramID),
    Method VARCHAR(50) CHECK (Method IN ('cash', 'ebanking', 'credit')),
    PurchaseDate DATE NOT NULL,
    Amount INT NOT NULL
);