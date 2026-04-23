import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY! 
const supabase = createClient(supabaseUrl, supabaseKey)

async function deleteDuplicate() {
  const { error } = await supabase
    .from('resume')
    .delete()
    .eq('id', '5db09c5c-f8eb-471b-ab1e-b69bbc8b853b')

  if (error) {
    console.error('Error deleting duplicate:', error)
  } else {
    console.log('Successfully deleted duplicate resume record.')
  }
}

deleteDuplicate()
