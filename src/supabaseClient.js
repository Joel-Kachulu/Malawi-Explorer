
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://izgjxqoajukginrpbxmm.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml6Z2p4cW9hanVrZ2lucnBieG1tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY1OTc3MzMsImV4cCI6MjA2MjE3MzczM30.i6n6ojh8lQKq7VvbhN9fw9I0Q9Xf6al_lzAvIUWcDlo";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

