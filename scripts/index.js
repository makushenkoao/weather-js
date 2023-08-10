document.addEventListener("DOMContentLoaded", function () {
  openTab(null, "tab1");
  document.querySelectorAll(".tab")[0].classList.add("active");
});

const __API__ = "https://api.openweathermap.org/data/2.5";
const API_KEY = "4b15209f0f4545becb6ba83dbb309700";
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

SEARCH_INPUT.onchange = ({ target: { value } }) => {
  inputValue = value;
};

BUTTON_INPUT.onclick = () => {
  fetch(`${API_FORECAST}?q=${inputValue || "Kyiv"}&appid=${API_KEY}&cnt=8`)
    .then((response) => response.json())
    .then((data) => {
      displayCurrentWeather(data);
    })
    .catch((e) => {
      console.log("->->->GET WEATHER DATA ERROR<-<-<-\n", e);
      TAB1.innerHTML = NOT_FOUND_SECTION;
    });
  fetch(`${API_FORECAST}?q=${inputValue || "Kyiv"}&appid=${API_KEY}`)
    .then((response) => response.json())
    .then((data) => {
      displayForecastWeather(data);
    })
    .catch((e) => {
      console.log("->->->GET WEATHER DATA ERROR<-<-<-\n", e);
      TAB2.innerHTML = NOT_FOUND_SECTION;
    });
};

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

function displayCurrentWeather(data) {
  const currentWeather = data.list[0];
  const {
    city: { name, sunrise, sunset, timezone },
  } = data;
  const { main } = currentWeather;
  const { main: mainWeather, icon } = currentWeather.weather[0];
  const iconUrl = `http://openweathermap.org/img/w/${icon}.png`;

  const currentWeatherForecast = data.list.slice(1);

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
  createTable(currentWeatherForecast);
}

function displayForecastWeather(data) {
  TAB2.innerHTML = `
  <div class="h_stack" id="card_list">
    <div
      class="v_stack gap8 w288 bg_gray border_right_gray padding10x20 pointer hover"
    >
      <h5>TONIGHT</h5>
      <p class="color_gray">JUN 30</p>
      <img
        src="https://www.pngall.com/wp-content/uploads/2016/07/Sun-Download-PNG.png"
        width="100"
        height="100"
        alt=""
      />
      <p class="fs_l color_black">36°C</p>
      <p class="color_gray">Clear, Warm</p>
    </div>
    <div
      class="v_stack gap8 w288 bg_gray border_right_gray padding10x20 pointer hover"
    >
      <h5>TONIGHT</h5>
      <p class="color_gray">JUN 30</p>
      <img
        src="https://www.pngall.com/wp-content/uploads/2016/07/Sun-Download-PNG.png"
        width="100"
        height="100"
        alt=""
      />
      <p class="fs_l color_black">36°C</p>
      <p class="color_gray">Clear, Warm</p>
    </div>
    <div
      class="v_stack gap8 w288 bg_gray border_right_gray padding10x20 pointer hover"
    >
      <h5>TONIGHT</h5>
      <p class="color_gray">JUN 30</p>
      <img
        src="https://www.pngall.com/wp-content/uploads/2016/07/Sun-Download-PNG.png"
        width="100"
        height="100"
        alt=""
      />
      <p class="fs_l color_black">36°C</p>
      <p class="color_gray">Clear, Warm</p>
    </div>
    <div
      class="v_stack gap8 w288 bg_gray border_right_gray padding10x20 pointer hover"
    >
      <h5>TONIGHT</h5>
      <p class="color_gray">JUN 30</p>
      <img
        src="https://www.pngall.com/wp-content/uploads/2016/07/Sun-Download-PNG.png"
        width="100"
        height="100"
        alt=""
      />
      <p class="fs_l color_black">36°C</p>
      <p class="color_gray">Clear, Warm</p>
    </div>
    <div
      class="v_stack gap8 w288 bg_gray border_right_gray padding10x20 pointer hover"
    >
      <h5>TONIGHT</h5>
      <p class="color_gray">JUN 30</p>
      <img
        src="https://www.pngall.com/wp-content/uploads/2016/07/Sun-Download-PNG.png"
        width="100"
        height="100"
        alt=""
      />
      <p class="fs_l color_black">36°C</p>
      <p class="color_gray">Clear, Warm</p>
    </div>
  </div>
  <div class="mt10 bg_white padding10x20 v_stack gap16">
    <div class="current_weather_hourly__header">
      <h3>HOURLY</h3>
    </div>
    <table class="custom-table">
      <tr>
        <th>Sunday</th>
        <td>
        <p>7pm</p>
          <img
        src="https://www.pngall.com/wp-content/uploads/2016/07/Sun-Download-PNG.png"
        width="30"
        height="30"
        alt=""
      />
        </td>
        <td>cell 2</td>
        <td>cell 3</td>
        <td>cell 4</td>
        <td>cell 5</td>
      </tr>
      <tr>
        <th>Forecast</th>
        <td>Sunny</td>
        <td>Sunny</td>
        <td>Sunny</td>
        <td>Sunny</td>
        <td>Sunny</td>
      </tr>
      <tr>
        <th>Temp</th>
        <td>cell 1</td>
        <td>cell 2</td>
        <td>cell 3</td>
        <td>cell 4</td>
        <td>cell 5</td>
      </tr>
      <tr>
        <th>RealFeel</th>
        <td>cell 1</td>
        <td>cell 2</td>
        <td>cell 3</td>
        <td>cell 4</td>
        <td>cell 5</td>
      </tr>
      <tr>
        <th>Wind (km/h)</th>
        <td>cell 1</td>
        <td>cell 2</td>
        <td>cell 3</td>
        <td>cell 4</td>
        <td>cell 5</td>
      </tr>
    </table>
  </div>`;
  createCardList(data);
}

function normalizedTem(temp) {
  return `${(temp - 273.15).toFixed()}°C`;
}

function formatUnixTimestampAndOutputTimezone(unixTimestamp) {
  const date = new Date(unixTimestamp * 1000); // Преобразуем в миллисекунды
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const period = hours >= 12 ? "PM" : "AM";
  const normalizedHours = hours % 12 || 12;
  const normalizedMinutes = minutes < 10 ? `0${minutes}` : minutes;
  const formattedTime = `${normalizedHours}:${normalizedMinutes} ${period}`;
  return formattedTime;
}

function formatUnixTimestamp(unixTimestamp) {
  const date = new Date(unixTimestamp * 1000); // Преобразуем в миллисекунды
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const normalizedHours = hours % 12 || 12;
  const normalizedMinutes = minutes < 10 ? `0${minutes}` : minutes;
  return `${normalizedHours}:${normalizedMinutes}`;
}

function createTable(list) {
  const CURRENT_WEATHER_TABLE = document.getElementById(
    "current_weather_table",
  );

  const titles = ["Sunday", "Forecast", "Temp", "RealFeel", "Wind (km/h)"];

  const headerRow = document.createElement("tr");
  for (const title of titles) {
    const th = document.createElement("th");
    th.textContent = title;
    headerRow.appendChild(th);
  }

  CURRENT_WEATHER_TABLE.appendChild(headerRow);

  for (const forecast of list) {
    const row = document.createElement("tr");

    const tdTimeWithIcon = document.createElement("td");
    const iconImg = document.createElement("img");
    const timeP = document.createElement("p");
    const iconUrl = `http://openweathermap.org/img/w/${forecast.weather[0].icon}.png`;
    iconImg.src = iconUrl;
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
  console.log(data)
  const CARD_LIST = document.getElementById("card_list");
  // <div
  //     className="v_stack gap8 w288 bg_gray border_right_gray padding10x20 pointer hover"
  // >
  //   <h5>TONIGHT</h5>
  //   <p className="color_gray">JUN 30</p>
  //   <img
  //       src="https://www.pngall.com/wp-content/uploads/2016/07/Sun-Download-PNG.png"
  //       width="100"
  //       height="100"
  //       alt=""
  //   />
  //   <p className="fs_l color_black">36°C</p>
  //   <p className="color_gray">Clear, Warm</p>
  // </div>
  const cardWrapper = document.createElement("div");
  cardWrapper.classList.add("v_stack");
  cardWrapper.classList.add("gap8");
  cardWrapper.classList.add("w288");
  cardWrapper.classList.add("bg_gray");
  cardWrapper.classList.add("border_right_gray");
  cardWrapper.classList.add("padding10x20");
  cardWrapper.classList.add("pointer");
  cardWrapper.classList.add("hover");

  const title = document.createElement("h5");
  const dataP = document.createElement("p");
  dataP.classList.add("color_gray");
  const img = document.createElement("img");
  const temp = document.createElement("p");
  temp.classList.add("fs_l");
  temp.classList.add("color_black");
  const forecast = document.createElement("p");
  forecast.classList.add("color_gray");

  title.innerText = "TONIGHT";
  dataP.innerText = "JUN 30";
  img.src = "";
  img.width = 100;
  img.height = 100;
  temp.innerText = "36°C";
  forecast.innerText = "Clear, Warm";

  cardWrapper.appendChild(title);
  cardWrapper.appendChild(dataP);
  cardWrapper.appendChild(img);
  cardWrapper.appendChild(temp);
  cardWrapper.appendChild(forecast);
  CARD_LIST.appendChild(cardWrapper);
}
