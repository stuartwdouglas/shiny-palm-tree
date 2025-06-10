-- Shipping Management Database Schema

-- Shipping Methods table
CREATE TABLE shipping_methods (
    method_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    carrier VARCHAR(100) NOT NULL,
    service_level VARCHAR(50) NOT NULL,
    estimated_days_min INTEGER NOT NULL,
    estimated_days_max INTEGER NOT NULL,
    base_cost DECIMAL(10,2) NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Shipping Zones table
CREATE TABLE shipping_zones (
    zone_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    country_codes TEXT[], -- Array of country codes
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Shipping Rates table
CREATE TABLE shipping_rates (
    rate_id SERIAL PRIMARY KEY,
    method_id INTEGER REFERENCES shipping_methods(method_id),
    zone_id INTEGER REFERENCES shipping_zones(zone_id),
    weight_from DECIMAL(10,2),
    weight_to DECIMAL(10,2),
    cost DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Shipments table
CREATE TABLE shipments (
    shipment_id SERIAL PRIMARY KEY,
    order_id INTEGER NOT NULL,
    method_id INTEGER REFERENCES shipping_methods(method_id),
    tracking_number VARCHAR(100),
    status VARCHAR(50) NOT NULL,
    shipping_label_url TEXT,
    estimated_delivery_date DATE,
    actual_delivery_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Shipment Status History table
CREATE TABLE shipment_status_history (
    history_id SERIAL PRIMARY KEY,
    shipment_id INTEGER REFERENCES shipments(shipment_id),
    status VARCHAR(50) NOT NULL,
    location VARCHAR(255),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Returns table
CREATE TABLE returns (
    return_id SERIAL PRIMARY KEY,
    order_id INTEGER NOT NULL,
    customer_id INTEGER NOT NULL,
    status VARCHAR(50) NOT NULL,
    reason TEXT NOT NULL,
    return_tracking_number VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Return Items table
CREATE TABLE return_items (
    return_item_id SERIAL PRIMARY KEY,
    return_id INTEGER REFERENCES returns(return_id),
    order_item_id INTEGER NOT NULL,
    quantity INTEGER NOT NULL,
    reason TEXT NOT NULL,
    condition VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);