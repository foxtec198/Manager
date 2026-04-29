import { ProdutctsModel } from "../models/products.js";
import { to_real } from "../utils/ui.js";
import { cart } from "../config/env.js";
import { icon_trash } from "../utils/icons.js"
import { create_modal } from "../utils/ui.js";
import { show_toast } from "../utils/ui.js";

const model_product = new ProdutctsModel();
let id_client; // ID Client
let subtotal = 0 // Valor bruto
let desconto = 0; // Desconto se aplicavel
let total = 0; // Valor liquido
const pago = { "DINHEIRO": 0, "DEBITO": 0, "CREDITO": 0, "PIX": 0 } // Valor já pago (Não funciona para o INTERNAL)
let valor_pago = 0; // Total pago
let faltante = 0;
parent.window.pago = pago

function create_btn_sales(produto) { // Cria os botaos dos produtos de forma estrategica
    const btn_product = document.createElement("button"); // Cria oelemento btn
    btn_product.classList.add( // Add o css ao btn
        "rounded-4", "shadow-lg", "produto",
        "p-2", "bg-gray", "overflow-hidden",
        "d-flex", "flex-column", "justify-content-between"
    );
    btn_product.style.width = "180px" // Seta seu largura fixa
    btn_product.style.height = "180px" // Sua altura fixa
    btn_product.style.border = "none" // Remove a borda
    btn_product.dataset.name = produto.nome.toLowerCase() // Add o nome do produto em minusculas ao data set (Usado pra busca posteriormente)

    const span_nome = document.createElement("span") // Cria um label para o Nome do produto
    span_nome.classList.add("fs-5", "fw-bold") // Add os css's
    span_nome.textContent = produto.nome.toUpperCase() // Seta o nome do produto em maiusculas

    const span_dados = document.createElement("span") // Cria um label para o valor do produto
    span_dados.classList.add("fw-bold", "text-primary") // add os css's
    span_dados.textContent = `${to_real(produto.valor)}` // Seta o valor do produto em formato REAL (R$ 0,00)

    // Adiciona os labels ao btn
    btn_product.appendChild(span_nome)
    btn_product.appendChild(span_dados)

    // Seta o evento de clique
    btn_product.addEventListener("click", () => {
        // Confira se o CART já tem algum produto dentro, caso tenha somente adiciona a tabela, caso não, cria a tabela
        Object.keys(cart).length > 0 ? add_row_prod_table(produto) : create_prod_table(produto)
    })

    return btn_product // Retorna o btn
}

function create_prod_table(produto) { // Cria a tabela de produtos
    const frame_cart = document.getElementById("frame_cart"); // Obtem o frame do Carrinho
    frame_cart.classList.remove("bi", "bi-basket-fill", "display-1", "text-center"); // Remove o icone de cart de fundo
    frame_cart.classList.add("d-flex", "align-items-start", "h-100"); // Adiciona os css para responsividade
    frame_cart.style.opacity = '1'; // Remove a opacidade do div

    // ===================== TABLE ================
    const table = document.createElement("table") // Cria o elemento table
    table.classList.add("flex-grow-1", "mtable", "table-hover") // Add o css da mesma

    // ===================== THEAD ================
    const thead = document.createElement("thead") // Cria o table head
    const tr_head = document.createElement("tr") // Cria o table row para add os cabeçalhos

    const th_nome = document.createElement("th") // Cria o elemento table header (Cabeçalho)
    th_nome.textContent = "Nome" // Adiciona o valor "Nome"

    const th_quantidade = document.createElement("th") // Cria o elemento table header (Cabeçalho)
    th_quantidade.textContent = "Qnt." // Add a o valor quantidade

    const th_valor = document.createElement("th") // Cria o elemento table header (Cabeçalho)
    th_valor.textContent = "R$" // Adiciona o R$ simbilizando o total do produto

    const th_acao = document.createElement("th") // Cria o elemento table header (Cabeçalho)
    th_acao.textContent = "Ações" // Add o valor ações para botões

    // Faz a add dos elementoos ao table header(TR)
    tr_head.appendChild(th_nome) 
    tr_head.appendChild(th_quantidade)
    tr_head.appendChild(th_valor)
    tr_head.appendChild(th_acao)
    thead.appendChild(tr_head) // add ao THEAD (Table Head)

    // ===================== TBODY ================
    const tbody = document.createElement("tbody") // Cria o Table Body(TBODY)
    tbody.id = "table_prod_body" // Seta seu id para uso posterior

    table.appendChild(thead) // Adiciona à tabela, o thead
    table.appendChild(tbody) // Add à tabela, o tbody
    frame_cart.appendChild(table) // Adiciona a tabela ao frame cart 
    add_row_prod_table(produto, tbody) // Adiciona a linha do produto inicial
}

function add_row_prod_table(produto, tb = null) { // Adiciona um produto a tabela acima
    const subtotal_label = document.getElementById("subtotal") // Label de Subtotal
    const total_prod = document.getElementById("total_prod") // Label do Total
    const tbody = tb ? tb : document.getElementById("table_prod_body") // Table Body(TBODY)

    // Confirma se o produto já está no cart
    if (cart[produto.nome]) { // Caso esteja 
        cart[produto.nome] ? cart[produto.nome]++ : cart[produto.nome] = 1

        const tr = document.getElementById(`tr_${produto.nome.toLowerCase().trim()}`)

        const td_quantidade = tr.querySelector(".td_quantidade")
        td_quantidade.textContent = cart[produto.nome]
        td_quantidade.classList.add("td_quantidade")

        const td_valor = tr.querySelector(".td_valor")
        td_valor.textContent = to_real(produto.valor * cart[produto.nome])
        td_valor.classList.add("td_valor")

    } else { // Caso contrário
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
                total -= parseFloat(produto.valor) * parseFloat(cart[produto.nome]);
                subtotal -= parseFloat(produto.valor) * parseFloat(cart[produto.nome]);

                total_prod.textContent = "Total: " + to_real(total);
                subtotal_label.textContent = "Sub-Total: " + to_real(subtotal);

                tbody.removeChild(tr);
                delete cart[produto.nome];

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
    subtotal += produto.valor
    total += produto.valor
    subtotal_label.textContent = "Sub-Total: " + to_real(subtotal);
    total_prod.textContent = "Total: " + to_real(subtotal - desconto);
    document.getElementById("subtotal_label_pay").textContent = "Sub-Total: " + to_real(subtotal);
    document.getElementById("discount_label_pay").textContent = "Desconto: " + to_real(desconto);
    document.getElementById("total_label_pay").textContent = "Total: " + to_real(subtotal - desconto);
}

async function set_products() {
    const req = await model_product.get_categories() // Rquisição dos produtos por categorias
    const products_by_categ = await req.json(); // JSON Fnal
    const card_prods = document.getElementById("produtos")
    card_prods.classList.add("d-flex", "flex-wrap", "justify-content-start", "align-items-center", "gap-2")
    
    if (req.ok) {
        for (const categorie in products_by_categ) {
            const products = products_by_categ[categorie];
            if (Object.keys(products).length > 0) {
                const div_categ = document.createElement("div");
                div_categ.classList.add("d-flex", "w-100", "mt-5", "fs-4", "div_categ");

                const span_categ = document.createElement("span");
                span_categ.classList.add("text-truncate", "w-100");
                span_categ.textContent = categorie;

                const div_prod = document.createElement("div");
                div_prod.classList.add("d-flex", "w-100", "mt-5", "fs-4", "div_categ_prod");

                div_categ.appendChild(span_categ);
                div_categ.appendChild(div_prod);
                card_prods.appendChild(div_categ);

                products.forEach(prod => {
                    card_prods.appendChild(create_btn_sales(prod))
                });
            };
        };
    };
};

let activeInput;
document.querySelectorAll(".vkactive").forEach(input => { //  Seta o active input para o Keyboard digital
    input.addEventListener("focus", () => {
        document.querySelectorAll(".vkactive").forEach(input => input.style.border = "none");
        input.style.border = "2px solid var(--primary)";
        activeInput = input;
    });
});

document.querySelectorAll('#virtual_keyboard button').forEach(btn => { // Evento de clique no virtual keyboard
    btn.addEventListener('click', () => {
        if( !activeInput ) { return }
        const key = btn.dataset.key;

        if (key === 'clear') {
        activeInput.value = '';
        return;
        }

        if (key === 'back') {
        activeInput.value =
            activeInput.value.slice(0, -1);
        return;
        }

        activeInput.value += key;
    });
});

document.querySelectorAll("#pay_btns button").forEach(main_btn => { // Evento para pagamento
    main_btn.addEventListener("click", () => {
        if(Object.keys(cart).length <= 0) { show_toast("Adicione um produto ao carrinho primeiro!", "alert"); return};
        if(!document.getElementById("mat_pay").value) { show_toast("Matricula Obrigatoria", "alert"); return };
        
        const valor = parseFloat(document.getElementById("payment_value").value);
        const valor_final = valor ? parseFloat(valor) : subtotal - desconto;
        const payment_method = main_btn.textContent.includes(" - External") 
            ? main_btn.textContent.replace(" - External", "") 
            : main_btn.textContent;
        const amount_paid = document.getElementById("amount_paid");
        const missing_to_pay = document.getElementById("missing_to_pay");

        if(valor_final <= 0) { show_toast("Valor informado não permitido", "danger"); return };

        const modal_body = document.createElement("div");
        modal_body.classList.add("d-flex", "flex-column", "fs-4", "text-center", "gap-4", "align-items-center");
        modal_body.textContent = `Deseja confirmar o pagamento de ${to_real(valor_final)} no ${payment_method}?`;
        
        const div_button = document.createElement("div");
        div_button.classList.add("d-flex", "gap-4");
        
        const btn_yes = document.createElement("button");
        btn_yes.classList.add("btn", "btn-lg", "bg-primary");
        btn_yes.textContent = "Sim";
        
        const btn_no = document.createElement("button");
        btn_no.classList.add("btn", "btn-lg", "bg-outline-primary");
        btn_no.textContent = "Não";
        btn_no.setAttribute("data-bs-dismiss", "modal") ;
        
        div_button.appendChild(btn_yes);
        div_button.appendChild(btn_no);
        modal_body.appendChild(div_button);

        const modal = create_modal(null, modal_body);
        modal.show();
        
        btn_yes.addEventListener("click", async() => {
            pago[payment_method.toUpperCase()] += valor_final
            valor_pago = 0
            for(let method in pago){ valor_pago += parseFloat(pago[method]) };
            console.log(valor_pago);
            
            faltante = total - valor_pago
            amount_paid.textContent = "Valor Pago: " +  to_real(valor_final)
            missing_to_pay.textContent = "Falta Pagar: " +  to_real(faltante)
            modal.hide(),
            document.getElementById("payment_value").value = ''
            
            if(faltante <= 0){
                let isModalClose;
                if(faltante < 0){
                    const div = document.createElement("div")
                    div.classList.add("d-flex", "flex-column", "gap-4", "justify-content-center")
                    
                    const sp = document.createElement("span")
                    sp.textContent = `Troco do cliente: ${to_real(parseFloat(faltante))}`
                    
                    const btn = document.createElement("button")
                    btn.classList.add("btn", "btn-primary")
                    btn.textContent = "Fechar"
                    btn.dataset.bsDismiss = "modal"
                    
                    div.appendChild(sp)
                    div.appendChild(btn)
                    
                    const modal_troco = create_modal(null, div);
                    modal_troco.show()
                    isModalClose = modal_troco.style.display ? true : false
                };

                const sp = document.createElement("span")
                sp.textContent = "Salvando a venda, aguarde..."

                const modal_payment = create_modal(null, sp);
                modal_payment.show()
                // const res = await send_sale(cart, id_client, desconto)
                const res = true
                if(res){modal_payment.hide(); show_toast('Venda com sucesso')};
            };
        });
    });
});

document.querySelectorAll(".btn-categ").forEach(el => { // Evento para click do botao de tela
    el.addEventListener("click", () => {
        const targetId = el.dataset.target; // Obtem o target
        // Remove de cada Botao o modo ativo e seta apenas para o clickado
        document.querySelectorAll(".btn-categ").forEach(e => e.classList.remove("active"));

        el.classList.add("active"); // Adiciona o css (active)

        // Remove de cada frame o modo ativo e seta apenas para o desejado
        document.querySelectorAll('.sale_card_frame')
        .forEach(screen => screen.classList.remove('active'));

        // Adiciona o css para mostrar em evidencia (Ativo)
        document.getElementById(targetId).classList.add('active');
    });
});

set_products(); 