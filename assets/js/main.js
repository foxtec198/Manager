const div = document.createElement("div"); // Cria um elemento DIV para o Toast
const img = "assets/img/fav.png"; // Define o caminho da imagem padrão, pode ser Utilizado com links também
// HTML do Toast em si com MSG, IMG e Title
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
document.body.appendChild(div);

// Cria um modal personalizado
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

// Cria um toast para exibir uma mensagem
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

function request(url, method, data, type="manager") {
    

}