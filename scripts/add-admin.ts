import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import * as path from 'path'

// Load env vars
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY
const adminEmail = 'idhamyazim1234@yahoo.com'

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials in .env.local')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function addAdmin() {
  console.log(`Adding ${adminEmail} as admin...`)

  // Check if user exists
  const { data: { users }, error: listError } = await supabase.auth.admin.listUsers()
  
  if (listError) {
    console.error('Error listing users:', listError)
    process.exit(1)
  }

  const existingUser = users.find(u => u.email === adminEmail)

  if (existingUser) {
    console.log('User already exists.')
    // Optionally update metadata to mark as admin
    const { error: updateError } = await supabase.auth.admin.updateUserById(
      existingUser.id,
      { user_metadata: { role: 'admin' } }
    )
    if (updateError) console.error('Error updating metadata:', updateError)
    else console.log('User metadata updated to role: admin')
  } else {
    // Create user
    const tempPassword = 'AdminPassword123!' // User should change this
    const { data: { user }, error: createError } = await supabase.auth.admin.createUser({
      email: adminEmail,
      password: tempPassword,
      email_confirm: true,
      user_metadata: { role: 'admin' }
    })

    if (createError) {
      console.error('Error creating user:', createError)
    } else {
      console.log('Admin user created successfully!')
      console.log('Email:', adminEmail)
      console.log('Temporary Password:', tempPassword)
      console.log('IMPORTANT: Please log in and change your password immediately.')
    }
  }
}

addAdmin()
