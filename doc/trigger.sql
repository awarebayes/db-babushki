CREATE OR REPLACE FUNCTION update_grandma_rating() RETURNS TRIGGER AS $$
DECLARE
    avg_rating DOUBLE PRECISION;
BEGIN
    -- Calculate the average rating for the grandma based on the reviews
    SELECT AVG(rating) INTO avg_rating FROM "Review" r WHERE r."grandmaId" = NEW."grandmaId";
    
    -- Update the grandma's rating in the Grandma table
    UPDATE "Grandma" SET rating  = avg_rating WHERE id = NEW."grandmaId";
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER update_grandma_rating_trigger ON "Review";
CREATE TRIGGER update_grandma_rating_trigger
AFTER INSERT OR UPDATE OR DELETE ON "Review"
FOR EACH ROW
EXECUTE FUNCTION update_grandma_rating();