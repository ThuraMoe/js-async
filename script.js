const btn = document.querySelector('.btn-country');
const container = document.querySelector('.container');

function country(name) {
    const request = new XMLHttpRequest();
    request.open('GET', `https://restcountries.com/v3.1/name/${name}`);
    request.send();
    request.addEventListener('load', function () {
        const [data] = JSON.parse(this.responseText);
        console.log(data);

        const html = `
            <article class="country">
                <img class="country__img" src="${data.flags.png}" />
                <div class="country__data">
                <h3 class="country__name">${data.name.common}</h3>
                <h4 class="country__region">${data.region}</h4>
                <p class="country__row"><span>👫</span>${data.population}</p>
                <p class="country__row"><span>🗣️</span>${Object.values(data.languages)[0]}</p>
                <p class="country__row"><span>💰</span>${Object.keys(data.currencies)[0]}</p>
                </div>
            </article>
        `;
        container.insertAdjacentHTML('beforeend', html);
    });
}

country('myanmar');
