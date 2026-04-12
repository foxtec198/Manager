const init_report = new InitDashboard()

async function info_person() {
    request.path = `funcionarios?mat=${mat}`
    request.method = "GET"
    const res = await request.send()
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
    const res = await init_report.get(mat)
    const div_goals = document.getElementById("div_goal")

    if (div_goals) {
        div_goals.innerHTML = ''
        div_goals.classList.remove("align-items-center", "justify-content-center")

        const pgmes = create_progress_bar("Vendas Mes", res.real.mes, res.metas.mes)
        const pgdia = create_progress_bar("Vendas Dia", res.real.dia, res.metas.dia)
        const pgclients = create_progress_bar("Clientes", res.real.clientes, res.metas.clientes, false, true)

        div_goals.appendChild(pgmes)
        div_goals.appendChild(pgdia)
        div_goals.appendChild(pgclients)
    }

    const person_sales = document.getElementById("person_sales")
    person_sales.textContent = to_real(res.real.func)

    const ticket_goal = document.getElementById("ticket_goal")
    ticket_goal.textContent = "Meta - Ticket Médio: " + to_real(res.metas.ticket)

    const divBtns = document.createElement("div")
    divBtns.classList.add("d-flex", "gap-2")

    const btn = document.createElement("button")
    btn.classList.add("btn", "btn-lg", "btn-primary")
    btn.textContent = "Iniciar Venda."
    btn.addEventListener("click", function () { change_screen("sales/sales") })

    const btnOrder = document.createElement("button")
    btnOrder.classList.add("btn", "btn-lg", "btn-outline-primary")
    btnOrder.textContent = "Ordens de Serviço."
    btnOrder.addEventListener("click", function () { change_screen("orders/orders") })

    divBtns.appendChild(btn)
    divBtns.appendChild(btnOrder)
    document.getElementById("goals_btns").appendChild(divBtns)

    create_chart_payments(res.real.pagamentos)

}

function create_progress_bar(title, valor_atual, meta, percent = false, value = false) {
    const div = document.createElement("div")
    div.classList.add("d-flex", "align-items-center", "justify-content-start", "gap-4")

    // Titulo da barra
    const spn_title = document.createElement("span")
    spn_title.classList.add("fs-5")
    spn_title.textContent = title

    // Div da Progress Bar
    const progress_bar = document.createElement("div")
    progress_bar.classList.add("progress", "rounded-5", "flex-grow-1")
    progress_bar.role = "progressbar"
    progress_bar.style.height = "3vh"
    const value_percent = (valor_atual * 100) / meta

    // Atributos da barra
    progress_bar.setAttribute("aria-value-now", valor_atual)
    progress_bar.setAttribute("aria-value-min", 0)
    progress_bar.setAttribute("aria-value-max", meta)

    // Barra de progresso em si
    const progress = document.createElement("div")
    progress.classList.add("progress-bar", "fs-6", "text-truncate")

    // Define as cores da barra
    if (value_percent < 50) { progress.classList.add("text-bg-danger") }
    else if (value_percent >= 50 && value_percent < 95) { progress.classList.add("text-bg-warning") }
    else { progress.classList.add("text-bg-success") }

    // Se passar o percent ao inves do valor recebe a porcentagem
    if (percent) { progress.textContent = value_percent + "%" }
    else {
        if (value) { progress.textContent = valor_atual }
        else { progress.textContent = to_real(valor_atual) }
    }

    // Se a meta estiver zerada seta como 10 por cento
    if (meta <= 0) { progress.style.width = "100%" }
    else { progress.style.width = value_percent + "%" }
    if(value_percent == 0 && meta >= 0){progress.style.width = "15%"}
    progress_bar.appendChild(progress)

    // Titulo da Meta
    const spn_goal = document.createElement("span")
    if (value) {
        spn_goal.textContent = meta
    } else {
        spn_goal.textContent = to_real(meta)
    }

    div.appendChild(spn_title)
    div.appendChild(progress_bar)
    div.appendChild(spn_goal)

    return div
}

function create_chart_payments(payments) {
    const graf_div = document.getElementById("grafDiv")
    graf_div.innerHTML = '' // Zera o conteudo atual

    pays = {}
    for(item in payments){
        if(payments[item] > 0){
            pays[item] = payments[item]
        }
    }

    const graf = document.createElement("div")
    // Converter JSON para array de objetos
    const data = Object.entries(pays).map(([label, value]) => ({
        label,
        value
    }));

    // Dimensões
    const width = 350;
    const height = 350;
    const radius = Math.min(width, height) / 2;

    // Cores
    const color = d3.scaleOrdinal()
        .domain(data.map(d => d.label))
        .range([primary]); // Cores dos graficos

    // Criar SVG
    const svg = d3.select(graf)
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", `translate(${width / 2}, ${height / 2})`);

    // Gerador de arco (donut)
    const arc = d3.arc()
        .innerRadius(radius * .75) // tamanho do Arco
        .outerRadius(radius * 0.95)
        .padAngle(0.05) // Separa
        .cornerRadius(15); // arredonda

    // Gerador de pizza
    const pie = d3.pie()
        .value(d => d.value)
        .sort(null); // mantém ordem original

    // Criação
    svg
        .selectAll("path")
        .data(pie(data))
        .join("path")
        .attr("d", arc)
        .attr("fill", d => color(d.data.label))
        .attr("stroke", primary)
        .style("stroke-width", "2px")
        .style("opacity", 0.9)
        .on("mouseover", function (event, d) {
            d3.select(this).style("opacity", 1);
            tooltip.style("opacity", 1)
                .html(`<strong>${d.data.label}</strong>: ${to_real(d.data.value)}`)
                .style("left", (event.pageX + 10) + "px")
                .style("top", (event.pageY - 20) + "px");
        })
        .on("mouseout", function () {
            d3.select(this).style("opacity", 0.9);
            tooltip.style("opacity", 0);
        })
        .join("text")
        .text(d => d.data.label);

    // Tooltip (opcional)
    const tooltip = d3.select("body")
        .append("div")
        .style("position", "absolute")
        .style("padding", "6px 10px")
        .style("background", "#222")
        .style("font-size", "20px")
        .style("color", "white")
        .style("border-radius", "4px")
        .style("pointer-events", "none")
        .style("opacity", 0);

    // Labels internas no gráfico (opcional)
    svg
        .selectAll("text")
        .data(pie(data))
        .join("text")
        .text(d => d.data.value > 0 ? d.data.label : "")
        .style("fill", "#fff")
        .attr("transform", d => `translate(${arc.centroid(d)})`)
        .style("font-size", "14px")
        .style("font-weight", "bold")
        .style("text-anchor", "middle");
}