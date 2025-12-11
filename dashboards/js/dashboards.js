function welcome() {
    const welcome_txt = document.getElementById("welcome_txt"); // Obtem o arquivo do texto
    if (welcome_txt) {
        const hora = parseInt(new Date().toLocaleTimeString("pt-br", { hour: "numeric" })); // Obtem a hora atual em Integer
        let welcome_str;

        if (hora >= 0 && hora < 12) { welcome_str = "Bom dia" }
        else if (hora >= 12 && hora < 19) { welcome_str = "Boa tarde" }
        else { welcome_str = "Boa noite" }

        welcome_txt.textContent = `${welcome_str} ${capitalize(display_name)}, bem vindo!`
    }
}

async function info_person() {
    const res = await get_person()
    if (res) {
        const img = encodeURIComponent(res.img)
        const path = `${server}/api/files/img/manager/${img}`

        const person_img = document.getElementById("person")
        person_img.style.backgroundImage = `url("${path}")`

        const person_name = document.getElementById("person_name")
        person_name.textContent = display_name

        const person_perm = document.getElementById("person_perm")
        person_perm.textContent = perm

    }
}

async function get_infos() {
    const req = await request("dashboards/")
    const res = await req.json()
    
    const div_goals = document.getElementById("div_goal")
    if (div_goals) {
        const pgmes = create_progress_bar("Vendas Mes", res.total_mes, res.meta_mes)
        const pgdia = create_progress_bar("Vendas Dia", res.total_dia, res.meta_dia)

        div_goals.appendChild(pgmes)
        div_goals.appendChild(pgdia)
    }

    const person_sales = document.getElementById("person_sales")
    person_sales.textContent = to_real(res.func_vendas)

}

function create_progress_bar(title, valor_atual, meta, percent = null) {
    const div = document.createElement("div")
    div.classList.add("d-flex", "align-items-center", "justify-content-start", "gap-4")

    // Titulo da barra
    const spn_title = document.createElement("span")
    spn_title.classList.add("fs-5")
    spn_title.textContent = title

    // Div da Progress Bar
    const progress_bar = document.createElement("div")
    progress_bar.classList.add("progress", "flex-grow-1")
    progress_bar.role = "progressbar"
    progress_bar.style.height = "20px"
    const value_percent = (valor_atual * 100) / meta

    progress_bar.setAttribute("aria-value-now", valor_atual)
    progress_bar.setAttribute("aria-value-min", 0)
    progress_bar.setAttribute("aria-value-max", meta)

    // Barra de progresso em si
    const progress = document.createElement("div")
    progress.classList.add("progress-bar", "text-bg-success", "fs-6", "text-truncate")
    progress.textContent = to_real(valor_atual)
    progress.style.width = value_percent + "%"
    progress_bar.appendChild(progress)

    // Titulo da Meta
    const spn_goal = document.createElement("span")
    spn_goal.textContent = to_real(meta)

    div.appendChild(spn_title)
    div.appendChild(progress_bar)
    div.appendChild(spn_goal)

    return div
}