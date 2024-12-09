-- enforce total participation of GYMBRANCH (all gym branch must have trainer)
CREATE OR REPLACE FUNCTION check_gymbranch_has_trainer() 
RETURNS TRIGGER AS $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM trainer WHERE Workplace = NEW.GymBranchID) THEN
        RAISE EXCEPTION 'Gymbranch must have at least one trainer!';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER enforce_gymbranch_has_trainer
AFTER DELETE OR UPDATE ON gymbranch
FOR EACH ROW
EXECUTE FUNCTION check_gymbranch_has_trainer();


-- enfore total participation of GYMBRANCH (all gymbranch must have at least one area)
CREATE OR REPLACE FUNCTION check_gymbranch_has_area()
RETURNS TRIGGER AS $$
BEGIN
	IF NOT EXISTS (SELECT 1 FROM area WHERE GymbranchID = NEW.GymbranchID)
	THEN 
		RAISE EXCEPTION 'Gymbranch must be associated with at least one area!';
	END IF;
	RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER enforce_gymbranch_has_area
AFTER DELETE OR UPDATE ON gymbranch
FOR EACH ROW EXECUTE FUNCTION check_gymbranch_has_area();


-- enfore total participation of MEMBERSHIP (all membership must be either of type BASIC or CLASS)
CREATE OR REPLACE FUNCTION check_membership_specialization()
RETURNS TRIGGER AS $$
BEGIN
	IF NOT EXISTS (
		SELECT 1 FROM basic WHERE programID = NEW.programID
		UNION
		SELECT 1 FROM class WHERE programID = NEW.programID
	) THEN
		RAISE EXCEPTION 'MEMBERSHIP must have associated BASIC or CLASS record!';
	END IF;
	RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER enforce_membership_specialization
AFTER DELETE OR UPDATE ON membership
FOR EACH ROW EXECUTE FUNCTION check_membership_specialization();


-- enforce total participation of MEMBER (all members should have a record in REGISTER)
CREATE OR REPLACE FUNCTION check_member_has_registered()
RETURNS TRIGGER AS $$
BEGIN
	IF NOT EXISTS ( SELECT 1 FROM register WHERE ssn = NEW.ssn ) THEN
		RAISE EXCEPTION 'MEMBER must have associated REGISTER record!';
	END IF;
	RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER enforce_member_has_registered
BEFORE INSERT ON member
FOR EACH ROW EXECUTE FUNCTION check_member_has_registered();