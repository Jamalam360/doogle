import { redirect } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = (async ({ locals: { getSession, supabase } }) => {
  const session = await getSession()

  if (!session) {
    throw redirect(303, '/login')
  }

  const { data, error } = await supabase.from("posts").select("*").order("created_at", { ascending: false }).eq("approved", true).limit(10);
  console.error(error);
  return { session, user: session.user, posts: data }
})
