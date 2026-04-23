import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import * as path from 'path'

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY
const adminEmail = 'idhamyazim1234@yahoo.com'
const newPassword = 'Admin1234!'

const supabase = createClient(supabaseUrl!, supabaseKey!)

async function resetPassword() {
  console.log(`Reseting password for ${adminEmail}...`)
  
  const { data: { users }, error: listError } = await supabase.auth.admin.listUsers()
  
  if (listError) {
    console.error('Error fetching users:', listError)
    return
  }

  const user = users.find(u => u.email === adminEmail)
  
  if (!user) {
    console.log('User not found. Creating anew...')
    const { error: createError } = await supabase.auth.admin.createUser({
      email: adminEmail,
      password: newPassword,
      email_confirm: true,
      user_metadata: { role: 'admin' }
    })
    if (createError) console.error('Error creating user:', createError)
    else console.log(`User created successfully with password: ${newPassword}`)
  } else {
    console.log(`User found (ID: ${user.id}). Resetting password...`)
    const { error: updateError } = await supabase.auth.admin.updateUserById(
      user.id,
      { 
        password: newPassword,
        email_confirm: true,
        user_metadata: { ...user.user_metadata, role: 'admin' }
      }
    )
    
    if (updateError) {
      console.error('Error resetting password:', updateError)
    } else {
      console.log(`SUCCESS: Password has been reset to: ${newPassword}`)
    }
  }
}

resetPassword()
