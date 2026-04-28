import { ProdutctsModel } from "../models/products.js";
import { to_real } from "../utils/ui.js";

const model_product = new ProdutctsModel();

function create_btn_sales(produto) { // Cria os botaos dos produtos de forma estrategica
    const btn_product = document.createElement("button"); // Cria oelemento btn
    // Add o css ao btn
    btn_product.classList.add(
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
        // Confira se o CART já tem algum produto dentro, caso tenha sómente adiciona a tabela, caso não, cria a tabela
        Object.keys(cart).length > 0 ? add_row_prod_table(produto) : create_prod_table(produto)
    })

    return btn_product // Retorna o btn
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

set_products();