-- Database admin
CREATE ROLE db_admin;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO db_admin;

-- manager
CREATE ROLE manager;

GRANT EXECUTE ON PROCEDURE 
	move_trainer_branch,
	add_new_class,
	add_new_trainer_to_branch,
	register_member
TO manager;

GRANT SELECT ON ALL TABLES IN SCHEMA public TO manager;

-- user (not yet registered as members)
CREATE ROLE user_read_only;

GRANT SELECT ON 
	gymbranch, 
	membership,
	gymstore, 
	class 
TO user_read_only;

GRANT EXECUTE ON FUNCTION view_profile_ssn TO user_read_only;

-- members
CREATE ROLE member;

GRANT SELECT ON 
	gymbranch,
	membership,
	gymstore, 
	class,
	trainer,
	class_sched 
TO member;

GRANT EXECUTE ON FUNCTION view_register TO member;