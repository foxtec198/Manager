// Models
import { ExpenseModel } from "../models/expenses.js";
import { PaymentsDashboard } from "../models/dashboards.js";
import { PosModel } from "../models/pos.js"

// Services
import { setExpenses, deleteExpense } from "../services/expenses_service.js"

// Utils and More
import { show_toast, to_real } from "../utils/ui.js";
import { icon_rocket, icon_graph_down, icon_graph_up } from "../utils/icons.js";

// Funcao responsavel por setar o estado do caixa
export async function setPosState(){
    const pos = new PosModel() // Instancia o modelo do CAIXA
    const req = await pos.status(); // Agrega o status do caixa a uma variavel
    const res = await req.json(); // JSON final
    const value_last_closed = await pos.last_closed() // Agrega o ultimo valor aberto a uma variavel

    // Obtem todos os elementos com data-state usado apenas para estado do caixa
    document.querySelectorAll("[data-state]").forEach(el => {
        // DATA-STATE = "POS" (Vai ser usado em insignias, titulos e botoes)
        if(el.dataset.state === "pos"){
            // Confirma se o caixa está aberto
            if(res.status && req.ok){
                // Itera com o switch no NODE NAME para saber qual elemento está sendo passado o dataset (evita erros)
                switch(el.nodeName){
                    // Title - Setado de acordo com o status do caixa no caso aberto
                    case "STRONG":
                        el.innerHTML = '<i class="bi bi-currency-exchange"></i> Fechar Caixa';
                        return;

                    // Badge - Quando aberto mostra o valor atual do caixa (Mesmo depois de vendido!)
                    case "SPAN":
                        el.classList.remove("placeholder", "bg-red");
                        el.classList.add("bg-primary", "badge", "rounded-pill");
                        el.textContent = `Caixa Aberto - ${to_real(res.valor)}`;
                        return;
                        
                    // State Button - Button referente ao caixa no caso fechar caixa
                    case "BUTTON":
                        el.classList.remove("placeholder", "btn-primary");
                        el.classList.add("btn", "btn-red");
                        el.textContent = "Fechar Caixa.";
                        return;
                };
            }else{
                switch(el.nodeName){
                    // Title - Setado de acordo com o status do caixa - No caso fechado
                    case "STRONG":
                        el.innerHTML = '<i class="bi bi-currency-exchange"></i>  Abrir Caixa';
                        return;

                    // Badge - Quando fechado exibe apenas que esta fechado 
                    // Feat: Futuramente uma hint quando passar o mouse ou segurar com o dedo em cima
                    case "SPAN":
                        el.classList.remove("placeholder", "bg-primary");
                        el.classList.add("bg-red", "badge", "rounded-pill");
                        el.textContent = `Caixa Fechado`;
                        return;

                    // State Button - Button referente ao caixa no caso abrir o caixa
                    case "BUTTON":
                        el.classList.remove("placeholder", "btn-red");
                        el.classList.add("btn", "btn-primary");
                        el.textContent = "Abrir Caixa.";
                        return;
                };
            };
        };
        
        // Confirma se é do estilo troco que será uma div que contem o input troco ou apenas o input
        if(el.dataset.state == "troco"){
            if(res.status && req.ok){
                el.style.display = 'none' // Esconde o div quando o caixa estiver aberto
            }else{
                // Itera o elemento para setar o ultimo valor
                switch(el.nodeName){
                    // Somente o input
                    case "INPUT": el.value = value_last_closed;
                    
                    // O Div com o input dentro
                    case "DIV": el.querySelector("input[name='troco']").value = value_last_closed;
                }
            }
        };
    });
};

// Função para setar o Report de vendas
async function set_mini_dashboard(filter = "week") { // DOM referente ao Mini Dashboard 
    const req = await new PaymentsDashboard().get(filter); // Obtém os dados de acordo com o filtro (week, day, month)
    const payments = await req.json(); // JSON Final
    const div_mini_report = document.getElementById("mini_report"); // Div do dashboard
    console.log(payments);
    
    if(req.ok){ // Confirma se o request foi sucedido
        if (payments.total > 0) { // Confirma se os resultados sao maiores que ZERO
            // Remove o style e deixa como vazio o HTML para poder adpatar o report
            div_mini_report.classList.remove("flex-column", "justify-content-center", "align-items-center");
            div_mini_report.innerHTML = '';

            // Variaveis do Report
            const orders_total = payments.orders; // Valor de vendas p Orndens
            const orders_count = payments.orders_count; // Total de vendas p Ordens
            const prods_total = payments.products // Valor de Vendas p Produtos
            const prods_count = payments.product_count; // Contagem de Vendas p Produtos
            const total = payments.total; // Valor Total
            const total_count = payments.total_count; // Contagem do total
            const opening = payments.opening; // Valor de Abertura
            const payments_type = payments.payments; // Metodos de Pagamentos e seus valores DEB, CRED, DIN, PIX

            const orders_percent = (orders_total * 100) / total; // Porcentagem de Ordens de serviço
            const prods_percent = (prods_total * 100) / total; // Porcentagem de Produtos
    
            // Elementos - DOM
            const lbl_total_os = document.getElementById("os_total"); // Total de Ordens 
            lbl_total_os.textContent = to_real(orders_total); // Seta o valor total de Ordens em BRL
            const lbl_percent_os = document.getElementById("os_percent"); // Porcentagem de Ordens

            const lbl_total_prods = document.getElementById("prods_total"); // Total por Produtos
            lbl_total_prods.textContent = to_real(prods_total); // Seta o valor total de Produtos em BRL
            const lbl_percent_prods = document.getElementById("prods_percent"); // Porcentagem de Produtos
    
            const consider_percent = 40; // Porcentual considerado
    
            // Coloração da porcentagem das OPRDENS
            if (orders_percent < consider_percent) {
                lbl_percent_os.innerHTML = `<span class="text-danger">${orders_percent.toFixed(2)}% ${icon_graph_down}</span> <span>( ${orders_count} )</span>`;
            } else if (orders_percent >= consider_percent) {
                lbl_percent_os.innerHTML = `<span class="text-success">${orders_percent.toFixed(2)}% ${icon_graph_up}</span> <span>( ${orders_count} )</span>`;
            };
    
            // Coloração da porcentagem dos PRODUTOS
            if (prods_percent < consider_percent) {
                lbl_percent_prods.innerHTML = `<span class="text-danger">${prods_percent.toFixed(2)}% ${icon_graph_down}</span> <span>( ${prods_count} )</span>`;
            } else if (prods_percent >= consider_percent) {
                lbl_percent_prods.innerHTML = `<span class="text-success">${prods_percent.toFixed(2)}% ${icon_graph_up}</span> <span>( ${prods_count} )</span>`;
            };
    
            // Cria uma barra localmente (Exclusivo desta função/sessão)
            function create_bar(label, value) {
                const div_bar = document.createElement("div"); // Div responmsavel por toda barra
                const bar = document.createElement("div"); // A barra em si 
                const gord = 30;

                div_bar.classList.add("d-flex", "flex-column", "justify-content-between", "align-items-center", "h-100", "gap-2"); // CSS Div Bar 
                bar.classList.add("rounded-5", "bg-primary", "text-center"); // CSSS Bar
                bar.textContent = "."; // Content somente para nao deixar a barra sem conteudo

                // Setando de fato a porcentagem com a "gordura" valor responsavel por fazer com que a barra tenha o minimo de valor visivel (=_____%)
                bar.style.height = (value * 100) / total + gord + '%'; 

                // Restante do bar style
                bar.style.width = "60px"
                bar.style.color = "transparent"
    
                // Label responsavel pelo valor em BRL
                const label_dom = document.createElement("span")
                label_dom.classList.add("text-center", "fw-bold")
                label_dom.innerHTML = `<span>${label.toUpperCase()}</span><p>${to_real(value)}</p>`
                
                // Elementos sendo adicionados - DOM 
                div_bar.appendChild(bar)
                div_bar.appendChild(label_dom)
                return div_bar // Retorna a barra completa
            };
            
            // Itera sobre os metodos de pagamento (Deb, Cred, Pix, Din.)
            for (let item in payments_type) {
                const graph_bar = create_bar(item, payments_type[item]); // Gera uma barra por metoido/tipo
                div_mini_report.appendChild(graph_bar); // Adiciona as barras ao DIV Geral de metas/realizados
            };
    
        } else { // Se for menor faz com que as barras sejam zeradas de forma estilizada
            // Elements - DOM
            const lbl_total_os = document.getElementById("os_total");
            const lbl_percent_os = document.getElementById("os_percent");
            const lbl_total_prods = document.getElementById("prods_total");
            const lbl_percent_prods = document.getElementById("prods_percent");
    
            // Seta como 0 em BRL (Ou seja R$0.00)
            lbl_total_os.textContent = to_real(0);
            lbl_percent_os.innerHTML = `<span class="text-danger">0% ${icon_graph_down}</span> <span>( 0 )</span>`;
            lbl_total_prods.textContent = to_real(0);
            lbl_percent_prods.innerHTML = `<span class="text-danger">0% ${icon_graph_down}</span> <span>( 0 )</span>`;
            
            div_mini_report.innerHTML = ''; // Zera o mini report
            const spn = document.createElement("span"); // Cria um span para setar o text0
            spn.classList.add("fs-4"); // Seta o FS do bootstrap rsrs.
            spn.textContent = "Nenhuma venda ainda!"; // Seta o texto
    
            const btn = document.createElement("button"); // Button para vender
            btn.classList.add("btn", "btn-primary", "btn-lg", "fw-bold"); // BOotstrap do button
            btn.innerHTML = "Bora vender? " + icon_rocket; // Icone com texto
            btn.addEventListener("click", function () {change_screen("sales/sales"); }); // Evento de troca de tela

            div_mini_report.classList.add("d-flex", "flex-column", "justify-content-center", "align-items-center"); // CSS do DIV do report

            // DOM Add
            div_mini_report.appendChild(spn)
            div_mini_report.appendChild(btn)
        }
    };  
};

// Mostra/Oculta o campo para declarar o motivo da despesa (Caso nao seja uma sangria) - GLOBAL
window.alter_expense = function alter_expense(select) { 
    const motivoD = document.getElementById("motivo_declarado");
    motivoD.parentElement.hidden = select.value === "Despesa" 
        ? false 
        : true;
};

// ============================================================================================ FORMS
const form_status_pos = document.getElementById("status_caixa") // Formulario de abertura de caixa
if (form_status_pos) {
    form_status_pos.addEventListener("submit", async function (e) {
        e.preventDefault()
        if(this.btn_status.textContent.includes("Fechar")){
            const res = await pos.close(this.mat.value)
            if (res) {
                show_toast(res)
                set_badge_pos();
            }
            this.reset();
            set_state();
        }else{
            const res = await pos.open(this.mat.value, this.troco.value)
            if (res) {
                show_toast(res, "info")
                set_badge_pos();
            }
            this.reset()
            set_state();
            set_last_value_pos();
        };
    })
}

const form_add_value = document.getElementById("form_add_value") // Formulario de adição de valor
if (form_add_value) {
    form_add_value.addEventListener("submit", async function (e) {
        e.preventDefault();
        const valor = form_add_value.valor ? form_add_value.valor.value : null;
        const matricula = form_add_value.matricula ? form_add_value.matricula.value : null;
        const req = await new PosModel().append(parseInt(matricula), parseFloat(valor)); 
        const res = await req.json()
        if(req.ok){ setPosState(); };
    })
}

const form_add_expense = document.getElementById("form_add_expense") // Formulario de Criação de Despesas
if(form_add_expense) {
    form_add_expense.addEventListener("submit", async (e) => {
        e.preventDefault();
        const matricula = form_add_expense.matricula.value; // Matricula do responsavel
        const valor = form_add_expense.valor.value; // Valor da despesa/sangria

        // Seta o motivo ou a sangria
        const motivo = form_add_expense.motivo.value != 'Sangria' 
            ? form_add_expense.motivo_declarado.value 
            : form_add_expense.motivo.value;

        const req = await new ExpenseModel().set(matricula, valor, motivo); // Seta a despesa
        const res = await req.json(); // JSON final

        if(req.ok){ setPosState(); setExpenses(); };
    })
}

window.set_mini_dashboard = set_mini_dashboard
window.location.pathname === "/pages/pos.html" ? set_mini_dashboard() : null;