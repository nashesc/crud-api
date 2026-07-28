import supabase from '../supabaseClient.js'
import { ValidationError } from '../errors.js'

export async function signUp(email, password) {
   if (!email || !password) {
      throw new ValidationError('Email and password are required')
   }

   const { data, error } = await supabase.auth.signUp({ email, password })

   if (error) {
      throw new ValidationError(error.message)
   }

   return data.user
}

export async function logOut(token) {
   const { error } = await supabase.auth.signOut(token)

   if (error) {
      const authError = new Error('Failed to log out')
      authError.name = 'AuthError'
      throw authError
   }
}

export async function logIn(email, password) {
   if (!email || !password) {
      throw new ValidationError('Email and password are required')
   }

   const { data, error } = await supabase.auth.signInWithPassword({ email, password })

   if (error) {
      const authError = new Error('Invalid login credentials')
      authError.name = 'AuthError'
      throw authError
   }

   return {
      access_token: data.session.access_token,
      refresh_token: data.session.refresh_token,
      user: data.user
   }
}