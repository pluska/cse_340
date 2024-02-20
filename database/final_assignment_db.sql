/* sells_buyers */

CREATE TABLE public.sells_buyers (
  sells_buyers_id INT GENERATED BY DEFAULT AS IDENTITY,
  inv_id INT NOT NULL,
  account_id INT NOT NULL,
  CONSTRAINT sells_buyers_pk PRIMARY KEY (sells_buyers_id),
);

-- Relationships
ALTER TABLE public.sells_buyers
  ADD CONSTRAINT sells_buyers_inv_id_fk FOREIGN KEY (inv_id)
    REFERENCES public.inventory (inv_id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION;
ALTER TABLE public.sells_buyers
  ADD CONSTRAINT sells_buyers_account_id_fk FOREIGN KEY (account_id)
    REFERENCES public.account (account_id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION;


