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