<script lang="ts">
	import Post from "$lib/Post.svelte";
	import { getCSSCustomProp, voteOnPost } from "$lib/util";
	import { onMount } from "svelte";
	import type { PageData } from "./$types";
	import interact from "interactjs";
	import "./cards.css";

	export let data: PageData;

	const interactThreshold = 160;
	const interactMaxRotation = 15;

	let currentIdx = 0;
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

				rotation = interactMaxRotation * (x / interactThreshold);
				if (rotation > interactMaxRotation) rotation = interactMaxRotation;
				else if (rotation < -interactMaxRotation) rotation = -interactMaxRotation;

				ev.target.style.setProperty("--card-x", x + "px");
				ev.target.style.setProperty("--card-y", y + "px");
				ev.target.style.setProperty("--card-r", rotation + "deg");
			},

			onend: (ev: Interact.DragEvent) => {
				ev.target.setAttribute("data-dragging", "false");
				let moved = Math.abs(ev.pageX - ev.x0);

				if (moved > interactThreshold) {
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

					voteOnPost(data.supabase, data.session, data.posts[currentIdx], x > 0 ? "upvote" : "downvote");
					currentIdx++;
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
	{#each data.posts as post, i}
		{#key post.id}
			<Post {post} supabase={data.supabase} status={i == 0 ? "current" : "waiting"} />
		{/key}
	{/each}
</div>
