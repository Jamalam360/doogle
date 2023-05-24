import { redirect } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = (async ({ locals: { getSession } }) => {
  const session = await getSession()

  if (!session) {
    throw redirect(303, '/login')
  }

  console.log(session.user);
  
    
  if ((session.user.user_metadata.provider_id || "") != "478579885951156225") {
    throw redirect(303, '/feed')
  }
})
