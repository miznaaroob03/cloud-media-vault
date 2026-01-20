const express = require('express');
const cors = require('cors');
// --- ADD THESE TWO LINES BELOW ---
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);
// ---------------------------------

const app = express();
app.use(cors()); // Make sure this is here so your frontend can talk to it
app.use(express.json()); // This allows your server to read JSON data

const PORT = process.env.PORT || 5000;

// --- TASK 2: SOFT DELETE (Move to Trash) ---
app.patch('/api/files/trash/:id', async (req, res) => {
  const { id } = req.params;
  
  // This updates the 'is_deleted' column you created earlier
  const { data, error } = await supabase
    .from('files')
    .update({ is_deleted: true }) 
    .eq('id', id);

  if (error) return res.status(500).json({ error: error.message });
  return res.json({ message: "File moved to trash successfully!" });
});

// --- TASK 3: SEARCH API (PostgreSQL ilike search) ---
app.get('/api/files/search', async (req, res) => {
  const { name } = req.query; // This gets the search term from the URL
  
  const { data, error } = await supabase
    .from('files')
    .select('*')
    .ilike('name', `%${name}%`) // Makes the search case-insensitive
    .eq('is_deleted', false);    // Ensures you don't find files already in trash

  if (error) return res.status(500).json({ error: error.message });
  return res.json(data);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`); 
});