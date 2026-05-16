import { ProdutctsModel } from "../models/products.js";
import { create_btn_sales, add_row_prod_table, create_prod_table } from "./sales_service.js";
import { word_normalize } from "../utils/ui.js";

const model_product = new ProdutctsModel();

// Seta a lista de produtos de forma dinamica
document.querySelectorAll(".grid-products").forEach(async el => {
    const req = await model_product.get_categories() // Rquisição dos produtos por categorias
    const products_by_categ = await req.json(); // JSON Fnal
    const isProd = el.dataset.set === "products" ? true : false;
    if (req.ok && isProd) {
        el.classList.add("d-flex", "flex-wrap", "justify-content-start", "align-items-center", "gap-2")
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
                el.appendChild(div_categ);

                products.forEach(prod => {
                    el.appendChild(create_btn_sales(prod))
                });
            };
        };
    };
});

// Seta a  busca de produtos de forma dinamica
document.querySelectorAll("[data-search='products']").forEach(el => {
    el.addEventListener("input", () => {
        document.querySelectorAll('[data-name]').forEach(produto => {
            const search = word_normalize(el.value)
                .toLowerCase()
                .trim()
                .split(' ');

            const name = word_normalize(produto.dataset.name)
                .toLowerCase();

            const words_name = name
                .split(' ');

            const finded = search.every(busca =>
                words_name.some(p => p.startsWith(busca))
            );

            finded
                ? produto.classList.remove("hidden")
                : produto.classList.add("hidden");

            search == '' ? produto.classList.remove("hidden") : null;
        })
    })
})