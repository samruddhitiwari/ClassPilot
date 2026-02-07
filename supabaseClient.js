import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const supabaseUrl = window.SUPABASE_URL || "https://YOUR-PROJECT.supabase.co";
const supabaseKey = window.SUPABASE_ANON_KEY || "YOUR-ANON-KEY";

export const supabase = createClient(supabaseUrl, supabaseKey);
