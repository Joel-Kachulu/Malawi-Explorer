-- Create newsletter_subscribers table
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_newsletter_subscribers_email ON newsletter_subscribers(email);

-- Create index on subscribed_at for sorting
CREATE INDEX IF NOT EXISTS idx_newsletter_subscribers_subscribed_at ON newsletter_subscribers(subscribed_at);

-- Enable Row Level Security (RLS)
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anyone to insert (subscribe)
CREATE POLICY "Allow public to subscribe" ON newsletter_subscribers
    FOR INSERT
    WITH CHECK (true);

-- Create policy to allow authenticated users to view all subscribers (for admin purposes)
CREATE POLICY "Allow authenticated users to view subscribers" ON newsletter_subscribers
    FOR SELECT
    USING (auth.role() = 'authenticated');

-- Create policy to allow authenticated users to update subscribers
CREATE POLICY "Allow authenticated users to update subscribers" ON newsletter_subscribers
    FOR UPDATE
    USING (auth.role() = 'authenticated');

-- Create policy to allow authenticated users to delete subscribers
CREATE POLICY "Allow authenticated users to delete subscribers" ON newsletter_subscribers
    FOR DELETE
    USING (auth.role() = 'authenticated');

-- Create function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_newsletter_subscribers_updated_at
    BEFORE UPDATE ON newsletter_subscribers
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Add comments for documentation
COMMENT ON TABLE newsletter_subscribers IS 'Stores email addresses of users who subscribed to the newsletter';
COMMENT ON COLUMN newsletter_subscribers.id IS 'Unique identifier for each subscriber';
COMMENT ON COLUMN newsletter_subscribers.email IS 'Email address of the subscriber (must be unique)';
COMMENT ON COLUMN newsletter_subscribers.subscribed_at IS 'Timestamp when the user subscribed';
COMMENT ON COLUMN newsletter_subscribers.is_active IS 'Whether the subscription is active (for future unsubscribe functionality)';
COMMENT ON COLUMN newsletter_subscribers.created_at IS 'Timestamp when the record was created';
COMMENT ON COLUMN newsletter_subscribers.updated_at IS 'Timestamp when the record was last updated'; 