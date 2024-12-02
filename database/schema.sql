CREATE TABLE USERS (
    SSN CHAR(12) PRIMARY KEY,       -- SSN is the primary key
    FName VARCHAR(50),              -- First Name
    LName VARCHAR(50),              -- Last Name
    PhoneNum VARCHAR(15),           -- Phone number is unique
    Password VARCHAR(255),          -- Password has encrypted
    DoB DATE                        -- Date of Birth
);
