DO $$
DECLARE
    description_type text;
BEGIN
    SELECT c.data_type
      INTO description_type
      FROM information_schema.columns c
     WHERE c.table_schema = 'public'
       AND c.table_name = 'recipes'
       AND c.column_name = 'description';

    IF description_type IS NULL THEN
        ALTER TABLE public.recipes
            ADD COLUMN description text NOT NULL DEFAULT '';
    ELSIF description_type = 'bytea' THEN
        ALTER TABLE public.recipes
            ALTER COLUMN description TYPE text USING convert_from(description, 'UTF8');
        ALTER TABLE public.recipes
            ALTER COLUMN description SET NOT NULL;
        ALTER TABLE public.recipes
            ALTER COLUMN description SET DEFAULT '';
    END IF;
END $$;
