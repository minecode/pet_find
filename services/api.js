import { create } from 'apisauce';

const api = create({
	// baseURL: 'http://parc.us-east-1.elasticbeanstalk.com',
	baseURL: 'https://petfindapi.herokuapp.com/',
	headers: {
		Accept: 'application/json',
		'Content-Type': 'multipart/form-data'
	}
});

api.addAsyncResponseTransform(async response => {
	if (!response.ok) {
		throw response;
	}
});

async function post(endpoint, params) {
	if (endpoint === '/api/pn/') {
		const temp = new FormData();
		temp.append('token', params.token);
		temp.append('lat', params.lat);
		temp.append('long', params.long);
		params = temp;
	} else {
		const temp = new FormData();
		temp.append('image', {
			uri: params.uri,
			name: params.name,
			type: params.type
		});
		temp.append('contact', params.contact);
		temp.append('description', params.description);
		temp.append('lat', params.lat);
		temp.append('long', params.long);
		params = temp;
	}
	return await api
		.post(endpoint, params, {
			headers: {
				'Content-Type': 'multipart/form-data'
			}
		})
		.then(response => {
			return response;
		})
		.catch(error => {
			throw error;
		});
}

async function get(endpoint) {
	return await api
		.get(endpoint)
		.then(response => {
			return response;
		})
		.catch(error => {
			throw error;
		});
}

export { post, get };
