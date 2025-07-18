-- Create clans table
CREATE TABLE IF NOT EXISTS clans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    region VARCHAR(10),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create index on region for filtering performance
CREATE INDEX idx_clans_region ON clans(region);

-- Create index on created_at for sorting performance
CREATE INDEX idx_clans_created_at ON clans(created_at);