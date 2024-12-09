-- For store manager
CREATE OR REPLACE PROCEDURE move_trainer_branch(
	OriginBranchID INT,
	DestBranchID INT,
	Trainer_ID INT
) LANGUAGE plpgsql
AS $$
BEGIN 
	IF NOT EXISTS ( SELECT 1 FROM trainer WHERE TrainerID = Trainer_ID) THEN
		RAISE EXCEPTION 'Trainer with id=% is not found!', Trainer_ID;
	ELSEIF EXISTS ( SELECT 1 FROM class WHERE TrainerID = Trainer_ID ) THEN
		RAISE EXCEPTION 'This trainer is holding a class at the current branch, this class should be removed first!0';
	ELSEIF NOT EXISTS ( SELECT 1 FROM gymbranch WHERE GymBranchID = OriginBranchID ) THEN
		RAISE EXCEPTION 'Gym branch with id=% not found!', OriginBranchID;
	ELSEIF NOT EXISTS ( SELECT 1 FROM gymbranch WHERE GymBranchID = DestBranchID ) THEN
		RAISE EXCEPTION 'Gym branch with id=% not found!', DestBranchID;
	END IF;
	
	UPDATE trainer
	SET Workplace = DestBranchID
	WHERE Workplace = OriginBranchID AND TrainerID = Trainer_ID;
END;
$$;


CREATE OR REPLACE PROCEDURE add_new_class(
	ProgramID_ INT,
	ProgramName_ VARCHAR(50),
	Status_ VARCHAR(20),
	Price_ NUMERIC(10, 2),
	PeriodNum_ INT,
	GymBranchID_ INT,
	Floor_ INT,
	AreaName_ VARCHAR(50),
	TrainerID_ INT
) LANGUAGE plpgsql
AS $$
BEGIN 
	-- init superclass entity MEMBERSHIP
	INSERT INTO membership(ProgramID, ProgramName, Price, Status)
	VALUES (ProgramID_, ProgramName_, Price_, Status_);

	INSERT INTO class(ProgramID, PeriodNum, GymBranchID, Floor, Area, TrainerID)
	VALUES (ProgramID_, PeriodNum_, GymBranchID_, Floor_, AreaName_, TrainerID_);
END;
$$;


CREATE OR REPLACE PROCEDURE add_new_basic_program(
	ProgramID_ INT,
	ProgramName_ VARCHAR(50),
	Status_ VARCHAR(20),
	Price_ NUMERIC(10, 2),
	Duration_ INTERVAL
) LANGUAGE plpgsql
AS $$
BEGIN
	INSERT INTO membership(ProgramID, ProgramName, Price, Status)
	VALUES (ProgramID_, ProgramName_, Price_, Status_);

	INSERT INTO basic(ProgramID, Duration)
	VALUES (ProgramID_, Duration_);
END;
$$;


CREATE OR REPLACE PROCEDURE add_new_branch_area(
	GymBranchID_ INT,
	Address_ VARCHAR(255),
	Area_name VARCHAR(50) DEFAULT 'Gym',
	Floor INT DEFAULT 1
) LANGUAGE plpgsql
AS $$
BEGIN
	
	IF NOT EXISTS (SELECT 1 FROM gymbranch WHERE GymBranchID = GymBranchID_) THEN
		INSERT INTO gymbranch(GymBranchID, Address) VALUES (GymBranchID_, Address_);
	END IF;
	
	INSERT INTO AREA(GymBranchID, Name, Floor) VALUES (GymBranchID_, Area_name, Floor);
END;
$$;


CREATE OR REPLACE PROCEDURE add_new_trainer_to_branch(
	SSN_ CHAR(12),
	Specialization_ VARCHAR(50),
	EmploymentType_ VARCHAR(20),
	GymBranchID_ INT,
	Address_ VARCHAR(255)		
) LANGUAGE plpgsql
AS $$ 
DECLARE
	newTrainerID INT;
BEGIN
	-- if branch not existed, then add new branch
	IF NOT EXISTS ( SELECT 1 FROM gymbranch WHERE GymBranchID = GymBranchID_ ) THEN
		CALL add_new_branch(GymBranchID_, Address_);
	END IF;

	-- insert new trainer
	INSERT INTO trainer(SSN, Specialization, EmploymentType, Workplace)
	VALUES(SSN_, Specialization_, EmploymentType_, GymBranchID_);

	-- check total participation of both GYMBRANCH and TRAINER
	IF NOT EXISTS (SELECT 1 FROM trainer WHERE Workplace = GymBranchID_) THEN
        RAISE EXCEPTION 'Gymbranch must have at least one trainer!';
    END IF;
END;
$$;



-- for user 
CREATE OR REPLACE FUNCTION view_profile_ssn(sr_ssn CHAR(12))
RETURNS TABLE(
	SSN CHAR(12), 
	FName VARCHAR(50), 
	LName VARCHAR(50), 
	PhoneNum VARCHAR(12), 
	DoB DATE, 
	MemberID INT, 
	MemberJoinDate DATE, 
	PTName VARCHAR(50)
) AS $$
BEGIN
	RETURN QUERY
	SELECT 
	    u.SSN,
	    u.FName AS UserFName,
	    u.LName AS UserLName,
	    u.PhoneNum,
	    u.DoB,
	    m.MemberID,
	    m.JoinDate,
	    COALESCE(t.FName, 'No Trainer') AS TrainerFName
	FROM 
	    USERS u
	LEFT JOIN 
	    MEMBER m ON u.SSN = m.SSN
	LEFT JOIN (SELECT * FROM trainer INNER JOIN users USING(ssn)) AS t ON m.TrainerID = t.TrainerID
	WHERE u.SSN = sr_ssn;
END;
$$ LANGUAGE plpgsql;


CREATE OR REPLACE FUNCTION view_profile_memberid(sr_id INT)
RETURNS TABLE(
	SSN CHAR(12), 
	FName VARCHAR(50), 
	LName VARCHAR(50), 
	PhoneNum VARCHAR(12), 
	DoB DATE, 
	MemberID INT, 
	MemberJoinDate DATE, 
	PTName VARCHAR(50)
) AS $$
DECLARE
	sr_ssn INT;
BEGIN
	SELECT ssn INTO sr_ssn
	FROM member
	WHERE member(MemberID) = sr_id;

	RETURN QUERY
		SELECT * FROM view_profile_ssn(sr_ssn);
END;
$$ LANGUAGE plpgsql;


CREATE OR REPLACE PROCEDURE register_member(
	SSN_ CHAR(12),
    ProgramID_ INT,
    Number_ INT, 
    StartDate_ DATE,
    EndDate_ DATE,
	Method_ VARCHAR(50),
	PurchaseDate_ DATE,
    Amount_ INT
) LANGUAGE plpgsql
AS $$
BEGIN
	-- record the register
	INSERT INTO register(SSN, ProgramID, StartDate, EndDate, Method, PurchaseDate, Amount) 
	VALUES (SSN_, ProgramID_, StartDate_, EndDate_, Method_, PurchaseDate_, Amount_);

	-- if users is not yet a member, then register them as MEMBER
	IF NOT EXISTS (SELECT * FROM member WHERE SSN = SSN_) THEN
		INSERT INTO MEMBER(SSN, JoinDate, TrainerID) 
		VALUES (SSN_, PurchaseDate_, NULL);
	END IF;
END;
$$;