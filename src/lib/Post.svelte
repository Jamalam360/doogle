<script lang="ts">
	import type { Session, SupabaseClient } from "@supabase/supabase-js";
	import type { Database } from "./database.types";

	export let supabase: SupabaseClient<Database>;
	export let session: Session;
	export let post: Database["public"]["Tables"]["posts"]["Row"];
	export let onVoted: () => void;
	export let onTop: boolean;
	export let index: number;

	let voted = false;
	let upvoted = false;
	let value = 0;

	const rotations = [
		"-rotate-6",
		"-rotate-3",
		"-rotate-2",
		"-rotate-1",
		"rotate-0",
		"rotate-1",
		"rotate-2",
		"rotate-3",
		"rotate-6",
	];

	const rotation = rotations[Math.floor(Math.random() * rotations.length)];

	$: {
		supabase
			.from("post_reactions")
			.select("*")
			.eq("post_id", post.id)
			.eq("user_id", session.user.id)
			.then((res) => {
				let { data, error } = res;

				if (data && data[0]) {
					voted = true;
					upvoted = data[0].reaction;
				} else if (!data || error) {
					voted = false;
				}
			});
	}

	$: {
		supabase
			.from("post_reactions")
			.select("reaction")
			.eq("post_id", post.id)
			.then((res) => {
				let { data, error } = res;

				if (data) {
					value = data.reduce((acc, curr) => {
						if (curr.reaction) {
							return acc + 1;
						} else {
							return acc - 1;
						}
					}, 0);
				} else if (!data || error) {
					console.error(data, error);
				}
			});
	}

	const upvote = async () => {
		if (voted) {
			if (!upvoted) {
				await supabase
					.from("post_reactions")
					.update({ reaction: true })
					.eq("post_id", post.id)
					.eq("user_id", session.user.id);
				value += 2;
			} else {
				await supabase.from("post_reactions").delete().eq("post_id", post.id).eq("user_id", session.user.id);
				voted = false;
				value--;
			}
		} else {
			await supabase.from("post_reactions").insert({ post_id: post.id, user_id: session.user.id, reaction: true });
			voted = true;
			value++;
		}

		upvoted = true;
	};

	const downvote = async () => {
		if (voted) {
			if (upvoted) {
				await supabase
					.from("post_reactions")
					.update({ reaction: false })
					.eq("post_id", post.id)
					.eq("user_id", session.user.id);
				value -= 2;
			} else {
				await supabase.from("post_reactions").delete().eq("post_id", post.id).eq("user_id", session.user.id);
				voted = false;
				value++;
			}
		} else {
			await supabase.from("post_reactions").insert({ post_id: post.id, user_id: session.user.id, reaction: false });
			voted = true;
			value--;
		}

		upvoted = false;
	};

	let startX = 0;
	let currentX = 0;
	let card: HTMLDivElement;

	const swipeThreshold = 0.6;

	const handleArrowKeys = (e: KeyboardEvent) => {
		if (onTop) {
			if (e.key === "ArrowLeft") {
				downvote();
				card.style.transform = `translate(-100%, -50%)`;
				card.style.transition = "transform 0.5s ease";
			} else if (e.key === "ArrowRight") {
				upvote();
				card.style.transform = `translate(100%, -50%)`;
				card.style.transition = "transform 0.5s ease";
			} else if (e.key === "ArrowUp") {
				upvote();
				card.style.transform = `translate(100%, -50%)`;
				card.style.transition = "transform 0.5s ease";
			} else if (e.key === "ArrowDown") {
				downvote();
				card.style.transform = `translate(-100%, -50%)`;
				card.style.transition = "transform 0.5s ease";
			}

			setTimeout(onVoted, 400);
		}
	};

	const handleTouchStart = (ev: TouchEvent) => {
		startX = ev.touches[0].clientX;
	};

	const handleTouchMove = (ev: TouchEvent) => {
		if (onTop) {
			const diffX = ev.touches[0].clientX - startX;
			currentX = diffX;
			card.style.transition = "none";
			card.style.transform = `translate(${diffX}px, -50%)`;
		}
	};

	const handleTouchEnd = async () => {
		if (onTop) {
			if (Math.abs(currentX) > card.clientWidth * swipeThreshold) {
				await upvote();
				onVoted();
			} else if (currentX < -(card.clientWidth * swipeThreshold)) {
				await downvote();
				onVoted();
			} else {
				currentX = 0;
				card.style.transition = "transform 0.5s ease";
				card.style.transform = `translate(0px, -50%)`;
			}
		}
	};
</script>

<svelte:window on:keydown={handleArrowKeys} />

<div
	class={`top-1/2 -translate-y-1/2 absolute w-[95vw] bg-[#00dde7] rounded-2xl shadow-2xl` + (!onTop ? `shadow-none ${rotation}` : "")}
	style={`z-index: ${index}`}
	bind:this={card}
	on:touchstart={handleTouchStart}
	on:touchmove={handleTouchMove}
	on:touchend={handleTouchEnd}
>
	<h2 class="pt-2 text-center text-4xl text-[#404b55] font-bold">{value}</h2>
	<img
		src={post.image}
		alt="Dog"
		class={`h-[60vh] w-full aspect-[9/16] object-cover p-2 rounded-3xl ${!onTop ? `opacity-30` : ""}`}
	/>
</div>
