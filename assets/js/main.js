// ================================================ Define a api e a baseURL
// var server = "https://api.hubbix.com.br"
// const server = "http://0.0.0.0:9560"
const server = "http://10.0.0.75:9560"
const api = server + "/api/manager/"

// ================================================ VARS
const div = document.createElement("div"); // Cria um elemento DIV para o Toast
const img = "assets/img/fav.png"; // Define o caminho da imagem padrão, pode ser Utilizado com links também
const cr = sessionStorage.getItem("cr")
const gc = sessionStorage.getItem("gc")
const perm = sessionStorage.getItem("perm")
const display_name = sessionStorage.getItem("display_name")
const mat = sessionStorage.getItem("matricula")
const config_pecas = sessionStorage.getItem("peca") == "true"
const config_estoque = sessionStorage.getItem("estoque") == "true"
const spinner = '<span id="spin_ldg" class="spinner-border spinner-border-sm text-light" role="status"></span>'
const divLdg = document.createElement('div')

// ================================================ HTML do Toast em si com MSG, IMG e Title
if (window.location.pathname != "/") { if (!cr || !gc || !perm) { window.location = "/" } }

// ================================================ HTML do Toast em si com MSG, IMG e Title
const options = `
    <div id="manager_toast" class="toast" role="alert" aria-live="assertive" aria-atomic="true">
        <div class="toast-header">
            <img src="${img}" width="20vh" class="rounded me-2" alt="logo">
            <strong class="me-auto" id="toast_title"></strong>
            <small>now</small>
            <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
        <div class="toast-body" id="toast_msg"></div>
    </div>
`;
div.classList.add("toast-container", "position-fixed", "bottom-0", "end-0", "p-3");
div.innerHTML = options;
parent.document.body.appendChild(div);

// ================================================ Cria um modal personalizado
function create_modal(id, title, body, center = 'modal-dialog-centered') {
    container = document.createElement('div')
    const modalHtml = `
        <div class="modal fade" id="${id}" tabindex="-1" aria-labelledby="modalLabel" aria-hidden="true">
            <div class="modal-dialog ${center}">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">${title}</h5>
                </div>
                <div class="modal-body">
                    ${body}
                </div>
            </div>
            </div>
        </div>`;
    container.innerHTML = modalHtml
    document.body.appendChild(container)
    return new bootstrap.Modal(document.getElementById(id), { 'show': true, 'backdrop': 'static' })
}

// ================================================ Cria um toast para exibir uma mensagem
function show_toast(msg, type = "info") {
    const manager_toast = document.getElementById('manager_toast')
    const divMsg = document.getElementById("toast_msg")

    if (type == "info") {
        document.getElementById("toast_title").textContent = "Hubbix Manager"
    } else if (type == "alert") {
        document.getElementById("toast_title").textContent = "Hubbix Manager - Alerta!"
        manager_toast.classList.add("text-bg-warning")
    } else if (type == "danger") {
        document.getElementById("toast_title").textContent = "Hubbix Manager - Perigo!"
        manager_toast.classList.add("text-bg-danger")
    } else {
        console.warn("Tipo de toast não suportado")
        return
    }

    divMsg.textContent = msg
    const toastBootstrap = bootstrap.Toast.getOrCreateInstance(manager_toast)
    toastBootstrap.show()
}

// ================================================ Request generalizado
function request(path, method = "GET", data = null, type = null) {
    const headers = new Headers();
    headers.append("cr", cr)
    headers.append("gc", gc)
    headers.append("Content-Type", "application/json")

    var options = { method: method, headers: headers, };
    if (data) { options["body"] = JSON.stringify(data) }

    switch (type) {
        case "general": return fetch(`${server}/api/${path}`, options);
        default: return fetch(`${api}${path}`, options)
    }
}

// ================================================ Função para colocar adorno das datas comemorativas
function datas_comemorativas(msg, data, bgs = ["#fff", "#777"], fgs = ["#fff", "#fff"]) {
    if (document.getElementById("adorno")) {
        for (let i = 0; i < 100; i++) {
            var sp = document.createElement('span');
            sp.classList.add('badge', 'rounded-pill', 'px-4');
            sp.style.fontSize = '14px';
            sp.textContent = data;
            sp.style.background = bgs[0];
            sp.style.color = fgs[0];

            var sp2 = document.createElement('span');
            sp2.classList.add('badge', 'rounded-pill', 'px-4');
            sp2.style.fontSize = '14px';
            sp2.textContent = msg;
            sp2.style.background = bgs[1];
            sp2.style.color = fgs[1];

            document.getElementById('mq').appendChild(sp2);
            document.getElementById('mq').appendChild(sp);
        }
    };
}

// ================================================ Troca e memoriza a screen
function change_screen(screnn, t = null) {
    others = parent.document.querySelectorAll('.menu-item')
    others.forEach(element => {
        element.style.background = null
        element.style.color = '#fff';
    });
    if (t) {
        t.style.background = "rgba(41, 201, 108, 0.08)";
        t.style.color = '#2ecc71';
        t.style.boxShadow = "inset 0 0 0 1px #2ecc71aa, 0 0 6px #2ecc7190;"
    }
    frame = parent.document.getElementById('frame_screen')
    sessionStorage.setItem('frame', `/manager/${screnn}.html`)
    frame.src = `/manager/${screnn}.html`
}

// ================================================ Recupera a tela mesmo que atualize a pagina
function restore_screen() {
    frame = sessionStorage.getItem('frame')
    frameWidget = parent.document.getElementById('frame_screen')

    if (frame) {
        txt1 = frame.replace('/manager/', '')
        txt2 = txt1.replace('.html', '')
        frameWidget.src = frame
        const t = parent.document.querySelector(`.menu-${txt2}`)
        t.style.background = "rgba(41, 201, 108, 0.08)";
        t.style.color = '#2ecc71';
        t.style.boxShadow = "inset 0 0 0 1px #2ecc71aa, 0 0 6px #2ecc7190;"
    }
}

// ================================================ Confirma a permissão e desativa oq for necessário
function confer_perm() {
    if (perm === 'USER') {
        blocks = [
            "relatorios",
            "config",
            "caixa"
        ]
        blocks.forEach(item => {
            document.querySelectorAll(`.menu-${item}`).forEach(el => {
                el.remove()
            })
        })
    }

    if (config_pecas) {
        document.querySelectorAll('.menu-pecas').forEach(el => {
            el.hidden = ''
        })
    } else {
        document.querySelectorAll('.menu-pecas').forEach(el => {
            el.hidden = 'none'
        })
    }
}

// ================================================ Deixa somente a primeira letra maiuscula
function capitalize(string) {
    string = string.toLowerCase()
    return string.charAt(0).toUpperCase() + string.slice(1)
}

// ================================================ Transforma numero em real
function to_real(valor) {
    return valor.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })
}

// ================================================ Cria um Loading
function ldg() {
    divLdg.hidden = ''
    divLdg.style.width = '100%'
    divLdg.style.height = '100%'
    divLdg.style.display = 'flex'
    divLdg.style.justifyContent = 'center'
    divLdg.style.alignItems = 'center'
    divLdg.style.position = 'absolute'
    divLdg.style.zIndex = "5000000000"
    divLdg.style.top = 0
    divLdg.style.background = '#2B3035'
    divLdg.innerHTML = `
        <div class="loader">
        <div class="loader-square"></div>
        <div class="loader-square"></div>
        <div class="loader-square"></div>
        <div class="loader-square"></div>
        <div class="loader-square"></div>
        <div class="loader-square"></div>
        <div class="loader-square"></div>
        </div>`
    document.body.appendChild(divLdg)
}

// ================================================ Fecha o Loading
function closeLdg() {
    divLdg.hidden = 'none'
}

// ================================================ REQUESTS GERAIS
async function get_store() { // Pega os dados da loja
    const req = await request("lojas/", "GET", null, "general")
    const res = await req.json()
    if (req.ok) { return res }
    else { show_toast(res, "alert"); return false }
}

async function get_person() { // Obtem os dados do usuario logado
    const req = await request(`funcionarios/?mat=${mat}`, "GET")
    const res = await req.json()
    if (req.ok) { return res }
    else { return false }
}