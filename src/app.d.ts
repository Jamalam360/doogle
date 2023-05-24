import type { Database } from "$lib/database.types";
import type { Session, SupabaseClient } from "@supabase/supabase-js";

// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
		interface Locals {
			supabase: SupabaseClient<Database>
			getSession(): Promise<Session | null>
		  }
		  interface PageData {
			session: Session | null
		  }	  
	}
}

export {};
