<script lang="ts">
	import { goto } from "$app/navigation";
	import { encodeImageToBlurhash } from "$lib/blurhash";
	import { onMount } from "svelte";
	import Compress from "compress.js";

	let upload: HTMLInputElement;
	let compressedImage: File;

	async function onSubmit(ev: Event) {
		ev.preventDefault();

		const form = ev.target as HTMLFormElement;
		const formData = new FormData(form);
		formData.set("file", compressedImage);
		const file = formData.get("file") as File;
		const result = await encodeImageToBlurhash(file);
		formData.set("blurhash_placeholder", result);

		await fetch("/api/post", {
			method: "POST",
			body: formData,
		});

		goto("/feed");
	}

	onMount(() => {
		if (upload) {
			upload.addEventListener("change", (ev) => {
				new Compress().compress([upload.files?.item(0)!], {}).then((data) => {
					compressedImage = Compress.convertBase64ToFile(data[0].data, data[0].ext);
				});
			});
		}
	});
</script>

<form method="POST" enctype="multipart/form-data">
	<label>
		File
		<input bind:this={upload} name="file" type="file" required />
	</label>
	<input class="hidden" type="text" name="blurhash_placeholder" />
	<button on:submit={onSubmit} type="submit">Post</button>
</form>
