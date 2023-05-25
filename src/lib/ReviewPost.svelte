<script lang="ts">
	import type { SupabaseClient } from "@supabase/supabase-js";
	import type { Database } from "./database.types";

	export let supabase: SupabaseClient<Database>;
	export let post: Database["public"]["Tables"]["posts"]["Row"];
	export let onChange: () => void;

	const approve = async () => {
		await supabase.from("posts").update({ approved: true }).eq("id", post.id);
		onChange();
	};

	const disapprove = async () => {
		await supabase.from("posts").delete().eq("id", post.id);
		await supabase.storage.from("images").remove([post.image.split("public/images/")[1]]);
		onChange();
	};
</script>

<div class="w-11/12">
	<img src={post.image} alt="Dog" />
	<button on:click={approve} class="bg-blue-500 disabled:bg-gray-400 text-white font-bold py-2 px-4 rounded">
		approve
	</button>

	<button on:click={disapprove} class="bg-red-500 disabled:bg-gray-400 text-white font-bold py-2 px-4 rounded">
		dont' approve
	</button>
</div>
