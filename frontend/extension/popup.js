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

    // Helper: obtiene el HTML de la pestaña activa.
    // Intenta primero con sendMessage; si el content script no está inyectado,
    // lo inyecta programáticamente y vuelve a intentarlo.
    function getPageHtml(tab, callback) {
        chrome.tabs.sendMessage(tab.id, { type: "GET_HTML" }, function (response) {
            if (chrome.runtime.lastError || !response || !response.html) {
                // Content script no estaba inyectado → inyectarlo ahora
                chrome.scripting.executeScript(
                    { target: { tabId: tab.id }, files: ["content.js"] },
                    function () {
                        if (chrome.runtime.lastError) {
                            callback(null);
                            return;
                        }
                        chrome.tabs.sendMessage(tab.id, { type: "GET_HTML" }, function (resp2) {
                            callback(resp2 && resp2.html ? resp2.html : null);
                        });
                    }
                );
            } else {
                callback(response.html);
            }
        });
    }

    btnExtract.addEventListener("click", function () {
        var instructionVal = instruction.value.trim();
        var tableId = tableSelect.value;
        if (!instructionVal || !tableId) return;

        btnExtract.disabled = true;
        btnExtract.classList.add("loading");
        setLog("Capturando página...", "warn");

        chrome.tabs.query({ active: true, currentWindow: true }, function (tabsList) {
            var tab = tabsList[0];
            getPageHtml(tab, function (html) {
                if (!html) {
                    setLog("Error al capturar la página.", "err");
                    btnExtract.classList.remove("loading");
                    btnExtract.disabled = false;
                    return;
                }

                var cleaned = cleanHtml(html);
                setLog("Extrayendo datos...", "warn");

                extractData(cleaned, instructionVal, tableId)
                    .then(function (result) {
                        if (!result.ok) throw new Error(result.data.detail || "Error al extraer");
                        console.log("Respuesta del backend:", result.data);
                        setLog("Extracción completada.", "ok");
                    })
                    .catch(function (err) {
                        setLog(err.message, "err");
                    })
                    .finally(function () {
                        btnExtract.classList.remove("loading");
                        btnExtract.disabled = false;
                    });
            });
        });
    });

    btnHtml.addEventListener("click", function () {
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabsList) {
            var tab = tabsList[0];
            getPageHtml(tab, function (html) {
                if (!html) return;
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

    // 1. Elementos que nunca aportan contenido útil
    var removeSelectors = [
        // Tags estructurales sin contenido dinámico
        "script", "style", "head", "link", "meta", "title",
        "nav", "footer", "header", "aside", "noscript", "iframe",
        "svg", "canvas", "form", "button", "input", "select", "textarea",
        "label", "video", "audio", "source", "track", "map", "area",
        // Roles ARIA de navegación/decoración
        "[role='navigation']", "[role='banner']", "[role='contentinfo']",
        "[role='dialog']", "[role='alertdialog']", "[role='tooltip']",
        // Clases comunes de ruido
        ".navbar", ".nav", ".header", ".footer", ".sidebar", ".menu",
        ".cookie", ".ad", ".ads", ".modal", ".overlay", ".popup",
        ".breadcrumb", ".pagination", ".toast", ".notification",
        ".newsletter", ".subscribe", ".login-incentive",
        // Elementos ocultos / inert (calendarios, dropdowns, etc.)
        "[inert]", "[hidden]", "[aria-hidden='true']",
        // Componentes específicos de SPAs de viajes (Despegar, etc.)
        "shopping-cart-component", "modals-container", "loader",
        "loyalty-switch", "loyalty-info", "loyalty-offer-info",
        "event-dispatcher"
    ];
    doc.querySelectorAll(removeSelectors.join(",")).forEach(function (el) {
        el.remove();
    });

    // 2. Limpiar TODOS los atributos excepto href, src, alt
    doc.querySelectorAll("*").forEach(function (el) {
        var attrs = Array.from(el.attributes);
        attrs.forEach(function (a) {
            var name = a.name.toLowerCase();
            if (name !== "href" && name !== "src" && name !== "alt") {
                el.removeAttribute(a.name);
            }
        });
    });

    // 3. Eliminar tags vacíos recursivamente (i, span, div, em, strong, p, ul, li, etc. sin contenido)
    var emptyTags = ["div", "span", "i", "em", "strong", "b", "p", "ul", "ol", "li", "a", "section", "article", "main"];
    var changed = true;
    while (changed) {
        changed = false;
        emptyTags.forEach(function (tag) {
            doc.querySelectorAll(tag).forEach(function (el) {
                // Vacío = sin texto ni hijos con contenido (ignorar whitespace)
                var text = el.textContent.trim();
                var hasImg = el.querySelector("img");
                var hasLink = el.tagName === "A" && el.getAttribute("href");
                if (!text && !hasImg && !hasLink) {
                    el.remove();
                    changed = true;
                }
            });
        });
    }

    // 4. Desempaquetar tags wrapper sin semántica (div, span sin atributos con un solo hijo)
    doc.querySelectorAll("div, span").forEach(function (el) {
        if (el.attributes.length === 0 && el.children.length === 1 && el.textContent.trim() === el.children[0].textContent.trim()) {
            el.replaceWith(el.children[0]);
        }
    });

    var result = doc.body.innerHTML;

    // 5. Eliminar comentarios HTML (incluyendo <!---->  de Angular)
    result = result.replace(/<!--[\s\S]*?-->/g, "");

    // 6. Colapsar whitespace excesivo
    result = result.replace(/\s{2,}/g, " ");
    result = result.replace(/>\s+</g, "><");
    result = result.trim();

    return result;
}