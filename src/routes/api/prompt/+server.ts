import { env } from '$env/dynamic/private';
import { Configuration, OpenAIApi } from 'openai';
import { error } from '@sveltejs/kit';

const configuration = new Configuration({
	apiKey: env.OPENAI_API_KEY
});

const openai = new OpenAIApi(configuration);
// console.log(openai);

/** @type {import('./$types').RequestHandler} */
// export function GET({ url }) {
// 	const min = Number(url.searchParams.get('min') ?? '0');
// 	const max = Number(url.searchParams.get('max') ?? '1');

// 	const d = max - min;

// 	if (isNaN(d) || d < 0) {
// 		throw error(400, 'min and max must be numbers, and min must be less than max');
// 	}

// 	const random = min + Math.random() * d;

// 	return new Response(String(random));
// }

import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST = (async ({ request }) => {
	if (!configuration.apiKey) {
		return json({
			error: {
				status: 500,
				message: 'OpenAI API key not configured, please follow instructions in README.md'
			}
		});
	}
	const response = await request.json();
	if (!response) {
		return json({
			error: {
				status: 400,
				message: 'Please enter a valid prompt'
			}
		});
	}

	try {
		const completion = await openai.createCompletion({
			model: 'text-davinci-003',
			prompt: response.prompt,
			temperature: response.temperature,
			max_tokens: 100
		});

		return json({ code: 200, result: completion.data.choices[0].text });
	} catch (error) {
		// Consider adjusting the error handling logic for your use case
		if (error.response) {
			console.error(error.response.status, error.response.data);
		} else {
			console.error(`Error with OpenAI API request: ${error.message}`);
			return json({
				error: {
					code: 500,
					message: 'An error occurred during your request.'
				}
			});
		}
	}
}) satisfies RequestHandler;
