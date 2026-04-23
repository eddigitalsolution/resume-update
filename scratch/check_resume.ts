import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY! 
const supabase = createClient(supabaseUrl, supabaseKey)

async function checkResume() {
  const { data, error } = await supabase
    .from('resume')
    .select('id, full_name, role, stats')

  if (error) {
    console.error('Error fetching resume:', error)
    return
  }

  data?.forEach((r, i) => {
    console.log(`Record ${i}: ID=${r.id}, Name=${r.full_name}, Role=${r.role}, Stats=${!!r.stats}`)
  })
}

checkResume()
