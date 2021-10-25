function saveOptions(e) {
    e.preventDefault();
    browser.storage.sync.set({
        APIKey: document.querySelector("#APIKey").value
    });
}

function restoreOptions() {

    function setCurrentChoice(result) {
        document.querySelector("#APIKey").value = result.APIKey || "";
    }

    function onError(error) {
        console.log(`Error: ${error}`);
    }

    let getting = browser.storage.sync.get("APIKey");
    getting.then(setCurrentChoice, onError);
}

document.addEventListener("DOMContentLoaded", restoreOptions);
document.querySelector("form").addEventListener("submit", saveOptions);
