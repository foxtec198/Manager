// ============================================================================================ FUNCTIONS / DOM's
async function set_badge_pos() { // DOM do status do caixa
    const status = document.getElementById('pos_status')
    if(status){
        status.classList.remove('bg-outline-primary', 'bg-outline-red')
        status.classList.add('placeholder')
        const js = await get_pos() // Obtem os status do caixa
        if (js.status) {
            status.classList.remove('placeholder')
            status.classList.add('bg-outline-primary')
            status.textContent = 'Caixa Aberto - ' + to_real(js.valor)
        } else {
            status.classList.remove('placeholder')
            status.classList.add('bg-outline-red')
            status.textContent = `Caixa Fechado - R$ 0`
        }
    }
}

async function set_expenses() { // DOM referente a tabela de despesas
    const expenses = await get_expenses(); // Requisição das despesas
    const data = expenses.map(expense => {
        return [
            new Date(expense.data).toLocaleDateString('pt-br', {'day': '2-digit', 'month': 'long', 'hour': '2-digit', 'minute': "2-digit"}), 
            expense.motivo, 
            expense.funcionario.toUpperCase(),
            to_real(expense.valor),
            gridjs.html(`
                <button class="btn btn-secondary">${icon_eye}</button>
                <button class="btn btn-danger">${icon_trash}</button>
            `)
        ]
    }); // Data usando map para formatar os dados da tabela
    const columns = ["Data", "Motivo", "Funcionário", "Valor", "Ações"] // Colunas da Tabela
    create_table("lista_de_despesas", data, columns); // Cria a tabela e indexa
}

async function set_mini_dashboard(filter = "week") { // DOM referente ao Mini Dashboard 
    const payments = await get_infos_payments(filter)
    const div_mini_report = document.getElementById("mini_report")
    if (Object.keys(payments).length > 1) {
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

        // Coloração da porcentagem das OPRDENS
        if (orders_percent < 50) {
            lbl_percent_os.innerHTML = `<span class="text-danger">${orders_percent.toFixed(2)}% ${icon_graph_down}</span> <span>( ${orders_count} )</span>`
        } else if (orders_percent >= 50 && orders_percent < 70) {
            lbl_percent_os.innerHTML = `<span class="text-success">${orders_percent.toFixed(2)}% ${icon_graph_up}</span> <span>( ${orders_count} )</span>`
        }

        // Coloração da porcentagem dos PRODUTOS
        if (prods_percent < 50) {
            lbl_percent_prods.innerHTML = `<span class="text-danger">${prods_percent.toFixed(2)}% ${icon_graph_down}</span> <span>( ${prods_count} )</span>`
        } else if (prods_percent >= 50) {
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

async function set_last_value_pos() { // DOM ultimo valor do caixa fehcado
    const status = await get_last_closed()
    if (status) {
        const pos_value_input = document.getElementById("troco")
        pos_value_input.value = status
    }
    const btn = document.getElementById("btn_open_pos")
    btn.disabled = ""
}

function alter_expense(select) { // Mostra/Oculta o campo para declarar o motivo da despesa (Caso nao seja uma sangria)
    const motivoD = document.getElementById("motivo_declarado")
    if(select.value == 'Despesa'){ motivoD.parentElement.hidden = false;}
    else{ motivoD.parentElement.hidden = true }
}
// ============================================================================================ FORMS
const form_open_pos = document.getElementById("form_open_pos") // Formulario de abertura de caixa
if (form_open_pos) {
    form_open_pos.addEventListener("submit", async function (e) {
        e.preventDefault()
        const res = await open_pos(this.mat.value, this.troco.value)
        if (res) {
            show_toast(res, "info")
            set_badge_pos();
        }
        this.troco.value = ''
        this.mat.value = ''
    })
}

const form_close_pos = document.getElementById("form_close_pos") // Formulario de fechamento de caixa
if (form_close_pos) {
    form_close_pos.addEventListener("submit", async function (e) {
        e.preventDefault()
        const res = await close_pos(this.mat.value)
        if (res) {
            show_toast(res)
            set_badge_pos();
        }
        this.mat.value = ''
    })
}

const form_add_expense = document.getElementById("form_add_expense") // Formulario de Criação de Despesas
if(form_add_expense) {
    form_add_expense.addEventListener("submit", async (e) => {
        e.preventDefault();
        let motivo;
        console.log(this.motivo)
        if(this.motivo.value != 'Sangria'){ motivo = this.motivo_declarado.value; }
        else{ motivo = this.motivo.value; }
        const res = await create_expense(motivo, this.valor.value, this.mat.value)
    })
}

// ============================================================================================ POS
// Obtem o status do caixa
async function get_pos() { // Status do  caixa (ABERTO/FECHADO)
    const req = await request("caixa/")
    const res = await req.json()
    if (req.ok) { return res }
    else { show_toast(res, "danger"); return false }
}

async function open_pos(mat, troco) { // Abre o caixa
    const req = await request("caixa", "POST", { "mat": mat, "valor": troco })
    const res = await req.json()
    if (req.ok) { return res }
    else { show_toast(res, "danger"); return false }
}

async function close_pos(mat) { // Fecha o caixa
    const req = await request("caixa?mat=" + mat, "DELETE")
    const res = await req.json()

    if (req.ok) { return res }
    else { show_toast(res, "danger"); return false }
}

async function get_last_closed() { //Obtem o ultimo valor de fechmento
    const req = await request("caixa/last_closed")
    const res = await req.json()

    if (req.ok) { return res }
    else { show_toast(res, "danger"); return false }
}

// ============================================================================================ DESPESAS
async function get_expenses(data = null, id = null) { // Obtem despesas cadastradas
    if (data) { req = await request("despesas?date=" + data) }
    else if (id) { req = await request("despesas?id=" + id) }
    else { req = await request("despesas") }

    const res = await req.json()
    if (req.ok) { return res }
    else { show_toast(res, "danger"); return false }
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

async function delete_expense(expense_id) { // Deleta uma despesa
    const req = await request("despesas?id=" + expense_id, "DELETE")
    const res = await req.json()
    if (req.ok) { return res }
    else { show_toast(res, "danger"); return false }
}

// ============================================================================================ DASHBOARDS
async function get_infos_payments(filter) { // Informações dos pagamentos deb, cred, pix, din
    const req = await request("dashboards/payments?filter=" + filter)
    const res = await req.json()
    if (req.ok) { return res }
    else { show_toast(res, "danger"); return false }
}