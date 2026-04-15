import { ExpenseModel } from "../models/expenses.js"
import { icon_trash } from "../utils/icons.js";
import { create_table } from "../utils/ui.js";
import { to_real } from "../utils/ui.js";

// DOM referente a tabela de despesas - Generica
export async function setExpenses(){ 
    const res = await new ExpenseModel("week").get(); // Requisição das despesas    
    const columns = ["Data", "Motivo", "Funcionário", "Valor", "Ações"];
    
    document.querySelectorAll("[data-api]").forEach(el => {
        if(el.dataset.api == "expenses"){
            el.innerHTML = "";
            // Dados usando MAP para formatar os dados da tabela
            const data = res ? res.map(expense => {
                console.log(expense);
                
                return [
                    new Date(expense.data)
                    .toLocaleDateString(
                        'pt-br', 
                        {'day': '2-digit', 'month': 'long', 'hour': '2-digit', 'minute': "2-digit"}
                    ), expense.motivo, expense.funcionario.toUpperCase(),
                    to_real(expense.valor),
                    gridjs.html(`<button class="btn btn-danger" onclick="set_delete_expense(${expense.id})">${icon_trash}</button>`)
                ]
            }) : {}; 
            return create_table(el, data, columns); // Cria a tabela e indexa
        };
    });
};