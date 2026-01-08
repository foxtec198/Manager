// ======================================================================== LOGIC AND DOM
const cart = {} // Carinho local
let id_client;
let desconto = 0;
let total = 0 // Valor total

function create_btn_sales(produto) { // Cria os botaos dos produtos de forma estrategica
    const btn = document.createElement("button");
    btn.classList.add(
        "rounded-4", "shadow-lg", "produto",
        "p-2", "bg-gray", "overflow-hidden",
        "d-flex", "flex-column", "justify-content-between"
    );
    btn.style.width = "180px"
    btn.style.height = "180px"
    btn.style.border = "none"
    btn.dataset.name = produto.nome.toLowerCase()

    const span_nome = document.createElement("span")
    span_nome.classList.add("fs-5", "fw-bold")
    span_nome.textContent = produto.nome

    const span_dados = document.createElement("span")
    span_dados.classList.add("fw-bold", "text-primary")
    span_dados.textContent = `${to_real(produto.valor)}`

    btn.appendChild(span_nome)
    btn.appendChild(span_dados)

    btn.addEventListener("click", () => {
        Object.keys(cart).length > 0 ? add_row_prod_table(produto) : create_prod_table(produto)
    })

    return btn
}

function create_prod_table(produto) { // Cria a tabela de produtos
    const frame_cart = document.getElementById("frame_cart")
    frame_cart.classList.remove("bi", "bi-basket-fill", "display-1", "text-center")
    frame_cart.classList.add("d-flex", "align-items-start", "h-100")
    frame_cart.style.opacity = '1'

    // ===================== TABLE ================
    const table = document.createElement("table")
    table.classList.add("flex-grow-1", "mtable", "table-hover")

    // ===================== THEAD ================
    const thead = document.createElement("thead")
    const tr_head = document.createElement("tr")

    const th_nome = document.createElement("th")
    th_nome.textContent = "Nome"

    const th_quantidade = document.createElement("th")
    th_quantidade.textContent = "Qnt."

    const th_valor = document.createElement("th")
    th_valor.textContent = "R$"

    const th_acao = document.createElement("th")
    th_acao.textContent = "Ações"

    tr_head.appendChild(th_nome)
    tr_head.appendChild(th_quantidade)
    tr_head.appendChild(th_valor)
    tr_head.appendChild(th_acao)
    thead.appendChild(tr_head)

    // ===================== TBODY ================
    const tbody = document.createElement("tbody")
    tbody.id = "table_prod_body"

    table.appendChild(thead)
    table.appendChild(tbody)
    frame_cart.appendChild(table)
    add_row_prod_table(produto, tbody)
}

function add_row_prod_table(produto, tb = null) { // Adiciona um produto a tabela acima
    const subtotal = document.getElementById("subtotal")
    const total_prod = document.getElementById("total_prod")
    const tbody = tb ? tb : document.getElementById("table_prod_body") // TBody da tabela
    if (cart[produto.nome]) {
        cart[produto.nome] ? cart[produto.nome]++ : cart[produto.nome] = 1

        const tr = document.getElementById(`tr_${produto.nome.toLowerCase().trim()}`)

        const td_quantidade = tr.querySelector(".td_quantidade")
        td_quantidade.textContent = cart[produto.nome]
        td_quantidade.classList.add("td_quantidade")

        const td_valor = tr.querySelector(".td_valor")
        td_valor.textContent = to_real(produto.valor * cart[produto.nome])
        td_valor.classList.add("td_valor")

    } else {
        cart[produto.nome] ? cart[produto.nome]++ : cart[produto.nome] = 1
        const tr = document.createElement("tr") // Table row
        tr.id = `tr_${produto.nome.toLowerCase().trim()}`
        tr.addEventListener("click", () => {
            tbody.querySelectorAll("tr").forEach(el => el.classList.remove("active"))
            tr.classList.add("active")
        })

        const td_nome = document.createElement("td")
        td_nome.textContent = produto.nome

        const td_valor = document.createElement("td")
        td_valor.textContent = to_real(produto.valor)
        td_valor.classList.add("td_valor")

        const td_quantidade = document.createElement("td")
        td_quantidade.textContent = cart[produto.nome]
        td_quantidade.classList.add("td_quantidade")

        const td_acao = document.createElement("td")
        const btn_rmv = document.createElement("button")
        btn_rmv.classList.add("btn", "btn-sm", "btn-danger")
        btn_rmv.innerHTML = icon_trash
        btn_rmv.addEventListener("click", () => {
            if (confirm("Limpar linha?")) {
                total -= produto.valor * cart[produto.nome]
                total_prod.textContent = "Total: " + to_real(total)
                tbody.removeChild(tr)
                delete cart[produto.nome]

                if (Object.keys(cart) >= 0) {
                    const frame_cart = document.getElementById("frame_cart")
                    frame_cart.innerHTML = '';
                    frame_cart.classList.add("bi", "bi-basket-fill", "display-1", "text-center")
                    frame_cart.classList.remove("d-flex", "align-items-start", "h-100")
                    frame_cart.style.opacity = "0.2"
                }

            }
        })
        td_acao.appendChild(btn_rmv)

        tr.appendChild(td_nome)
        tr.appendChild(td_quantidade)
        tr.appendChild(td_valor)
        tr.appendChild(td_acao)
        tbody.appendChild(tr)
    }
    total += produto.valor
    total_prod.textContent = "Total: " + to_real(total - desconto)
    subtotal.textContent = "Sub-Total: " + to_real(total)
}

async function set_products() { // Cria os produtos de acordo com a categoria
    // const produtos = await fetch("http://localhost:5500/products/js/products.json").then(res => res.json().then(res => { return res }))
    const produtos = await get_products() // Obtem todos os produtos
    const categorias = new Set() // SET para as categorias ja declaradas (Não somente as existentes!) - Evita categoria sem produto
    produtos.forEach(item => categorias.add(item.categoria))

    const card_prods = document.getElementById("produtos")
    card_prods.classList.add("d-flex", "flex-wrap", "justify-content-start", "align-items-center", "gap-2")
    categorias.forEach(categoria => {
        const div_categ = document.createElement("div")
        div_categ.classList.add("d-flex", "w-100", "mt-5", "fs-4", "div_categ")

        const span_categ = document.createElement("span")
        span_categ.classList.add("text-truncate", "w-100")
        span_categ.textContent = categoria

        const div_prod = document.createElement("div")
        div_prod.classList.add("d-flex", "w-100", "mt-5", "fs-4", "div_categ_prod")

        div_categ.appendChild(span_categ)
        div_categ.appendChild(div_prod)
        card_prods.appendChild(div_categ)

        produtos.forEach(produto => {
            if (categoria == produto.categoria) {
                card_prods.appendChild(create_btn_sales(produto))
            }
        })
    })
}

async function set_clients() { // Seta os clientes e sem DOM Elements
    // const clients = await fetch("http://127.0.0.1:5500/clients/js/clients.json").then(res => res.json().then(res => { return res }));
    const clients = await get_clients()
    const list_of_clients = document.getElementById("lista_de_clientes");
    
    clients.forEach(client => {
        const li_client = document.createElement("li")
        li_client.classList.add("list-group-item", "list-group-item-hover")

        const div_dados = document.createElement("div")
        div_dados.classList.add("d-flex", "justify-content-between")
        
        const div_nome = document.createElement("div")

        const span_nome = document.createElement("p")
        span_nome.textContent = client.nome

        const span_cpf = document.createElement("span")
        span_cpf.textContent = client.cpf

        const btn = document.createElement("button")
        btn.classList.add("btn", "btn-lg", "btn-primary", "rounded")
        btn.textContent = " + "
        btn.addEventListener("click", function() {
            id_client = client.id
            document.getElementById("client_name_pay").textContent = client.nome
            const form_client = document.getElementById("sale_client")
            form_client.name.value = client.nome
            form_client.cpf.value = client.cpf
            form_client.cpf.obs = client.obs
        })

        div_nome.appendChild(span_nome)
        div_nome.appendChild(span_cpf)
        div_dados.appendChild(div_nome)
        div_dados.appendChild(btn)

        li_client.appendChild(div_dados)
        list_of_clients.appendChild(li_client)
    });
}

// ======================================================================== EVENTS
document.querySelectorAll(".btn-categ").forEach(el => { // Evento para click do botao de tela
    el.addEventListener("click", () => {
        const targetId = el.dataset.target;
        // Remove de cada Botao o modo ativo e seta apenas para o clickado
        document.querySelectorAll(".btn-categ").forEach(e => e.classList.remove("active"));
        el.classList.add("active");
        // Remove de cada frame o modo ativo e seta apenas para o desejado
        document.querySelectorAll('.sale_card_frame').forEach(screen => screen.classList.remove('active'));
        document.getElementById(targetId).classList.add('active');

    })
});

const input = document.getElementById('search'); // Evento para busca de produtos
input ? input.addEventListener('input', () => {
    const termo = input.value.toLowerCase().trim();
    document.querySelectorAll('.produto').forEach(produto => {
        const nome = produto.dataset.name;
        if (nome.includes(termo)) {
            produto.classList.remove('hidden');
        } else {
            produto.classList.add('hidden');
        }
    });
}) : null;

// ======================================================================== REQUESTS - END POINTS
