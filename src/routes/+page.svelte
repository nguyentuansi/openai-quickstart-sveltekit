<script lang="ts">
	let promptInput: any;
	let temperatureInput = 0.6;
	let result = '';
	let loading = false;
	async function onSubmit(event) {
		event.preventDefault();
		loading = true;
		try {
			const response = await fetch('/api/prompt', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ prompt: promptInput, temperature: temperatureInput })
			});

			const data = await response.json();
			if (response.status !== 200) {
				throw data.error || new Error(`Request failed with status ${response.status}`);
			} else {
				loading = false;
			}
			result = data.result;
		} catch (error) {
			// Consider implementing your own error handling logic here
			console.error(error);
		}
	}
</script>

<body>
	<main class="container">
		<article>
			<h1>Askme</h1>
			<form on:submit={onSubmit}>
				<input
					type="search"
					name="prompt"
					bind:value={promptInput}
					placeholder="What is Mixcore CMS?"
					required
				/>
				<small>Or you can ask anything you want!</small>
				<!-- Range slider -->
				<label for="range">
					Temperature : <em data-tooltip="Lower = more accurate; higher = more diverse."
						>{temperatureInput}</em
					>
					<input
						type="range"
						min="0"
						max="1"
						step="0.1"
						name="temperature"
						bind:value={temperatureInput}
					/>
				</label>
				<!-- Button -->
				<button type="submit" aria-busy={loading}>Submit</button>
			</form>
			<article class="result">{result}</article>
		</article>
	</main>
</body>

<style>
	main,
	result {
		padding-top: 0;
		padding-bottom: 0;
	}
</style>
