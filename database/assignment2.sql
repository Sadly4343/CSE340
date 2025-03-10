INSERT INTO public.account VALUES 
    ('1', 'Tony', 'Stark','tony@starkent.com','Iam1ronM@n', DEFAULT);

UPDATE public.account
SET account_type = 'Admin'
WHERE account_id = '1';

DELETE FROM public.account WHERE account_id = '1';

UPDATE public.inventory
SET inv_description = REPLACE(inv_description, 'small interiors', 'a huge interior')
WHERE inv_id = '10';

SELECT inv_make, inv_model
FROM public.inventory
INNER JOIN public.classification ON public.inventory.classification_id = public.classification.classification_id
WHERE classification_name = 'Sport';

UPDATE public.inventory
SET inv_image = REPLACE(inv_image, '/images/', '/images/vehicles/'),
 inv_thumbnail = REPLACE(inv_thumbnail, '/images/', '/images/vehicles/');


