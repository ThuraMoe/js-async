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

const getJSON = (url, errMsg = "Something went wrong") => {
  return fetch(`${url}`).then((response) => {
    if (!response.ok) {
      throw new Error(`${errMsg} (${response.status})`);
    }
    return response.json();
  });
};

/* const getCountryAndNeighbour = (country) => {
  fetch(`${countryUrl}/name/${country}`)
    .then((response) => {
      if(!response.ok) {
        throw new Error(`Country not found (${response.status})`);
      }
      return response.json();
    })
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
    .then((response) => {
      if(!response.ok) {
        throw new Error(`Country not found (${response.status})`);
      }
      return response.json();
    })
    .then((data) => {
      // render neighbour country
      const [neighbourCountry] = data;
      renderCountry(neighbourCountry, "neighbour");
    })
    .catch((error) => {
      console.error(error);
      renderError(
        `Something went wrong. ${error.message} error occurred. Try again!!`
      );
    })
    .finally(() => {
      countries.style.opacity = 1;
    });
}; */

const getCountryAndNeighbour = (country) => {
  getJSON(`${countryUrl}/name/${country}`, "Country not found")
    .then((data) => {
      // render main country
      const [mainCountry] = data;
      renderCountry(mainCountry);

      // get neighbour country
      const neighbour = mainCountry.borders?.[0];

      // if not exists
      if (!neighbour) throw new Error("Neighbour not found");
      // call neighbour country if exists
      return getJSON(`${countryUrl}/alpha/${neighbour}`, "Country not found");
    })
    .then((data) => {
      // render neighbour country
      const [neighbourCountry] = data;
      renderCountry(neighbourCountry, "neighbour");
    })
    .catch((error) => {
      console.error(error);
      renderError(
        `Something went wrong. ${error.message} error occurred. Try again!!`
      );
    })
    .finally(() => {
      countries.style.opacity = 1;
    });
};

btn.addEventListener("click", function () {
  // getCountryAndNeighbour("australia");
  const lat = "52.589";
  const lng = "13.381";
  whereAmI(lat, lng);
});

// const myGeoLocation = () => {
//   if (navigator.geolocation) {
//     navigator.geolocation.getCurrentPosition((pos) =>  {
//       lat = pos.coords.latitude;
//       lng = pos.coords.longitude;
//     });
//   }
// };

const whereAmI = (lat, lng) => {
  token = "248205843103594155420x48684";

  fetch(`https://geocode.xyz/${lat},${lng}?geoit=json&auth=${token}`)
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      if (data.error) throw new Error("Incorrect geolocation");
      const location = data.country;
      getCountryAndNeighbour(location);
    })
    .catch((error) => {
      renderError(
        `Something went wrong. ${error.message} error occurred. Try agin!`
      );
    })
    .finally(() => {
      countries.style.opacity = 1;
    });
};

/* 
// sample building promises
new Promise(function (resolve, reject) {
  if (Math.random() >= 0.5) {
    resolve("You win");
  } else {
    reject("You lose");
  }
})
  .then((res) => console.log(res))
  .catch((err) => console.log(err)); */

// promise building for lottery drawing
const lotteryPromise = new Promise((resolve, reject) => {
  console.log("lottery draw is happening");
  setTimeout(() => {
    if (Math.random() >= 0.5) {
      resolve("You Win 💰");
    } else {
      reject("You lose 😥");
    }
  }, 2000);
});

// promisifying
lotteryPromise.then((res) => console.log(res)).catch((err) => console.log(err));

// sample callback hell with setTimeout
/* setTimeout(() => {
  console.log("1 sec passed");
  setTimeout(() => {
    console.log("2 sec passed");
    setTimeout(() => {
      console.log("3 sec passed");
    }, 1000);
  }, 1000);
}, 1000); */

// to solve above setTimeout callback hell
// we will build a new promise
const wait = (second) => {
  return new Promise((resolve) => {
    setTimeout(resolve, second * 1000);
  });
};

wait(1)
  .then((res) => {
    console.log("1 sec passed");
    return wait(1);
  })
  .then((res) => {
    console.log("2 sec passed");
    return wait(1);
  })
  .then((res) => console.log("3 sec passed"));

// immediately resolve/reject promise
Promise.resolve("promise is resolve").then((x) => console.log(x));
Promise.reject(new Error("Something wrong ⚠")).catch((err) =>
  console.error(err)
);
