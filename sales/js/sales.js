const categorias = [
    {
        id: 1,
        nome: "Acessorios",
    },
    {
        id: 2,
        nome: "Celulares", 
    },
    {
        id: 3,
        nome: "Manutenção"
    }
]

const produtos = [
    {
        "id": 1,
        "nome": "A22 BRANCO",
        "quantidade": 1,
        "valor": 450,
        "categoria": "Celulares",
        "fornecedor": "ODC",
        "desconto": 0,
        "ean": 1,
        "img": "blank.png"
    },
    {
        "id": 2,
        "nome": "G85",
        "quantidade": 1,
        "valor": 600,
        "categoria": "Celulares",
        "fornecedor": "ODC",
        "desconto": 0,
        "ean": 2,
        "img": "blank.png"
    },
    {
        "id": 3,
        "nome": "FONE DE HMASTON",
        "quantidade": 10,
        "valor": 20,
        "categoria": "Acessorios",
        "fornecedor": "ODC",
        "desconto": 0,
        "ean": 1,
        "img": "blank.png"
    },
]

async function set_products(params) {
    // Elementos
    const sale_card = document.getElementById("sale_card");
    const sale_card_btn = document.getElementById("sale_card_buttons");
    const sale_card_prods = document.getElementById("sale_card_prods");
    
    // Consultas
    // const categorias = await get_categories()
    // const produtos = await get_products()

    // Cria o botao para todas as categorias
    const div_all_categ = document.createElement("div")
    div_all_categ.classList.add("d-flex", "justify-content-start", "flex-grow-1", "align-items-start", "frame-categ")

    const btn_all_categ = document.createElement("button");
    btn_all_categ.classList.add('btn-categ', 'active');
    btn_all_categ.textContent = "Todas Categorias";
    btn_all_categ.addEventListener("click", () => {
        sale_card.querySelectorAll(".btn-categ").forEach(b => b.classList.remove('active'));
        btn_all_categ.classList.add("active");
        sale_card.querySelectorAll(".frame-categ").forEach(f => f.style.display = "none")
        div_all_categ.style.display = ""

    });
    sale_card_btn.appendChild(btn_all_categ);

    if(categorias) {
        categorias.forEach(categoria => {
            const div_categ = document.createElement("div")
            div_categ.classList.add("d-flex", "justify-content-start", "flex-grow-1", "align-items-start", "frame-categ")
            div_categ.textContent = categoria.nome
            sale_card_prods.appendChild(div_categ)
            
            // Cria os botoes de categoria
            const btn_categ = document.createElement("button");
            btn_categ.classList.add("btn-categ");
            btn_categ.textContent = categoria.nome;
            btn_categ.addEventListener("click", () => {
                sale_card.querySelectorAll(".btn-categ").forEach(b => b.classList.remove('active'));
                sale_card.querySelectorAll(".frame-categ").forEach(f => f.style.display = "none")

                btn_categ.classList.add("active");
                div_categ.style.display = ""

            });
            sale_card_btn.appendChild(btn_categ);
        })
    }

    produtos.forEach(produto => {
        // Criação do botão de produto
        const btn_prod = document.createElement("button")
        btn_prod.style.border = "none"
        btn_prod.style.color = "#fff"
        btn_prod.style.background = "#333"
        btn_prod.style.borderRadius = "30px"
        btn_prod.classList.add("text-truncate", "shadow-lg", "text-center", "px-5")
        btn_prod.innerHTML = `
            <p>${produto.nome}</p>
            <p>${to_real(produto.valor)}</p>
        `

        div_all_categ.appendChild(btn_prod)
    })

}
set_products()

// ======================================================================== PRODUCTS
async function get_products() {
    const req = await request("produtos")
    const res = await req.json()

    if(req.ok){ return res}
    else{ show_toast(res, "danger"); return }
}

async function get_categories() {
    const req = await request("categorias")
    const res = await req.json()

    if(req.ok){ return res}
    else{ show_toast(res, "danger"); return }
}