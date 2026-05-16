import { InitDashboard } from "../models/dashboards.js";
import { capitalize, to_real } from "../utils/ui.js";
import { server } from "../config/env.js";
import { ApiRequest } from "../utils/request.js";

// Função responsavel por dar as boas vindas ao usuario
function welcome() {
    const welcome_txt = document.getElementById("welcome_txt"); // Obtem o arquivo do texto
    if (welcome_txt) {
        const hora = parseInt(new Date().toLocaleTimeString("pt-br", { hour: "numeric" })); // Obtem a hora atual em Integer
        let welcome_str;

        if (hora >= 0 && hora < 12) { welcome_str = "Bom dia" }
        else if (hora >= 12 && hora < 19) { welcome_str = "Boa tarde" }
        else { welcome_str = "Boa noite" }

        welcome_txt.textContent = `${welcome_str} ${capitalize(sessionStorage.getItem("display_name") || "Visitante")}, bem vindo!`
    }
}

// Função que cria uma barra de progresso para cada meta
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
    if (value_percent == 0 && meta >= 0) { progress.style.width = "15%" }
    progress_bar.appendChild(progress)

    // Titulo da Meta
    const spn_goal = document.createElement("span")
    if (value) { spn_goal.textContent = meta }
    else { spn_goal.textContent = to_real(meta) }

    div.appendChild(spn_title)
    div.appendChild(progress_bar)
    div.appendChild(spn_goal)

    return div
}

// Função que cria o chart dos pagamentos
function create_chart_payments(payments) {
    // Codigo usando o D3 Charts, somente para esse chart, os demais com o ChartJS
    const graf_div = document.getElementById("grafDiv")
    const graf = document.createElement("div")

    graf_div.innerHTML = '' // Zera o conteudo atual

    const pays = {}
    for (let item in payments) {
        if (payments[item] >= 0) {
            pays[item] = payments[item]
        }
    }

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
        // Cores do graficos
        .range(["#4EC98E", "#63EE88", "#4aba77", "#58956B"]); 

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
        .attr("stroke", d => color(d.data.label))
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

    svg.append("text")
        .attr("text-anchor", "middle")
        .attr("dy", "-5")
        .style("fill", "#aaa")
        .style("font-size", "12px")
        .text("TOTAL");

    svg.append("text")
        .attr("text-anchor", "middle")
        .attr("dy", "18")
        .style("fill", "#fff")
        .style("font-size", "18px")
        .style("font-weight", "700")
        .text(to_real(data.reduce((s, d) => s + d.value, 0)));

    const legend = d3.select(graf)
        .append("div")
        .style("display", "flex")
        .style("flex-direction", "column")
        .style("gap", "8px")
        .style("margin-left", "20px");

    data.forEach(d => {
        const item = legend.append("div")
            .style("display", "flex")
            .style("align-items", "center")
            .style("gap", "8px");

        item.append("span")
            .style("width", "10px")
            .style("height", "10px")
            .style("border-radius", "50%")
            .style("background", color(d.label));

        item.append("span")
            .style("color", "#fff")
            .style("font-size", "13px")
            .text(`${d.label} - ${to_real(d.value)}`);
    });
    
    graf.style.display = "flex";
    graf.style.alignItems = "center";
    graf.style.justifyContent = "center";
    graf.style.gap = "25px";
    graf_div.appendChild(graf)
};

// Obtem as informações do dashboard e seta as INFOS com DOM
async function get_infos() {
    const req = await new InitDashboard().get(sessionStorage.getItem("mat")); // Requisição
    const res = await req.json(); // JSON Final
    const div_goals = document.getElementById("div_goal");

    if (req.ok) {
        // Metas e barras de progresso
        if (div_goals) {
            div_goals.innerHTML = ''; // Zera caso haja alguma barra existente
            div_goals.classList.remove("align-items-center", "justify-content-center"); // Seta o CSS

            // Cria as barras de progresso!
            const pgmes = create_progress_bar("Vendas Mes", res.real.mes, res.metas.mes);
            const pgdia = create_progress_bar("Vendas Dia", res.real.dia, res.metas.dia);
            const pgclients = create_progress_bar("Clientes", res.real.clientes, res.metas.clientes, false, true);

            const goasl = [pgmes, pgdia, pgclients] // Lista das barras de progresso
            goasl.forEach(item => { div_goals.appendChild(item); }); // Adição das barras
        }

        // Vendas por funcionario (Logado)
        const person_sales = document.getElementById("person_sales")
        person_sales.textContent = to_real(res.real.func)

        // Ticket medio da loja (Meta)
        const ticket_goal = document.getElementById("ticket_goal")
        ticket_goal.textContent = "Meta - Ticket Médio: " + to_real(res.metas.ticket)

        // Div dos buttons (Venda e OS)
        const divBtns = document.createElement("div")
        divBtns.classList.add("d-flex", "gap-2")

        // Button de vendas
        const btn = document.createElement("button")
        btn.classList.add("btn", "btn-lg", "btn-primary")
        btn.textContent = "Iniciar Venda."
        btn.addEventListener("click", function () { change_screen("sales/sales") })

        // Button de Ordem de Serviço
        const btnOrder = document.createElement("button")
        btnOrder.classList.add("btn", "btn-lg", "btn-outline-primary")
        btnOrder.textContent = "Ordens de Serviço."
        btnOrder.addEventListener("click", function () { change_screen("orders/orders") })

        // Dom dos buttons
        divBtns.appendChild(btn)
        divBtns.appendChild(btnOrder)
        document.getElementById("goals_btns").appendChild(divBtns)

        // Cria o grafico de pagamentos (por tipo)
        create_chart_payments(res.real.pagamentos);
    };
};

// Instancia as funções caso esteja na pagina de Relatorios Iniciais
if (window.location.pathname == "/pages/init_reports.html") {
    welcome(); get_infos(); // GET USER IS PROV.
};