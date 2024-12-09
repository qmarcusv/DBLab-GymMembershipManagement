-- Database admin
CREATE ROLE db_admin;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO db_admin;

-- manager
CREATE ROLE manager;

GRANT EXECUTE ON FUNCTION 
	move_trainer_branch,
	add_new_class,
	add_new_trainer_to_branch,
TO manager;

GRANT SELECT ON ALL TABLES IN SCHEMA public TO manager;

-- user
