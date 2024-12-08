-- Database admin
CREATE ROLE db_admin;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO db_admin;

-- application users
CREATE ROLE app_user_read_only; -- members and trainers
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO app_user_read_only;
