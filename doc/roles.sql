-- Create roles for unsigned user, user, grandma, and admin
CREATE ROLE unsigned_user LOGIN PASSWORD 'password_unsigned_user';
CREATE ROLE user LOGIN PASSWORD 'password_user';
CREATE ROLE grandma LOGIN PASSWORD 'password_grandma';
CREATE ROLE admin LOGIN PASSWORD 'password_admin';

-- Grant permissions to unsigned_user role
GRANT INSERT ON TABLE "User" TO unsigned_user;
GRANT INSERT ON TABLE "AuthRecord" TO unsigned_user;

-- Grant permissions to user role
GRANT SELECT, UPDATE ON TABLE "User" TO user where id = current_user;
GRANT SELECT, UPDATE ON TABLE "AuthRecord" TO user where userId = current_user;
GRANT SELECT, UPDATE ON TABLE "Order" TO user where userId = current_user;
GRANT INSERT ON TABLE "Order" to user;
GRANT INSERT ON TABLE "OrderItem" TO user;
GRANT SELECT, UPDATE ON TABLE "Review" TO user where userId = current_user;
GRANT INSERT ON TABLE "Review" to user;
GRANT INSERT ON TABLE "Grandma" TO grandma;

-- Grant permissions to grandma role
GRANT SELECT, UPDATE ON TABLE "Grandma" TO grandma where grandmaId = current_user;
GRANT SELECT, UPDATE ON TABLE "Meal" TO grandma where grannyId = current_user;
GRANT INSERT ON TABLE "Meal" to grandma;
GRANT SELECT, UPDATE ON TABLE "Order" TO grandma where grandmaId = current_user;

-- Grant permissions to admin role
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO admin;