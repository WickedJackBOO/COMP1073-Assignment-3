const apiKey = '5204ffbaca704f33b80c5bca3ac60b35'; // api key for NewsAPI

function getNews() { // function to fetch news articles based on user input
    const topic = document.getElementById('topicInput').value; // get the topic from input field
    const loader = document.getElementById('loader'); // get the loader element
    const container = document.getElementById('newsContainer'); // get the news container element

    loader.classList.remove('hidden'); // show the loader
    container.innerHTML = ''; // clear previous results

    const url = `https://newsapi.org/v2/everything?q=${topic}&language=en&pageSize=5&apiKey=${apiKey}`; // construct the API URL with the topic and API key

    // get the data from the news api
    fetch(url)
    .then(res => res.json())
    .then(data => {
        loader.classList.add('hidden'); // hide the spinner
        if (data.articles.length === 0) { // if there is no news
            container.innerHTML = `<p>No results found.</p>`;
            return;
    }
    data.articles.forEach(article => { // go through each article and show it
        const item = document.createElement('div');
        item.className = 'article';
        item.innerHTML = `
            <h2>${article.title}</h2>
            <p><strong>${article.source.name}</strong></p>
            <p>${article.description || 'No description'}</p>
            <a href="${article.url}" target="_blank">Read more</a>
        `;
        container.appendChild(item);
    });
    })
    .catch(error => { // if something goes wrong
        loader.classList.add('hidden');
        console.error('Error fetching news:', error);
    });
}

function loadSpacePic() { // this gets the nasa space pic of the day
    const url = 'https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY'; // using DEMO_KEY because it's free

    // get the pic data from nasa
    fetch(url)
    .then(res => {
        if (!res.ok) { // if the api says too many requests
            if (res.status === 429) {
                throw new Error("You're using NASA's DEMO_KEY and have hit the rate limit. Try again in a little while.");
            } else {
                throw new Error(`NASA API returned status ${res.status}`);
            }
        }
        return res.json();
    })
    .then(data => {
        const container = document.getElementById('spacePic');

        // if data is missing, show a message
        if (!data || !data.title || !data.explanation || !data.url) {
            container.innerHTML = `<p>NASA data is missing or broken.</p>`;
            return;
        }

        if (data.media_type === 'image') { // if it's an image, show it
            container.innerHTML = `
                <h3>${data.title}</h3>
                <img src="${data.url}" alt="${data.title}">
                <p>${data.explanation}</p>
            `;
        } else if (data.media_type === 'video') { // if it's a video, show the video
            container.innerHTML = `
                <h3>${data.title}</h3>
                <iframe width="100%" height="315" src="${data.url}" frameborder="0" allowfullscreen></iframe>
                <p>${data.explanation}</p>
            `;
        } else { // if it's something else, just say it's not supported
            container.innerHTML = `<p>Unsupported media type from NASA.</p>`;
        }
    })
    .catch(err => { // show a nice error message in the page
        document.getElementById('spacePic').innerHTML = `
            <p style="color: #ff0066;">${err.message}</p>
        `;
        console.error('NASA API error:', err);
    });
}



loadSpacePic();
