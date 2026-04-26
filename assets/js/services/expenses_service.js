import { ExpenseModel } from "../models/expenses.js"
import { icon_trash } from "../utils/icons.js";
import { create_table, show_toast } from "../utils/ui.js";
import { to_real } from "../utils/ui.js";

// DOM referente a tabela de despesas - Generica
export async function setExpenses(filter = "week") {
    const req = await new ExpenseModel().get(filter); // Requisição das despesas    
    const res = await req.json();
    const columns = ["Data", "Motivo", "Funcionário", "Valor", "Ações"];

    if (req.ok) {
        document.querySelectorAll("[data-api]").forEach(el => {
            if (el.dataset.api == "expenses") {
                el.innerHTML = "";
                // Dados usando MAP para formatar os dados da tabela
                const data = res ? res.map(expense => {
                    return [
                        new Date(expense.data).toLocaleDateString('pt-br', { 'day': '2-digit', 'month': 'long', 'hour': '2-digit', 'minute': "2-digit" }),
                        expense.motivo,
                        expense.funcionario.toUpperCase(),
                        to_real(expense.valor),
                        gridjs.html(`<button class="btn btn-danger" onclick="delete_expense(${expense.id}, '${expense.motivo}')">${icon_trash}</button>`)
                    ]
                }) : {};
                create_table(el, data, columns, 5);
            };
        });
    };
};

window.delete_expense = async function delete_expense(expense_id, motivo) {
    if(confirm(`Certeza de que deseja remover permanentemente esta despesa? - (${motivo})`)){
        const req = await new ExpenseModel().delete(expense_id);
        const res = await req.json();
        if (req.ok) { setExpenses(); show_toast(res) };
    };
};