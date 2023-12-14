const btn = document.querySelector(".btn-country");
const countries = document.querySelector(".countries");

const countryUrl = "https://restcountries.com/v3.1";

const renderCountry = function (data, className = "") {
  const html = `
    <article class="country ${className}">
        <img class="country__img" src="${data.flags.png}" />
        <div class="country__data">
            <h3 class="country__name">${data.name.common}</h3>
            <h4 class="country__region">${data.region}</h4>
            <p class="country__row"><span>👫</span>${(
              +data.population / 1000000
            ).toFixed(1)} M</p>
            <p class="country__row"><span>🗣️</span>${
              Object.values(data.languages)[0]
            }</p>
            <p class="country__row"><span>💰</span>${
              Object.keys(data.currencies)[0]
            }</p>
        </div>
    </article>
    `;
  countries.insertAdjacentHTML("beforeend", html);
  // countries.style.opacity = 1;
};

const renderError = (msg) => {
  countries.insertAdjacentText("beforeend", msg);
  // countries.style.opacity = 1;
};

//////////////////////////////////////
//// XMLHttpRequest AJAX Call     ///
/////////////////////////////////////
/* const getCountryAndNeighbour = function(name) {
    // Main country ajax call
    const request = new XMLHttpRequest();
    request.open('GET', `${countryUrl}/name/${name}`);
    request.send();
    request.addEventListener('load', function () {
        const [data] = JSON.parse(this.responseText);
        // render main country
        renderCountry(data);
        
        // neighbour country ajax call
        const neighbourCountry = data.borders?.[0];
        if(!neighbourCountry) return;
        
        const req = new XMLHttpRequest();
        req.open('GET', `${countryUrl}/alpha/${neighbourCountry}`);
        req.send();
        req.addEventListener('load', function() {
            const [data] = JSON.parse(this.responseText);
            console.log(data);
            // render neighbour country
            renderCountry(data, 'neighbour');
        });
        
    });
}
getCountryAndNeighbour('turkey'); */

/////////////////////////////////////////
//// Promises and the Fetch API Call  ///
////////////////////////////////////////

const getCountryAndNeighbour = (country) => {
  fetch(`${countryUrl}/name/${country}`)
    .then((res) => res.json())
    .then((data) => {
      // render main country
      const [mainCountry] = data;
      renderCountry(mainCountry);

      // get neighbour country
      const neighbour = mainCountry.borders?.[0];
      // if not exists
      if (!neighbour) return false;
      // call neighbour country if exists
      return fetch(`${countryUrl}/alpha/${neighbour}`);
    })
    .then((response) => response.json())
    .then((data) => {
      // render neighbour country
      const [neighbourCountry] = data;
      renderCountry(neighbourCountry, "neighbour");
    })
    .catch((error) => {
      console.error(error);
      renderError(`Something went wrong. ${error.message} error occurred. Try again!!`);
    })
    .finally(() => {
      countries.style.opacity = 1;
    });
};

btn.addEventListener("click", function () {
  getCountryAndNeighbour("nepal");
});
