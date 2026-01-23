// ================================================ Define a api e a baseURL
// var server = "https://api.hubbix.com.br"
const server = "http://localhost:9560"
const api = server + "/api/manager/"

// ================================================ VARS
const div = document.createElement("div"); // Cria um elemento DIV para o Toast
const img = "../assets/img/fav.png"; // Define o caminho da imagem padrão, pode ser Utilizado com links também
const cr = sessionStorage.getItem("cr")
const gc = sessionStorage.getItem("gc")
const perm = sessionStorage.getItem("perm")
const display_name = sessionStorage.getItem("display_name")
const mat = sessionStorage.getItem("matricula")
const config_pecas = sessionStorage.getItem("peca") == "true"
const config_estoque = sessionStorage.getItem("estoque") == "true"
const spinner = '<span id="spin_ldg" class="spinner-border spinner-border-sm text-light" role="status"></span>'
const divLdg = document.createElement('div')
const root_style = getComputedStyle(document.body)
const primary = root_style.getPropertyValue("--primary").trim()

// ================================================ ICONS
const icon_trash = "<i class='bi bi-trash-fill'></i>"
const icon_eye = '<i class="bi bi-eye"></i>'
const icon_cart = '<i class="bi bi-cart4"></i>'
const icon_rocket = "<i class='bi bi-rocket-takeoff-fill'></i>"
const icon_graph_up = '<i class="bi bi-graph-up-arrow"></i>'
const icon_graph_down = '<i class="bi bi-graph-down-arrow"></i>'
const icon_engine = '<i class="bi bi-engine"></i>'

// ================================================ HTML do Toast em si com MSG, IMG e Title
// if (window.location.pathname != "/") { if (!cr || !gc || !perm) { window.location = "/" } }

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

function is_decoration(state = true) {
    const colors = [
        "#1d351d",
        "#8b081d"
    ];
    const adorno = parent.document.getElementById("adorno")

    if (adorno && state) {
        adorno.style.display = "flex"
        datas_comemorativas('Feliz Natal 🎅🏼🌲', 'Boas festas 🍾🥂', colors);
    } else {
        adorno.style.display = "none"
    }
}

// ================================================ Cria um modal personalizado
function create_modal(title, body, center = 'modal-dialog-centered') {
    const modal = document.createElement("div")
    modal.classList.add("modal", "fade")
    modal.tabIndex = "-1"
    modal.ariaHidden = true

    const modal_dialog = document.createElement("div")
    modal_dialog.classList.add("modal-dialog",)
    if (center) { modal_dialog.classList.add("modal-dialog-centered") }

    const modal_content = document.createElement("div")
    modal_content.classList.add("modal-content")

    if (title) {
        const modal_header = document.createElement("div")
        modal_header.classList.add("modal-header")
        modal_header.appendChild(title)
        modal_content.appendChild(modal_header)
    }

    const modal_body = document.createElement("div")
    modal_body.classList.add("modal-body", "p-5")
    modal_body.appendChild(body)
    modal_content.appendChild(modal_body)

    modal.appendChild(modal_dialog)
    modal_dialog.appendChild(modal_content)

    return new bootstrap.Modal(modal, { 'show': true, 'backdrop': 'static' })
}

function create_table(id, data, columns = []) {
    const grid = new gridjs.Grid({
        search: true, // Pesquisa das colunas
        pagination: true, // Paginação padrao
        columns: columns, // Colunas da Tabela
        data: data, // Dados da Tabela
        language: { // Seta a tradução da tabela
            search: {
                "placeholder": "Buscar..."
            },
            pagination: {
                "previous": "Anterior",
                "next": "Próximo",
                "showing": "Mostrando",
                "to": "até",
                "of": "de",
                "results": "despesas"
            }
        }
    })
    grid.render(document.getElementById(id));
    return grid
}

// ================================================ Cria um toast para exibir uma mensagem
function show_toast(msg, type = "info") {
    const manager_toast = parent.document.getElementById('manager_toast')
    const divMsg = parent.document.getElementById("toast_msg")

    if (type == "info") {
        parent.document.getElementById("toast_title").textContent = "Hubbix Manager"
        manager_toast.classList.remove("text-bg-warning", "text-bg-danger")
    } else if (type == "alert") {
        parent.document.getElementById("toast_title").textContent = "Hubbix Manager - Alerta!"
        manager_toast.classList.add("text-bg-warning")
    } else if (type == "danger") {
        parent.document.getElementById("toast_title").textContent = "Hubbix Manager - Perigo!"
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
    headers.append("Access-Token", sessionStorage.getItem("access_token"))
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
function change_screen(screen, t = null) {
    others = parent.document.querySelectorAll('.menu-item')
    others.forEach(element => {
        element.style.background = null
        element.style.color = '#fff';
    });
    if (t) {
        t.style.background = "rgba(41, 201, 108, 0.08)";
        t.style.color = '#2ecc71';
        t.style.boxShadow = "inset 0 0 0 1px #2ecc71aa, 0 0 6px #2ecc7190;"
        t.style.borderRadius = "30px"
    }

    frame = parent.document.getElementById('frame_screen')
    sessionStorage.setItem('frame', `../pages/${screen}.html`)
    frame.src = `../pages/${screen}.html`
}

// ================================================ Recupera a tela mesmo que atualize a pagina
function restore_screen() {
    frame = sessionStorage.getItem('frame')
    frameWidget = parent.document.getElementById('frame_screen')
    if (frame) {
        txt1 = frame.replace('/', '')
        txt1 = frame.replace('../', '')
        txt2 = txt1.replace('.html', '').split("/")[1]

        frameWidget.src = frame
        const t = parent.document.querySelector(`.menu-${txt2}`)
        if (t) {
            t.style.background = "rgba(41, 201, 108, 0.08)";
            t.style.color = '#2ecc71';
            t.style.borderRadius = "30px"
            t.style.boxShadow = "inset 0 0 0 1px #2ecc71aa, 0 0 6px #2ecc7190;"
        }
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

// ================================================ Loading
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

function is_loading(loading = true) {
    if (loading) {
        divLdg.hidden = ''
        divLdg.style.width = '100%'
        divLdg.style.height = '100%'
        divLdg.style.display = 'flex'
        divLdg.style.justifyContent = 'center'
        divLdg.style.alignItems = 'center'
        divLdg.style.position = 'absolute'
        divLdg.style.zIndex = "5000000000"
        divLdg.style.top = 0
        // divLdg.style.background = '#2B3035'
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
    } else { divLdg.hidden = 'none' }
}

function closeLdg() {
    divLdg.hidden = 'none'
}

// ================================================ Seta os dados da loja na base
async function set_store() {
    const res = await get_store() // Obtem os dados da loja

    // Seta o nome da loja
    const label = document.getElementById('nomeLoja')
    label.textContent = res.loja.nome_loja
    label.classList.remove('placeholder')

    // Seta imagem da loja ou do Hubbix
    const img = document.getElementById('logoBase')
    img.src = `${server}/api/files/img/manager/${encodeURIComponent(res.logo)}`
    img.classList.remove('placeholder')
}

// ================================================ REQUESTS GERAIS
async function get_store() { // Pega os dados da loja
    const req = await request("lojas", "GET", null, "general")
    const res = await req.json()
    if (req.ok) { return res }
    else { show_toast(res, "alert"); return false }
}

async function get_person() { // Obtem os dados do usuario logado
    const req = await request(`funcionarios?mat=${mat}`, "GET")
    const res = await req.json()
    if (req.ok) { return res }
    else { return false }
}

class CardCarousel {
    constructor(root) {
        this.root = root
        this.track = root.querySelector('.card-carousel-track')
        this.views = root.querySelectorAll('.card-view')
        this.index = 0

        root.querySelector('.next')?.addEventListener('click', () => this.next())
        root.querySelector('.prev')?.addEventListener('click', () => this.prev())
    }

    update() {
        this.track.style.transform = `translateX(-${this.index * 100}%)`
    }

    next() {
        if (this.index < this.views.length - 1) {
            this.index++
            this.update()
        }
    }

    prev() {
        if (this.index > 0) {
            this.index--
            this.update()
        }
    }
}
