import { img } from "../config/env.js"
import { setButtonFoDeleteExpense } from "../services/expenses_service.js"

// Função responsavel por mostrar um toast de informação 
export function show_toast(msg, type = "info") {
    const check_div = document.getElementById("div_toast")
    const div = check_div ? check_div : document.createElement("div")
    const toast_options = `<div id="manager_toast" class="toast" role="alert" aria-live="assertive" aria-atomic="true"><div class="toast-header"><img src="${img}" width="20vh" class="rounded me-2" alt="logo"><strong class="me-auto" id="toast_title"></strong><small>now</small><button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button></div><div class="toast-body" id="toast_msg"></div></div>`;

    div.id = "div_toast"
    div.innerHTML = toast_options;
    div.classList.add("toast-container", "position-fixed", "bottom-0", "end-0", "p-3");
    parent.document.body.appendChild(div);

    const manager_toast = parent.document.getElementById('manager_toast');
    
    const toastBootstrap = bootstrap.Toast.getOrCreateInstance(manager_toast);
    manager_toast.querySelector("#toast_msg").textContent = msg;

    switch(type){
        case "info":
            manager_toast.querySelector("#toast_title").textContent = "Hubbix Manager";
            manager_toast.classList.remove("text-bg-warning", "text-bg-danger");
        case "alert":
            manager_toast.querySelector("#toast_title").textContent = "Hubbix Manager - Alerta!";
            manager_toast.classList.add("text-bg-warning");
        case "danger":
            manager_toast.querySelector("#toast_title").textContent = "Hubbix Manager - Perigo!";
            manager_toast.classList.add("text-bg-danger");
    }
    toastBootstrap.show();
}

// Função responsavel por ligar/desligar o carregamento
export function is_loading(loading = true) {
    const div_loading = document.getElementById("divLdg") // Seta a variavel caso ja exista
    const divLdg = div_loading ? div_loading : document.createElement("div") // Caso nao existe, cria o DIVLDG
    divLdg.id = "divLdg" // Seta o id em toda instancia (Por garantia)

    if (loading) {
        divLdg.style.width = '100%';
        divLdg.style.height = '100%';
        divLdg.style.display = 'flex';
        divLdg.style.justifyContent = 'center';
        divLdg.style.alignItems = 'center';
        divLdg.style.position = 'absolute';
        divLdg.style.zIndex = "5000000000";
        divLdg.style.top = 0;
        divLdg.innerHTML = `<div class="loader"><div class="loader-square"></div><div class="loader-square"></div><div class="loader-square"></div><div class="loader-square"></div><div class="loader-square"></div><div class="loader-square"></div><div class="loader-square"></div></div>`;
        document.body.appendChild(divLdg);
    } 
    else { try{document.body.removeChild(divLdg)}catch{}; };
}

// Função nao primitiva para deixar a primeira letra maiuscula
export function capitalize(str) {
    str = str.toLowerCase()
    return str.charAt(0).toUpperCase() + str.slice(1)
};

// Tranforma uma string ou integer em BRL
export function to_real(valor) {
    return valor.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })
}

// Função para troca de tela
export function change_screen(screen, el=null) {
    const others = parent.document.querySelectorAll('.menu-item');
    others.forEach(element => {
        element.style.background = null;
        element.style.color = '#fff';
    });
    
    if (el) {
        el.style.background = "rgba(41, 201, 108, 0.08)";
        el.style.color = '#2ecc71';
        el.style.boxShadow = "inset 0 0 0 1px #2ecc71aa, 0 0 6px #2ecc7190;";
        el.style.borderRadius = "30px";
    };

    const frame = parent.document.getElementById('frame_screen');
    sessionStorage.setItem('frame', `../pages/${screen}.html`);
    frame.src = `../pages/${screen}.html`;
}

// Função para restaurar a tela após reload
export function restore_screen(change_element=true) {
    const last_frame = sessionStorage.getItem('frame') || "" // Obtém o utlimo frame utilizado
    const iframe = parent.document.getElementById('frame_screen') // Obtem o IFRAME
    const isPage = window.location.pathname === last_frame.replace("..", "") // Confirma se ja esta na pagina
    
    if (last_frame && iframe && !isPage) { // Confirma se encontrou o frame e o widget
        const frameText = last_frame
        .replace('/', '')
        .replace('../', '')
        .replace('.html', '')
        .split("/")[1]; // Separa somete o pathname correto e necessário

        iframe.src = last_frame; // Seta o frame ao Iframe
        const element = parent.document.querySelector(`.menu-${frameText}`)
        if (element && change_element) {
            element.style.background = "rgba(41, 201, 108, 0.08)";
            element.style.color = '#2ecc71';
            element.style.borderRadius = "30px";
            element.style.boxShadow = "inset 0 0 0 1px #2ecc71aa, 0 0 6px #2ecc7190;";
        };
    };
};

export function create_modal(title, body, center = 'modal-dialog-centered') {
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
};

export function create_table(element, data, columns = [], limit = 5) {
    const grid = new gridjs.Grid({
        search: true, // Pesquisa das colunas
        pagination: {
            limit: limit,
        }, // Paginação padrao
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
                "results": "resultados"
            }
        }
    });

    grid.render(element);
    grid.updateConfig({ data: data }).forceRender();
    setButtonFoDeleteExpense();
    return grid;
};