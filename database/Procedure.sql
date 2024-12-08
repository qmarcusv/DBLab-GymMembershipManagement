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
	Price_ INT,
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

	-- ProgramID are auto generated 
	INSERT INTO class(ProgramID, PeriodNum, GymBranchID, Floor, Area, TrainerID)
	VALUES (ProgramID_, PeriodNum_, GymBranchID_, Floor_, AreaName_, TrainerID);
END;
$$;


CREATE OR REPLACE PROCEDURE add_new_branch(
	GymBranchID_ INT,
	Address_ VARCHAR(255),
	Area_name VARCHAR(50) DEFAULT 'Gym',
	Floor INT DEFAULT 1
) LANGUAGE plpgsql
AS $$
BEGIN
	INSERT INTO gymbranch(GymBranchID, Address) VALUES (GymBranchID_, Address_);
	INSERT INTO AREA(GymBranchID, Name, Floor) VALUES (GymBranchID_, Area_name, Floor);
END;
$$;


CREATE OR REPLACE PROCEDURE add_new_trainer_to_branch(
	SSN_ INT,
	Specialization_ VARCHAR(50),
	EmploymentType_ VARCHAR(20),
	GymBranchID_ INT,
	Address_ VARCHAR(255)		
) LANGUAGE plpgsql
AS $$ 
DECLARE
	newTrainerID INT;
BEGIN
	-- insert new trainer
	INSERT INTO trainer(SSN, Specialization, EmploymentType)
	VALUES(SSN_, Specialization_, EmploymentType_);

	-- insert new trainer to branch
	SELECT TrainerID INTO newTrainerID
	FROM trainer 
	WHERE Ssn = SSN;
	-- if branch not existed
	IF NOT EXISTS ( SELECT 1 FROM gymbranch WHERE GymBranchID = GymBranch ) THEN
		CALL add_new_branch(GymBranchID_, Address_);
	END IF;

	-- check total participation of both GYMBRANCH and TRAINER
	IF NOT EXISTS (SELECT 1 FROM trainer WHERE Workplace = NEW.GymBranchID) THEN
        RAISE EXCEPTION 'Gymbranch must have at least one trainer!';
    END IF;

	-- ROLLBACK	changes if error occurs
	EXCEPTION
		WHEN OTHERS THEN
		ROLLBACK;
		RAISE;
END;
$$;

