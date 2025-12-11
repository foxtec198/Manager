// ================================================ Define a api e a baseURL
// var api = "https://api.hubbix.com.br"
var api = "http://0.0.0.0:9560"
var url = "/api/manager/"

// ================================================ VARS
const div = document.createElement("div"); // Cria um elemento DIV para o Toast
const img = "assets/img/fav.png"; // Define o caminho da imagem padrão, pode ser Utilizado com links também
const cr = sessionStorage.getItem("cr")
const gc = sessionStorage.getItem("gc")
const perm = sessionStorage.getItem("perm")
const config_pecas = sessionStorage.getItem("peca")

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
    </div>`;
div.classList.add("toast-container", "position-fixed", "bottom-0", "end-0", "p-3");
div.innerHTML = options;
document.body.appendChild(div);

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
function request(path, method, data, type = "manager") {
    var options = {
        method: method,
        headers: {
            'Content-Type': 'application/json',
            'cr': `${cr}`,
            'gc': `${gc}`
        },
        body: JSON.stringify(data)
    };
    switch (type) {
        case "general": fetch(api + "api/" + url, options)
        default: return fetch(api + url + path, options)
    }
}

// ================================================ Função para colocar adorno das datas comemorativas
function datas_comemorativas(msg, data){
    for (let i = 0; i < 100; i++){
            var sp = document.createElement('span')
            sp.classList.add('badge', 'rounded-pill', 'px-4')
            sp.style.background = '#ffc8dd'
            sp.style.color = '#333'
            sp.style.fontSize = '14px'
            sp.textContent = data
        
            var sp2 = document.createElement('span')
            sp2.classList.add('badge', 'rounded-pill', 'px-4')
            sp2.style.background = '#edede9'
            sp2.style.fontSize = '14px'
            sp2.style.color = '#333'
            sp2.textContent = msg
        
            document.getElementById('mq').appendChild(sp2)
            document.getElementById('mq').appendChild(sp)
    }
}

// ================================================ Troca e memoriza a screen
function change_screen(screnn, t=null){
    others = parent.document.querySelectorAll('.menu-item')
    others.forEach(element => {
        element.style.background = null
        element.style.color = '#fff';
    });
    if(t){
        t.style.background = "rgba(41, 201, 108, 0.08)";
        t.style.color = '#2ecc71';
        t.style.boxShadow = "inset 0 0 0 1px #2ecc71aa, 0 0 6px #2ecc7190;"
    }
    frame = parent.document.getElementById('frame_screen')
    sessionStorage.setItem('frame', `/manager/${screnn}.html`)
    frame.src = `/manager/${screnn}.html`
}

// ================================================ Recupera a tela mesmo que atualize a pagina
function restore_screen(){
    frame = sessionStorage.getItem('frame')
    frameWidget = parent.document.getElementById('frame_screen')
    
    if(frame){
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
function confer_perm(){
    if(perm === 'USER'){
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

    if(config_pecas){
        document.querySelectorAll('.menu-pecas').forEach(el => {
            el.hidden = ''
        })
    }else{
        document.querySelectorAll('.menu-pecas').forEach(el => {
            el.hidden = 'none'
        })
    }
}

// ================================================ REQUESTS GERAIS
async function get_loja() { // Pega os dados da loja
    req = await request('get_loja')
    res = await req.json()
    if(req.ok){
        var label = document.getElementById('nomeLoja')
        label.textContent = res['nome']
        label.classList.remove('placeholder')
        
        var img = document.getElementById('logoBase')
        if(res.logo == 'logo.png'){img.src = `${server}/img/${res['logo']}`}
        else{img.src = `${server}/img/manager/${res['logo']}`}
        img.classList.remove('placeholder')

    }
}