-- drop all triggers
DO $$ 
DECLARE 
    r RECORD;
BEGIN
    -- Loop through all triggers in the current database
    FOR r IN (SELECT tgname, relname FROM pg_trigger 
              JOIN pg_class ON pg_class.oid = tgrelid 
              WHERE NOT tgisinternal) 
    LOOP
        -- Drop each trigger
        EXECUTE 'DROP TRIGGER ' || r.tgname || ' ON ' || r.relname;
    END LOOP;
END $$;

-- drop all functions 
DO $$ 
DECLARE 
    r RECORD;
BEGIN
    -- Loop through all user-defined functions in the current database
    FOR r IN (SELECT proname, pg_catalog.pg_get_function_arguments(p.oid) AS arguments
              FROM pg_catalog.pg_proc p
              JOIN pg_catalog.pg_namespace n ON n.oid = p.pronamespace
              WHERE n.nspname NOT IN ('pg_catalog', 'information_schema')) 
    LOOP
        -- Drop each user-defined function
        EXECUTE 'DROP FUNCTION IF EXISTS ' || r.proname || '(' || r.arguments || ') CASCADE';
    END LOOP;
END $$;

DROP TABLE REGISTER