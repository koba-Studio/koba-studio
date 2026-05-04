import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm'

const SUPABASE_URL = 'https://gjfjxczlcqlfxedythcx.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdqZmp4Y3psY3FsZnhlZHl0aGN4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc4NDMyNzQsImV4cCI6MjA5MzQxOTI3NH0.tkzEiA3oIgO56buLf6rrDQsm9DPQ5H3I2K8ziwtEjnM'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
