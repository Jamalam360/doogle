<script lang="ts">
	import Post from "$lib/Post.svelte";
	import { getCSSCustomProp, voteOnPost } from "$lib/util";
	import { onMount } from "svelte";
	import type { PageData } from "./$types";
	import interact from "interactjs";
	import "./cards.css";

	export let data: PageData;
	let posts = data.posts;

	const INTERACT_THRESHOLD = 160;
	const INTERACT_MAX_ROTATION = 15;

	let currentIdx = 0;
	let currentFetchIdx = data.fetchIncrement + 1;
	let rotation = 0;
	let x = 0;
	let y = 0;

	onMount(() => {
		const vw = document.documentElement.clientWidth;
		let offX = 260;

		if (vw < offX) {
			offX = vw;
		}

		interact(`.card[data-status="current"]:not(:last-child)`).draggable({
			onstart: (ev) => {
				ev.target.setAttribute("data-dragging", "true");
			},

			onmove: (ev: Interact.DragEvent) => {
				x = ((getCSSCustomProp("--card-x", ev.target as HTMLElement, "float") || 0) as number) + ev.dx;
				y = ((getCSSCustomProp("--card-y", ev.target as HTMLElement, "float") || 0) as number) + ev.dy;

				rotation = INTERACT_MAX_ROTATION * (x / INTERACT_THRESHOLD);
				if (rotation > INTERACT_MAX_ROTATION) rotation = INTERACT_MAX_ROTATION;
				else if (rotation < -INTERACT_MAX_ROTATION) rotation = -INTERACT_MAX_ROTATION;

				ev.target.style.setProperty("--card-x", x + "px");
				ev.target.style.setProperty("--card-y", y + "px");
				ev.target.style.setProperty("--card-r", rotation + "deg");
			},

			onend: (ev: Interact.DragEvent) => {
				ev.target.setAttribute("data-dragging", "false");
				let moved = Math.abs(ev.pageX - ev.x0);

				if (moved > INTERACT_THRESHOLD) {
					ev.target.setAttribute("data-status", "transition");

					if (x > 0) {
						x = offX;
					} else {
						x = offX * -1;
					}

					setTimeout(() => {
						ev.target.setAttribute("data-status", "done");
					}, 10);

					if (ev.target.nextElementSibling) {
						ev.target.nextElementSibling.setAttribute("data-status", "current");
					}

					voteOnPost(data.supabase, data.session, posts[currentIdx], x > 0 ? "upvote" : "downvote");
					currentIdx++;

					if (currentIdx > posts.length - 5) {
						data.supabase
							.from("post_reactions")
							.select("post_id")
							.eq("user_id", data.session.user.id)
							.then(({ data: previousVotes }) => {
								data.supabase
									.from("posts")
									.select("*")
									.order("created_at", { ascending: false })
									.eq("approved", true)
									.not("id", "in", `(${(previousVotes || []).map((post) => post.post_id).join(",")})`)
									.range(currentFetchIdx, currentFetchIdx + data.fetchIncrement)
									.then((res) => {
										let { data: newData, error } = res;

										if (newData) {
											posts = [...posts, ...newData];
											currentFetchIdx += newData.length;
										} else if (!data || error) {
											console.error(data, error);
										}
									});
							});
					}
				} else {
					x = 0;
					y = 0;
					rotation = 0;
					ev.target.style.setProperty("--card-r", rotation + "deg");
				}

				ev.target.style.setProperty("--card-x", x + "px");
				ev.target.style.setProperty("--card-y", y + "px");
			},
		});
	});
</script>

<div class="w-full">
	{#each posts as post, i}
		{#key post.id}
			<Post {post} supabase={data.supabase} status={i == 0 ? "current" : "waiting"} />
		{/key}
	{/each}
</div>
