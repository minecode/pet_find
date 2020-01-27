import { create } from 'apisauce';

const api = create({
	// baseURL: 'http://parc.us-east-1.elasticbeanstalk.com',
	baseURL: 'http://127.0.0.1:8000',
	headers: {
		Accept: 'application/json',
		'Content-Type': 'application/json'
	}
});

api.addAsyncResponseTransform(async response => {
	if (!response.ok) {
		console.log(response);
		throw response;
	}
});

async function post(endpoint, params) {
	return await api
		.post(endpoint, params, {
			headers: {
				'Content-Type': 'multipart/form-data'
			}
		})
		.then(response => {
			response.data;
		})
		.catch(error => {
			throw error;
		});
}

export { post };
