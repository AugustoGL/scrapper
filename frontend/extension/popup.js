document.addEventListener("DOMContentLoaded", function () {

    var loginView   = document.getElementById("login-view");
    var mainView    = document.getElementById("main-view");
    var btnLogin    = document.getElementById("btn-login");
    var btnLogout   = document.getElementById("btn-logout");
    var loginError  = document.getElementById("login-error");
    var loginErrTxt = document.getElementById("login-error-text");
    var instruction = document.getElementById("instruction");
    var tableSelect = document.getElementById("table-select");
    var btnExtract  = document.getElementById("btn-extract");
    var btnHtml     = document.getElementById("btn-html");
    var logBox      = document.getElementById("log");
    var logText     = document.getElementById("log-text");
    var tabs        = document.querySelectorAll(".tab");
    var tabContents = document.querySelectorAll(".tab-content");

    function setLog(text, state) {
        logBox.className = "log-box " + (state || "");
        logText.textContent = text;
    }

    function checkForm() {
        btnExtract.disabled = !instruction.value.trim() || !tableSelect.value;
    }
    instruction.addEventListener("input", checkForm);
    tableSelect.addEventListener("change", checkForm);

    function loadTables() {
        getTables().then(function (tables) {
            tableSelect.innerHTML = '<option value="">— Sin tabla seleccionada —</option>';
            tables.forEach(function (t) {
                var opt = document.createElement("option");
                opt.value = t.id_table;
                opt.textContent = t.name + "  —  " + t.columns.map(function (c) { return c.name; }).join(", ");
                tableSelect.appendChild(opt);
            });
        }).catch(function () {
            setLog("Error al cargar tablas.", "err");
        });
    }

    function showLogin() {
        loginView.classList.remove("hidden");
        mainView.classList.add("hidden");
        btnLogout.classList.add("hidden");
    }

    function showMain() {
        loginView.classList.add("hidden");
        mainView.classList.remove("hidden");
        btnLogout.classList.remove("hidden");
        loadTables();
    }

    chrome.storage.local.get("access_token", function (result) {
        if (result.access_token) {
            showMain();
        } else {
            showLogin();
        }
    });

    btnLogin.addEventListener("click", function () {
        var email    = document.getElementById("login-email").value.trim();
        var password = document.getElementById("login-password").value;
        if (!email || !password) return;

        btnLogin.disabled = true;
        loginError.classList.add("hidden");

        fetch("http://localhost:8000/api/v1/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: email, password: password }),
        })
        .then(function (res) {
            return res.json().then(function (data) { return { ok: res.ok, data: data }; });
        })
        .then(function (result) {
            if (!result.ok) throw new Error(result.data.detail || "Error al ingresar");
            chrome.storage.local.set({ access_token: result.data.access_token }, function () {
                showMain();
            });
        })
        .catch(function (err) {
            loginErrTxt.textContent = err.message;
            loginError.classList.remove("hidden");
            btnLogin.disabled = false;
        });
    });

    btnLogout.addEventListener("click", function () {
        chrome.storage.local.remove("access_token", function () {
            showLogin();
        });
    });

    btnExtract.addEventListener("click", function () {
        btnExtract.classList.add("loading");
        setLog("Capturando página...", "warn");
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabsList) {
            var tab = tabsList[0];
            chrome.tabs.sendMessage(tab.id, { type: "GET_HTML" }, function (response) {
                if (!response || !response.html) {
                    setLog("Error al capturar la página.", "err");
                    btnExtract.classList.remove("loading");
                    return;
                }
                var cleaned = cleanHtml(response.html);
                var blob = new Blob([cleaned], { type: "text/html" });
                chrome.tabs.create({ url: URL.createObjectURL(blob) });
                setLog("HTML limpio abierto en nueva pestaña.", "ok");
                btnExtract.classList.remove("loading");
            });
        });
    });

    btnHtml.addEventListener("click", function () {
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabsList) {
            var tab = tabsList[0];
            chrome.tabs.sendMessage(tab.id, { type: "GET_HTML" }, function (response) {
                if (!response || !response.html) return;
                var escaped = response.html
                    .replace(/&/g, "&amp;")
                    .replace(/</g, "&lt;")
                    .replace(/>/g, "&gt;");
                var html = "<!DOCTYPE html><html><head><meta charset='UTF-8'><title>HTML - " + tab.title + "</title>"
                    + "<style>body{margin:0;background:#1e1e1e;color:#d4d4d4;font-family:monospace;font-size:12px;line-height:1.7;padding:20px;white-space:pre-wrap;word-break:break-all;}</style>"
                    + "</head><body>" + escaped + "</body></html>";
                var blob = new Blob([html], { type: "text/html" });
                chrome.tabs.create({ url: URL.createObjectURL(blob) });
            });
        });
    });

    tabs.forEach(function (tab) {
        tab.addEventListener("click", function () {
            tabs.forEach(function (t) { t.classList.remove("active"); });
            tab.classList.add("active");
            tabContents.forEach(function (c) { c.classList.add("hidden"); });
            var target = document.getElementById("tab-" + tab.dataset.tab);
            if (target) target.classList.remove("hidden");
        });
    });

});

function cleanHtml(html) {
    var parser = new DOMParser();
    var doc = parser.parseFromString(html, "text/html");
    var remove = [
        "script", "style", "head", "link", "meta", "title",
        "nav", "footer", "header", "aside", "noscript", "iframe",
        "svg", "canvas", "form", "button", "input", "select", "textarea",
        "[role='navigation']", "[role='banner']", "[role='contentinfo']",
        ".navbar", ".nav", ".header", ".footer", ".sidebar", ".menu",
        ".cookie", ".ad", ".ads", ".modal", ".overlay", ".popup",
        ".breadcrumb", ".pagination", ".toast", ".notification"
    ];
    doc.querySelectorAll(remove.join(",")).forEach(function (el) { el.remove(); });
    doc.querySelectorAll("*").forEach(function (el) {
        ["class", "id", "style", "onclick", "onload", "data-v",
            "aria-label", "aria-hidden", "tabindex", "role"].forEach(function (attr) {
                el.removeAttribute(attr);
            });
        Array.from(el.attributes).forEach(function (a) {
            if (a.name.startsWith("data-") || a.name.startsWith("on")) {
                el.removeAttribute(a.name);
            }
        });
    });
    return doc.body.innerHTML;
}