const pos = new PosModel()
const expenses = new ExpensesModel()
const pay_report = new PaymentsDashboard()

// ============================================================================================ FUNCTIONS / DOM's
async function set_badge_pos() { // DOM do status do caixa
    const status = document.getElementById('pos_status')
    if(status){
        status.classList.remove('bg-primary', 'bg-red')
        status.classList.add('placeholder')
        const pos_status = await pos.status()
        
        if (pos_status.status) {
            status.classList.remove('placeholder')
            status.classList.add('bg-primary')
            status.textContent = 'Caixa Aberto - ' + to_real(pos_status.valor)
        } else {
            status.classList.remove('placeholder')
            status.classList.add('bg-red')
            status.textContent = `Caixa Fechado - R$ 0`
        }
    }
}

async function set_state() { // Altera o estado da screen de abertura ou fechamento
    const state_title = document.getElementById('state_title') // Titulo do estado do caixa
    const form_status = document.getElementById("status_caixa") // Formulario 
    const troco = form_status.troco // Input referente ao valor do troco (Valor atual do caixa)
    const pos_status = await pos.status() // Obtem os status do caixa   

    if(pos_status.status){
        state_title.innerHTML = '<i class="bi bi-currency-exchange"></i> Fechar Caixa.'
        troco ? troco.parentElement.hidden = true : null
        btn_status.textContent = "Fechar Caixa."
        btn_status.classList.remove("btn-primary")
        btn_status.classList.add("btn-red")
    }else{
        state_title.innerHTML = '<i class="bi bi-currency-exchange"></i>  Abrir Caixa.'
        troco ? troco.parentElement.hidden = false : null
        btn_status.textContent = "Abrir Caixa."
        btn_status.classList.remove("btn-red")
        btn_status.classList.add("btn-primary")
    }
}

async function set_expenses(nocons=false) { // DOM referente a tabela de despesas
    const lista = document.getElementById("lista_de_despesas") // Listas HTML
    const res = nocons ? null : await expenses.get(); // Requisição das despesas    
    if(lista){
        lista.innerHTML = ''
        const data = res ? res.map(expense => {
            return [
                new Date(expense.data).toLocaleDateString('pt-br', {'day': '2-digit', 'month': 'long', 'hour': '2-digit', 'minute': "2-digit"}), 
                expense.motivo, 
                expense.funcionario.toUpperCase(),
                to_real(expense.valor),
                gridjs.html(`
                    <button class="btn btn-danger" onclick="set_delete_expense(${expense.id})">${icon_trash} Remover</button>
                `)
            ]
        }) : {}; // Data usando map para formatar os dados da tabela
        const columns = ["Data", "Motivo", "Funcionário", "Valor", "Ações"] // Colunas da Tabela
        return create_table("lista_de_despesas", data, columns); // Cria a tabela e indexa
    }
}

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

async function set_last_value_pos() { // DOM reeferente ao ultimo valor do caixa fehcado
    const status = await pos.last_closed()
    if (status) {
        const pos_value_input = document.getElementById("troco")
        pos_value_input.value = status
    }
    const btn = document.getElementById("btn_open_pos")
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
        is_loading();
        const matricula = form_add_expense.matricula.value;
        const valor = form_add_expense.valor.value;
        const motivo = form_add_expense.motivo.value != 'Sangria' ? form_add_expense.motivo_declarado.value : form_add_expense.motivo.value;
        const res = await create_expense(motivo, valor, matricula);
        if(res){
            set_badge_pos();
            const grid = await set_expenses(true);
            const expenses = await get_expenses();
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
            is_loading(false);
        }
    })
}

// ============================================================================================ DESPESAS
async function get_expenses(data = null, id = null) { // Obtem despesas cadastradas
    data ? request.path = `despesas?date=${data}` : request.path = id ? `despesas?id=${id}` : "despesas"

    return await request.send()
}

async function create_expense(motivo, valor, matricula) { // Cria uma despesa no BD
    const data = {
        "motivo": motivo, 
        "valor": valor,
        "mat": matricula
    }
    const req = await request("despesas", "POST", data)
    const res = await req.json()
    if (req.ok) { return res }
    else { show_toast(res, "danger"); return false }
}

async function delete_expense(id) { // Remove uma despesas no BD
    const req = await request("despesas?id=" + id, "DELETE")
    const res = await req.json()

    if(req.ok) { return res}
    else{ show_toast(res, "danger"); return false}
}

async function delete_expense(expense_id) { // Deleta uma despesa
    const req = await request("despesas?id=" + expense_id, "DELETE")
    const res = await req.json()
    if (req.ok) { return res }
    else { show_toast(res, "danger"); return false }
}