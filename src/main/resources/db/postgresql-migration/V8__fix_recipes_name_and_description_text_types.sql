DO $$
DECLARE
    name_type text;
    description_type text;
BEGIN
    SELECT c.data_type
      INTO name_type
      FROM information_schema.columns c
     WHERE c.table_schema = 'public'
       AND c.table_name = 'recipes'
       AND c.column_name = 'name';

    IF name_type = 'bytea' THEN
        BEGIN
            ALTER TABLE public.recipes
                ALTER COLUMN name TYPE text USING convert_from(name, 'UTF8');
        EXCEPTION WHEN OTHERS THEN
            ALTER TABLE public.recipes
                ALTER COLUMN name TYPE text USING name::text;
        END;

        ALTER TABLE public.recipes
            ALTER COLUMN name SET NOT NULL;
    END IF;

    SELECT c.data_type
      INTO description_type
      FROM information_schema.columns c
     WHERE c.table_schema = 'public'
       AND c.table_name = 'recipes'
       AND c.column_name = 'description';

    IF description_type = 'bytea' THEN
        BEGIN
            ALTER TABLE public.recipes
                ALTER COLUMN description TYPE text USING convert_from(description, 'UTF8');
        EXCEPTION WHEN OTHERS THEN
            ALTER TABLE public.recipes
                ALTER COLUMN description TYPE text USING description::text;
        END;

        ALTER TABLE public.recipes
            ALTER COLUMN description SET NOT NULL;
        ALTER TABLE public.recipes
            ALTER COLUMN description SET DEFAULT '';
    END IF;
END $$;
