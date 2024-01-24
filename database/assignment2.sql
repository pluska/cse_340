/* Task 1 */

INSERT INTO public.account (
  account_firstname,
  account_lastname,
  account_email,
  account_password
) VALUES (
  'Tony',
  'Stark',
  'tony@starkent.com',
  'Iam1ronM@n'
);

UPDATE account
SET account_type = 'Admin'
WHERE account_id = 1;

DELETE FROM account
WHERE account_id = 1;

UPDATE inventory
set inv_description = replace(inv_description, 'small interiors', 'a huge interior')
WHERE inv_make = 'GM';

SELECT inv_make , inv_model
FROM inventory
INNER JOIN classification
ON classification.classification_id = inventory.classification_id
WHERE classification_name = 'Sport';

UPDATE inventory
SET inv_image = replace(inv_image, '/images', '/images/vehicles'),
    inv_thumbnail = replace(inv_thumbnail, '/images', '/images/vehicles');