import { encode } from "blurhash";

async function loadImage(src: File): Promise<HTMLImageElement> {
	return new Promise((resolve, reject) => {
		const img = new Image();
		const reader = new FileReader();

		reader.addEventListener(
			"load",
			() => {
				img.src = reader.result as string;
			},
			false,
		);

		reader.readAsDataURL(src);
		img.onload = () => resolve(img);
		img.onerror = (...args) => reject(args);
	});
}

function getImageData(image: HTMLImageElement): ImageData {
	const canvas = document.createElement("canvas");
	canvas.width = image.width;
	canvas.height = image.height;
	const context = canvas.getContext("2d");

	if (!context) {
		throw new Error("Could not get canvas context");
	}

	context.drawImage(image, 0, 0);
	return context.getImageData(0, 0, image.width, image.height);
}

export async function encodeImageToBlurhash(src: File) {
	const image = await loadImage(src);
	const imageData = getImageData(image);
	return encode(imageData.data, imageData.width, imageData.height, 4, 4);
}
