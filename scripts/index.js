document.addEventListener("DOMContentLoaded", function () {
  openTab(null, "tab1");
  document.querySelectorAll(".tab")[0].classList.add("active");
});

function openTab(event, tabName) {
  const tabContents = document.querySelectorAll(".tab-content");
  for (const content of tabContents) {
    content.classList.remove("active");
  }

  const tabs = document.querySelectorAll(".tab");
  for (const tab of tabs) {
    tab.classList.remove("active");
  }

  const selectedTab = document.getElementById(tabName);
  selectedTab.classList.add("active");
  event?.currentTarget.classList.add("active");
}

const API_KEY = "4b15209f0f4545becb6ba83dbb309700";
const __API__ = "https://api.openweathermap.org/data/2.5";
const API_FORECAST = `${__API__}/forecast`;
const SEARCH_INPUT = document.getElementById("search");
const BUTTON_INPUT = document.getElementById("button");
const TAB1 = document.getElementById("tab1");
const TAB2 = document.getElementById("tab2");

let inputValue;

const NOT_FOUND_SECTION = `
  <div
    class="bg_white padding10x20 mt10 v_stack center text_center gap8 color_gray"
  >
    <h2 class="fs_l">404</h2>
    <div>
      <p>Qwerty could not be found.</p>
      <p>Please enter a different location</p>
    </div>
  </div>`;

if ("geolocation" in navigator) {
  navigator.geolocation.getCurrentPosition(
    function (position) {
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;

      getCityFromCoordinates(latitude, longitude);
    },
    function (error) {
      console.log("Error getting location:", error);
    },
  );
} else {
  console.log("Geolocation is not supported in this browser");
}

function getCityFromCoordinates(latitude, longitude) {
  const apiUrl = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`;
  fetch(apiUrl)
    .then((response) => response.json())
    .then((data) => {
      const city =
        data.address.city || data.address.town || data.address.village;
      fetchWeather(city);
    })
    .catch((error) => {
      console.log("Error getting city:", error);
    });
}

SEARCH_INPUT.onchange = ({ target: { value } }) => {
  inputValue = value;
};

function fetchWeather(value) {
  fetch(`${API_FORECAST}?q=${value || inputValue}&appid=${API_KEY}&cnt=8`)
    .then((response) => response.json())
    .then((data) => {
      displayCurrentWeather(data);
    })
    .catch((e) => {
      console.log("->->->GET WEATHER DATA ERROR<-<-<-\n", e);
      TAB1.innerHTML = NOT_FOUND_SECTION;
    });

  fetch(`${API_FORECAST}?q=${value || inputValue}&appid=${API_KEY}`)
    .then((response) => response.json())
    .then((data) => {
      displayForecastWeather(data);
    })
    .catch((e) => {
      console.log("->->->GET WEATHER DATA ERROR<-<-<-\n", e);
      TAB2.innerHTML = NOT_FOUND_SECTION;
    });
}

BUTTON_INPUT.onclick = () => {
  fetchWeather();
};

function displayCurrentWeather(data) {
  const currentWeather = data.list[0];
  const {
    city: { name, sunrise, sunset, timezone },
  } = data;
  const { main } = currentWeather;
  const { main: mainWeather, icon } = currentWeather.weather[0];
  const iconUrl = `http://openweathermap.org/img/w/${icon}.png`;

  TAB1.innerHTML = `
  <div class="v_stack gap16">
    <div class="padding10x20 v_stack gap16 bg_white">
      <div class="h_stack between">
        <h3>CURRENT WEATHER - ${name}</h3>
        <h3>${currentWeather.dt_txt}</h3>
      </div>
      <div class="around h_stack center color_gray">
        <div class="v_stack center">
          <img
              src=${iconUrl}
              width="100"
              height="100"
              alt=""
          />
          <p>${mainWeather}</p>
        </div>
        <div class="v_stack gap16 center">
          <p class="fs30 color_black fs_l">${normalizedTem(main.temp)}</p>
          <p>${normalizedTem(main.feels_like)}</p>
        </div>
        <div class="v_stack gap8">
          <p>Sunrise: ${formatUnixTimestampAndOutputTimezone(sunrise)}</p>
          <p>Sunset: ${formatUnixTimestampAndOutputTimezone(sunset)}</p>
          <p>Duration: ${formatUnixTimestamp(timezone)} hr</p>
        </div>
      </div>
    </div>
    <div class="bg_white padding10x20 v_stack gap16">
      <h3>HOURLY</h3>
      <table class="padding0x30 text_left" id="current_weather_table">
      </table>
    </div>
  </div>`;
  createTable(data.list, "current_weather_table");
}

function displayForecastWeather(data) {
  TAB2.innerHTML = `
  <div class="h_stack" id="card_list"></div>
  <div class="mt10 bg_white padding10x20 v_stack gap16">
    <h3>HOURLY</h3>
    <table class="custom-table" id="forecast_weather_table">
    </table>
  </div>`;
  createCardList(data);
}

function createTable(list, tableId) {
  const CURRENT_WEATHER_TABLE = document.getElementById(tableId);
  CURRENT_WEATHER_TABLE.innerHTML = "";

  const titles = [
    formatDayOfWeek(list[0].dt_txt),
    "Forecast",
    "Temp",
    "RealFeel",
    "Wind (km/h)",
  ];

  const headerRow = document.createElement("tr");
  for (const title of titles) {
    const th = document.createElement("th");
    th.textContent = title;
    th.classList.add("text_left");
    headerRow.appendChild(th);
  }

  CURRENT_WEATHER_TABLE.appendChild(headerRow);

  for (const forecast of list) {
    const row = document.createElement("tr");

    const tdTimeWithIcon = document.createElement("td");
    const iconImg = document.createElement("img");
    const timeP = document.createElement("p");
    iconImg.src = `http://openweathermap.org/img/w/${forecast.weather[0].icon}.png`;
    iconImg.width = 50;
    iconImg.height = 50;
    timeP.innerText = formatUnixTimestampAndOutputTimezone(forecast.dt);
    tdTimeWithIcon.appendChild(timeP);
    tdTimeWithIcon.appendChild(iconImg);
    row.appendChild(tdTimeWithIcon);

    const forecastMain = forecast.weather[0].main;
    const forecastTemperature = forecast.main.temp;
    const forecastFeelsLike = forecast.main.feels_like;
    const forecastWindSpeed = forecast.wind.speed;

    const tdForecast = document.createElement("td");
    tdForecast.textContent = forecastMain;
    row.appendChild(tdForecast);

    const tdTemp = document.createElement("td");
    tdTemp.textContent = normalizedTem(forecastTemperature);
    row.appendChild(tdTemp);

    const tdFeelsLike = document.createElement("td");
    tdFeelsLike.textContent = normalizedTem(forecastFeelsLike);
    row.appendChild(tdFeelsLike);

    const tdWindSpeed = document.createElement("td");
    tdWindSpeed.textContent = `${forecastWindSpeed} km/h`;
    row.appendChild(tdWindSpeed);

    CURRENT_WEATHER_TABLE.appendChild(row);
  }
}

function createCardList(data) {
  const CARD_LIST = document.getElementById("card_list");

  CARD_LIST.innerHTML = "";

  const dailyForecast = groupDataByDay(data.list);

  for (const [index, dayForecast] of dailyForecast.entries()) {
    const cardWrapper = document.createElement("div");
    cardWrapper.classList.add(
      "v_stack",
      "gap8",
      "w288",
      "bg_gray",
      "border_right_gray",
      "padding10x20",
      "pointer",
      "hover",
    );

    const title = document.createElement("h5");
    title.classList.add("fs_m");
    const dataP = document.createElement("p");
    const img = document.createElement("img");
    const temp = document.createElement("p");
    const forecastText = document.createElement("p");

    title.innerText = formatDayOfWeek(dayForecast[0].dt_txt);
    dataP.innerText = formatDate(dayForecast[0].dt_txt);

    img.src = `http://openweathermap.org/img/w/${dayForecast[0].weather[0].icon}.png`;
    img.width = 100;
    img.height = 100;

    const averageTemp = calculateAverageTemp(dayForecast);
    temp.innerText = normalizedTem(averageTemp);

    forecastText.innerText = dayForecast[0].weather[0].description;

    cardWrapper.addEventListener("click", () => {
      const activeCard = CARD_LIST.querySelector(".selected_day");
      if (activeCard) {
        activeCard.classList.remove("selected_day");
      }
      cardWrapper.classList.add("selected_day");
      createTable(dayForecast, "forecast_weather_table");
    });

    cardWrapper.appendChild(title);
    cardWrapper.appendChild(dataP);
    cardWrapper.appendChild(img);
    cardWrapper.appendChild(temp);
    cardWrapper.appendChild(forecastText);
    CARD_LIST.appendChild(cardWrapper);

    if (index === 0) {
      createTable(dayForecast, "forecast_weather_table");
      cardWrapper.classList.add("selected_day");
    }
  }
}

function groupDataByDay(data) {
  const groupedData = {};

  for (const forecast of data) {
    const date = forecast.dt_txt.split(" ")[0];
    if (!groupedData[date]) {
      groupedData[date] = [];
    }
    groupedData[date].push(forecast);
  }

  return Object.values(groupedData);
}

function calculateAverageTemp(forecasts) {
  const totalTemp = forecasts.reduce(
    (sum, forecast) => sum + forecast.main.temp,
    0,
  );
  return totalTemp / forecasts.length;
}

function formatDayOfWeek(inputDate) {
  const daysOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const date = new Date(inputDate);
  return daysOfWeek[date.getDay()];
}

function normalizedTem(temp) {
  return `${(temp - 273.15).toFixed()}°C`;
}

function formatUnixTimestampAndOutputTimezone(unixTimestamp) {
  const date = new Date(unixTimestamp * 1000);
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const period = hours >= 12 ? "PM" : "AM";
  const normalizedHours = hours % 12 || 12;
  const normalizedMinutes = minutes < 10 ? `0${minutes}` : minutes;
  return `${normalizedHours}:${normalizedMinutes} ${period}`;
}

function formatUnixTimestamp(unixTimestamp) {
  const date = new Date(unixTimestamp * 1000);
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const normalizedHours = hours % 12 || 12;
  const normalizedMinutes = minutes < 10 ? `0${minutes}` : minutes;
  return `${normalizedHours}:${normalizedMinutes}`;
}

function formatDate(inputDate) {
  const months = [
    "JAN",
    "FEB",
    "MAR",
    "APR",
    "MAY",
    "JUN",
    "JUL",
    "AUG",
    "SEP",
    "OCT",
    "NOV",
    "DEC",
  ];

  const date = new Date(inputDate);
  const monthIndex = date.getMonth();
  const day = date.getDate();

  return `${months[monthIndex]} ${day}`;
}
