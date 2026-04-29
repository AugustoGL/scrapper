const BASE_URL = "http://localhost:8000";

function getToken() {
    return new Promise(resolve => {
        chrome.storage.local.get("access_token", result => {
            resolve(result.access_token ?? null);
        });
    });
}

function getTables() {
    return getToken().then(token => {
        console.log("Token:", token);
        return fetch(`${BASE_URL}/api/v1/tables/`, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
        }).then(res => {
            if (!res.ok) throw new Error("Error al cargar tablas");
            return res.json();
        });
    });
}