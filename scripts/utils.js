export function groupDataByDay(data) {
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

export function calculateAverageTemp(forecasts) {
    const totalTemp = forecasts.reduce(
        (sum, forecast) => sum + forecast.main.temp,
        0,
    );
    return totalTemp / forecasts.length;
}

export function formatDayOfWeek(inputDate) {
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

export function normalizedTem(temp) {
    return `${(temp - 273.15).toFixed()}°C`;
}

export function formatUnixTimestampAndOutputTimezone(unixTimestamp) {
    const date = new Date(unixTimestamp * 1000);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const period = hours >= 12 ? "PM" : "AM";
    const normalizedHours = hours % 12 || 12;
    const normalizedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    return `${normalizedHours}:${normalizedMinutes} ${period}`;
}

export function formatUnixTimestamp(unixTimestamp) {
    const date = new Date(unixTimestamp * 1000);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const normalizedHours = hours % 12 || 12;
    const normalizedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    return `${normalizedHours}:${normalizedMinutes}`;
}

export function formatDate(inputDate) {
    const months = [
        "JAN", "FEB", "MAR", "APR", "MAY", "JUN",
        "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"
    ];

    const date = new Date(inputDate);
    const monthIndex = date.getMonth();
    const day = date.getDate();

    return `${months[monthIndex]} ${day}`;
}