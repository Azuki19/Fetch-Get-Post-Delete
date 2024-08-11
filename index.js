document.getElementById('fetch-button').addEventListener('click', async function () {
	const users = await fetchDatausers();
	await fetchData(users);
});

document.getElementById('reset-button').addEventListener('click', function () {
	console.log('Form fields have been cleared');
});

document.getElementById('post-form').addEventListener('submit', async function (event) {
	event.preventDefault();

	const formData = new FormData(event.target);
	const newPost = {
		userId: formData.get('userId'),
		title: formData.get('title'),
		body: formData.get('body'),
	};

	try {
		const response = await fetch('http://localhost:3004/posts', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(newPost),
		});
		if (!response.ok) {
			throw new Error('Network response was not ok');
		}
		const data = await response.json();

		const users = await fetchDatausers();
		await fetchData(users);
	} catch (error) {
		renderErrorState();
	}
});

async function fetchData(users) {
	renderLoadingState();
	try {
		const response = await fetch('http://localhost:3004/posts');
		if (!response.ok) {
			throw new Error('Network response was not ok');
		}
		const data = await response.json();
		renderData(data, users);
	} catch (error) {
		renderErrorState();
	}
}

async function fetchDatausers() {
	renderLoadingState();
	try {
		const response = await fetch('http://localhost:3004/users');
		if (!response.ok) {
			throw new Error('Network response was not ok');
		}
		const data = await response.json();
		return data;
	} catch (error) {
		renderErrorState();
	}
}

function renderErrorState() {
	const container = document.getElementById('data-container');
	container.innerHTML = ''; // Clear previous data
	container.innerHTML = '<p>Failed to load data</p>';
	console.log('Failed to load data');
}

function renderLoadingState() {
	const container = document.getElementById('data-container');
	container.innerHTML = ''; // Clear previous data
	container.innerHTML = '<p>Loading...</p>';
	console.log('Loading...');
}

function renderData(data, users) {
	const container = document.getElementById('data-container');

	if (data.length > 0) {
		container.innerHTML = ''; // Clear previous data
		data.forEach((item) => {
			const user = users.find((user) => user.id === item.userId + '');
			const post = document.createElement('div');
			post.className = 'post';

			const postContent = `
        <div class="post-header">
          <h3>${item.title}</h3>
        </div>
        <div class="post-body">
          <p><strong>User ID:</strong> ${item.userId}</p>
          <p><strong>Content:</strong> ${item.body}</p>
          <p><strong>User Name:</strong> ${user.name}</p>
          <button class="delete-button" data-id="${item.id}">Delete</button>
        </div>
      `;

			post.innerHTML = postContent;
			container.prepend(post);

			post.querySelector('.delete-button').addEventListener('click', async function () {
				const postId = this.getAttribute('data-id');
				await deletePost(postId);
				post.remove();
			});
		});
	} else {
		container.innerHTML = '<p>No data found</p>';
	}
}

async function deletePost(postId) {
	try {
		const response = await fetch(`http://localhost:3004/posts/${postId}`, {
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json',
			},
		});
		if (!response.ok) {
			throw new Error('Network response was not ok');
		}
		console.log(`Post with ID ${postId} has been deleted`);
	} catch (error) {
		console.error('Failed to delete post', error);
	}
}
