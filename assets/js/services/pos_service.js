import { setExpenses } from "../services/expenses_service.js"
import { PosModel } from "../models/pos.js"
import { to_real } from "../utils/ui.js";

export async function setPosState(){
    const pos = new PosModel() // Instancia o modelo do CAIXA
    const pos_state = await pos.status(); // Agrega o status do caixa a uma variavel
    const value_last_closed = await pos.last_closed() // Agrega o ultimo valor aberto a uma variavel

    // Obtem todos os elementos com data-state usado apenas para estado do caixa
    document.querySelectorAll("[data-state]").forEach(el => {
        // DATA-STATE = "POS" (Vai ser usado em insignias, titulos e botoes)
        if(el.dataset.state === "pos"){
            // Confirma se o caixa está aberto
            if(pos_state.status){
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
                        el.textContent = `Caixa Aberto - ${to_real(pos_state.valor)}`;
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
            if(pos_state.status){
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

async function set_mini_dashboard(filter = "week") { // DOM referente ao Mini Dashboard 
    const payments = await pay_report.get(filter)
    const div_mini_report = document.getElementById("mini_report")
    
    if (payments.total > 0) {
        div_mini_report.classList.remove("flex-column", "justify-content-center", "align-items-center")
        div_mini_report.innerHTML = '';
        // Varuaveis
        const orders_total = payments.orders // Valor de vendas p Orndens
        const orders_count = payments.orders_count // Total de vendas p Ordens
        const prods_total = payments.products // Valor de Vendas p Produtos
        const prods_count = payments.product_count // Contagem de Vendas p Produtos
        const total = payments.total // Valor Total
        const total_count = payments.total_count // Contagem do total
        const opening = payments.opening // Valor de Abertura
        const payments_type = payments.payments // Metodos de Pagamentos e seus valores DEB, CRED, DIN, PIX

        const orders_percent = (orders_total * 100) / total
        const prods_percent = (prods_total * 100) / total

        // Elementos
        const lbl_total_os = document.getElementById("os_total")
        const lbl_percent_os = document.getElementById("os_percent")
        const lbl_total_prods = document.getElementById("prods_total")
        const lbl_percent_prods = document.getElementById("prods_percent")

        lbl_total_prods.textContent = to_real(prods_total) 
        lbl_total_os.textContent = to_real(orders_total)

        const consider_percent = 40

        // Coloração da porcentagem das OPRDENS
        if (orders_percent < consider_percent) {
            lbl_percent_os.innerHTML = `<span class="text-danger">${orders_percent.toFixed(2)}% ${icon_graph_down}</span> <span>( ${orders_count} )</span>`
        } else if (orders_percent >= consider_percent) {
            lbl_percent_os.innerHTML = `<span class="text-success">${orders_percent.toFixed(2)}% ${icon_graph_up}</span> <span>( ${orders_count} )</span>`
        }

        // Coloração da porcentagem dos PRODUTOS
        if (prods_percent < consider_percent) {
            lbl_percent_prods.innerHTML = `<span class="text-danger">${prods_percent.toFixed(2)}% ${icon_graph_down}</span> <span>( ${prods_count} )</span>`
        } else if (prods_percent >= consider_percent) {
            lbl_percent_prods.innerHTML = `<span class="text-success">${prods_percent.toFixed(2)}% ${icon_graph_up}</span> <span>( ${prods_count} )</span>`
        }

        function create_bar(label, value) {
            const div_bar = document.createElement("div")
            const bar = document.createElement("div")
            div_bar.classList.add("d-flex", "flex-column", "justify-content-between", "align-items-center", "h-100", "gap-2")
            
            bar.classList.add("rounded-5", "bg-primary", "text-center")
            bar.textContent = "."
            bar.style.height = (value * 100) / total + 30 + '%'
            bar.style.width = "60px"
            bar.style.color = "transparent"

            const label_dom = document.createElement("span")
            label_dom.classList.add("text-center", "fw-bold")
            label_dom.innerHTML = `<span>${label.toUpperCase()}</span><p>${to_real(value)}</p>`

            div_bar.appendChild(bar)
            div_bar.appendChild(label_dom)
            return div_bar
        }

        for (item in payments_type) {
            const graph_bar = create_bar(item, payments_type[item])
            div_mini_report.appendChild(graph_bar)
        }

    } else {
        const lbl_total_os = document.getElementById("os_total")
        const lbl_percent_os = document.getElementById("os_percent")
        const lbl_total_prods = document.getElementById("prods_total")
        const lbl_percent_prods = document.getElementById("prods_percent")

        lbl_total_os.textContent = to_real(0)
        lbl_percent_os.innerHTML = `<span class="text-danger">0% ${icon_graph_down}</span> <span>( 0 )</span>`
        lbl_total_prods.textContent = to_real(0)
        lbl_percent_prods.innerHTML = `<span class="text-danger">0% ${icon_graph_down}</span> <span>( 0 )</span>`
        
        div_mini_report.innerHTML = '';
        const spn = document.createElement("span")
        spn.classList.add("fs-4")
        spn.textContent = "Nenhuma venda ainda!"

        const btn = document.createElement("button")
        btn.classList.add("btn", "btn-primary", "btn-lg", "fw-bold")
        btn.innerHTML = "Bora vender? " + icon_rocket
        btn.addEventListener("click", function () {
            change_screen("sales/sales")
        })

        div_mini_report.classList.add("d-flex", "flex-column", "justify-content-center", "align-items-center")
        div_mini_report.appendChild(spn)
        div_mini_report.appendChild(btn)
    }
}

function alter_expense(select) { // Mostra/Oculta o campo para declarar o motivo da despesa (Caso nao seja uma sangria)
    const motivoD = document.getElementById("motivo_declarado")
    if(select.value == 'Despesa'){ motivoD.parentElement.hidden = false;}
    else{ motivoD.parentElement.hidden = true }
}

async function set_delete_expense(expense_id) { // Remove uma despesa e atualiza a tabela de despesas
    const res = await delete_expense(expense_id);
    if(res){
        const all_expenses = await expenses.get();
        const grid = await set_expenses(true);
        grid.updateConfig({
            data: all_expenses.map(expense => {
                return [
                    new Date(expense.data).toLocaleDateString('pt-br', {'day': '2-digit', 'month': 'long', 'hour': '2-digit', 'minute': "2-digit"}), 
                    expense.motivo, 
                    expense.funcionario.toUpperCase(),
                    to_real(expense.valor),
                    gridjs.html(`
                        <button class="btn btn-danger" onclick="set_delete_expense(${expense.id})">${icon_trash} Remover</button>
                    `)
                ]
            })
        }).forceRender();
        show_toast(res)
    }
}

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
        const res = await pos.append(valor, matricula); 
        if(res){ set_badge_pos(); show_toast(res); }; // Caso de sucesso altera as informações
    })
}

const form_add_expense = document.getElementById("form_add_expense") // Formulario de Criação de Despesas
if(form_add_expense) {
    form_add_expense.addEventListener("submit", async (e) => {
        e.preventDefault();
        const matricula = form_add_expense.matricula.value;
        const valor = form_add_expense.valor.value;
        const motivo = form_add_expense.motivo.value != 'Sangria' ? form_add_expense.motivo_declarado.value : form_add_expense.motivo.value;
        const res = await expenses.set(matricula, valor, motivo);
        if(res){
            set_badge_pos();
            const grid = await set_expenses(true);
            const expenses = await expenses.get();
            grid.updateConfig({
                data: expenses.map(expense => {
                    return [
                        new Date(expense.data).toLocaleDateString('pt-br', {'day': '2-digit', 'month': 'long', 'hour': '2-digit', 'minute': "2-digit"}),
                        expense.motivo, 
                        expense.funcionario.toUpperCase(),
                        to_real(expense.valor),
                        gridjs.html(`
                            <button class="btn btn-danger" onclick="set_delete_expense(${expense.id})">${icon_trash} Remover</button>
                        `)
                    ]
                })
            }).forceRender();
            form_add_expense.reset();
        }
    })
}