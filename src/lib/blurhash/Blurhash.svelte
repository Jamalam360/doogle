<script lang="ts">
	import { decode } from "blurhash";
	import { onMount } from "svelte";

	export let hash: string;

	let canvas: HTMLCanvasElement;

	onMount(() => {
		if (hash && canvas) {
			const pixels = decode(hash, 16, 16, 1);
			const ctx = canvas.getContext("2d")!;
			const imageData = ctx.createImageData(16, 16);
			imageData.data.set(pixels);
			ctx.putImageData(imageData, 0, 0);
		}
	});
</script>

<div class="w-full h-full aspect-[9/16]">
	<canvas bind:this={canvas} width={16} height={16} class="w-full h-full rounded-3xl" />
</div>
