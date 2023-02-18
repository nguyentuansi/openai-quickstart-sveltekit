<script lang="ts">
	import { flip } from 'svelte/animate';
	import { RangeSlider } from '@skeletonlabs/skeleton';
	import { tooltip } from '@skeletonlabs/skeleton';
	import { error } from '@sveltejs/kit';

	let promptInput: any;
	let temperatureInput = 0.6;
	let result = '';
	let loading = false;

	async function onSubmit(event) {
		event.preventDefault();
		loading = true;

		if (promptInput != '') {
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
	}
</script>

<div class="container h-full mx-auto flex justify-center items-center">
	<div class="space-y-10 ">
		<h1 class="font-bold text-center">Hey! It's me Askit.</h1>
		<form method="POST" class="" on:submit={onSubmit}>
			<div class="card  p-4">
				<header class="card-header"><h2>What do you want to ask to day?</h2></header>
				<div class="p-4 space-y-4">
					<label class="label">
						<!-- <span>Label Text</span> -->

						<input
							class="input"
							type="search"
							name="prompt"
							bind:value={promptInput}
							placeholder="What is Mixcore CMS?"
							required
						/>
					</label>

					<!-- Range slider -->
					<svelte:component
						this={RangeSlider}
						name="range-slider-example"
						label={'Temperature'}
						bind:value={temperatureInput}
						min={0}
						max={1}
						step={0.1}
						ticked={true}
						class="w-full max-auto"
					>
						<div class="flex justify-between items-center">
							<div class="font-bold">Temperature:</div>
							<div class="text-xs">{temperatureInput} / 1</div>
						</div>
					</svelte:component>
				</div>
				<footer class="card-footer text-center">
					<button class="btn btn-lg variant-filled-primary mb-4" type="submit" aria-busy={loading}>
						<span>Ask</span>
					</button>
					{#if result}<div class="card p-4 text-left">{result}</div>{/if}
				</footer>
			</div>
		</form>
	</div>
</div>

<style lang="postcss">
	.card {
		max-width: 600px;
	}
	figure {
		@apply flex relative flex-col;
	}
	figure svg,
	.img-bg {
		@apply w-64 h-64 md:w-80 md:h-80;
	}
	.img-bg {
		@apply absolute z-[-1] rounded-full blur-[50px] transition-all;
		animation: pulse 5s cubic-bezier(0, 0, 0, 0.5) infinite, glow 5s linear infinite;
	}
	@keyframes glow {
		0% {
			@apply bg-primary-400/50;
		}
		33% {
			@apply bg-secondary-400/50;
		}
		66% {
			@apply bg-tertiary-400/50;
		}
		100% {
			@apply bg-primary-400/50;
		}
	}
	@keyframes pulse {
		50% {
			transform: scale(1.5);
		}
	}
</style>
