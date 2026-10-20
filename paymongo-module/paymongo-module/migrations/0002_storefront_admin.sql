-- Apply once to the existing marjonsealza-payments database after reviewing its current schema.
ALTER TABLE store_orders ADD COLUMN fulfillment_status TEXT NOT NULL DEFAULT 'unfulfilled'
  CHECK(fulfillment_status IN ('unfulfilled','processing','shipped','completed','cancelled'));
ALTER TABLE store_orders ADD COLUMN customer_name TEXT NOT NULL DEFAULT '';
ALTER TABLE store_orders ADD COLUMN customer_email TEXT NOT NULL DEFAULT '';
ALTER TABLE store_orders ADD COLUMN customer_phone TEXT;
ALTER TABLE store_orders ADD COLUMN line_items_json TEXT NOT NULL DEFAULT '[]';
ALTER TABLE store_orders ADD COLUMN updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE store_orders ADD COLUMN paymongo_mode TEXT NOT NULL DEFAULT 'test'
  CHECK(paymongo_mode IN ('test','live'));

CREATE TABLE IF NOT EXISTS store_products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  category TEXT NOT NULL DEFAULT 'General',
  price_minor INTEGER NOT NULL CHECK(price_minor > 0),
  available INTEGER NOT NULL DEFAULT 1 CHECK(available IN (0,1)),
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE payment_webhook_events ADD COLUMN processed_at TEXT;

CREATE INDEX IF NOT EXISTS idx_store_orders_status_created
  ON store_orders(status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_store_orders_reference
  ON store_orders(reference_number);

INSERT OR IGNORE INTO store_products (id,name,description,category,price_minor,available)
VALUES
  ('digital-consultation','Digital Consultation','A focused session to discuss a digital or software project.','Services',150000,1),
  ('website-planning','Website Planning Package','A structured website planning and requirements package.','Services',350000,1),
  ('custom-project-inquiry','Custom Project Deposit','Use only after confirming the scope and deposit terms with the customer.','Projects',100000,0);
