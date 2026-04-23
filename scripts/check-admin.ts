import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import * as path from 'path'

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY
const adminEmail = 'idhamyazim1234@yahoo.com'

const supabase = createClient(supabaseUrl!, supabaseKey!)

async function checkAdmin() {
  const { data: { users }, error } = await supabase.auth.admin.listUsers()
  
  if (error) {
    console.error('Error fetching users:', error)
    return
  }

  const user = users.find(u => u.email === adminEmail)
  if (user) {
    console.log('User found:', user.email)
    console.log('User Metadata:', JSON.stringify(user.user_metadata, null, 2))
    
    if (user.user_metadata?.role === 'admin') {
      console.log('SUCCESS: User already has admin role.')
    } else {
      console.log('UPDATING: User found but missing admin role. Updating now...')
      const { error: updateError } = await supabase.auth.admin.updateUserById(
        user.id,
        { user_metadata: { ...user.user_metadata, role: 'admin' } }
      )
      if (updateError) console.error('Update error:', updateError)
      else console.log('Update successful!')
    }
  } else {
    console.log('NOT FOUND: User does not exist. Creating now...')
    const { data: { user: newUser }, error: createError } = await supabase.auth.admin.createUser({
      email: adminEmail,
      password: 'AdminPassword123!',
      email_confirm: true,
      user_metadata: { role: 'admin' }
    })
    if (createError) console.error('Create error:', createError)
    else console.log('User created successfully with admin role!')
  }
}

checkAdmin()
