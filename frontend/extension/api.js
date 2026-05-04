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

function extractData(html, instruction, tableId) {
    return getToken().then(token => {
        return fetch(`${BASE_URL}/api/v1/tables/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify({ html: html, instruction: instruction, table_id: tableId }),
        }).then(res => {
            return res.json().then(data => ({ ok: res.ok, data: data }));

        });
    });
}