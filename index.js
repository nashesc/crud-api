import app from './src/app.js'
import 'dotenv/config'
import './src/supabaseClient.js'

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
   console.log(`Server running (Supabase client initialized) on http://localhost:${PORT}`);
})