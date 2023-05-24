<script lang="ts">
	import type { ActionData } from "./$types";

    export let form: ActionData;
    </script>

<form method="POST" enctype="multipart/form-data">
    <label>
        File
        <input name="file" type="file" required>
    </label>
    <button type="submit">Post</button>
</form>

    <p>{JSON.stringify(form)}</p>
