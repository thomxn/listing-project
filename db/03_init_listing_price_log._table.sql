CREATE TABLE IF NOT EXISTS public.listing_price_log
(
    id                   serial               primary key,
    listing_id			     integer              not null,				
    price_eur            double precision     not null,
    created_date         timestamp            default now(),
    CONSTRAINT fk_price_log
      FOREIGN KEY(listing_id) 
	  REFERENCES listing(id)
);
