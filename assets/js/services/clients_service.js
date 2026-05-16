import { ClientModel } from "../models/clients.js"
import { word_normalize } from "../utils/ui.js";

const client_model = new ClientModel();

// Seta lista de clientes
document.querySelectorAll(".list-clients").forEach(async(el) => {
    const isClientArea = el.dataset.set == "clients" // 2FA for clients
    const req = await client_model.get() // Obtem os clientes
    const res = await req.json(); // JSON Final

    // Se requisição OK e campos OK seta os clientes de forma dinamica
    if(req.ok && isClientArea){
        res.forEach(client => {
            const li_client = document.createElement("li");
            li_client.classList.add("list-group-item", "list-group-item-hover");
            li_client.dataset.nameClient = `${client.nome} ${client.cpf}`

            const div_dados = document.createElement("div");
            div_dados.classList.add("d-flex", "justify-content-between", "align-items-center");
            
            const div_nome = document.createElement("div");

            const span_nome = document.createElement("p");
            span_nome.textContent = client.nome;

            const span_cpf = document.createElement("span");
            span_cpf.textContent = client.cpf;

            const btn = document.createElement("button");
            btn.classList.add("btn", "btn-lg", "fw-bold", "btn-primary", "rounded-pill");
            btn.textContent = "+";
            btn.addEventListener("click", function() {
                const id_client = client.id;
                
                document.querySelectorAll("[data-display='client']")
                .forEach(el => el.textContent = client.nome);

                document.querySelectorAll("[data-set='form-data-client']")
                .forEach(form =>{
                    form.name.value = client.nome
                    form.cpf.value = client.cpf
                    form.obs.value = client.obs == null || client.obs == '' 
                        ? "N/A" : client.obs;
                });
            });

            div_nome.appendChild(span_nome);
            div_nome.appendChild(span_cpf);
            div_dados.appendChild(div_nome);
            div_dados.appendChild(btn);

            li_client.appendChild(div_dados);
            el.appendChild(li_client);
        });
    };  
});

// Seta busca de clientes (Dinamico)
document.querySelectorAll("[data-search='clients']").forEach(el => {
    el.addEventListener("input", () => {
        document.querySelectorAll("[data-name-client]").forEach(client => {
            const search = word_normalize(el.value)
                .toLowerCase()
                .trim()
                .split(' ');

            const name = word_normalize(client.dataset.nameClient)
                .toLowerCase();

            const words_name = name
                .split(' ');

            const finded = search.every(busca =>
                words_name.some(p => p.startsWith(busca))
            );

            client.style.display = finded ? "" : "none"
        })
    })
})