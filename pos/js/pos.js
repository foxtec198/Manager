// ====================================================================== LOGICA
async function set_badge_pos(){
    const js = await get_pos()

    if(js.status){
        const status = document.getElementById('statusCaixa')
        status.classList.remove('placeholder')
        status.classList.add('bg-primary')
        status.textContent = 'Caixa Aberto - ' + to_real(js.valor)
        btn = document.getElementById('btnAbrirCaixa')
        if(btn){btn.disabled = true}
    }else{
        const status = document.getElementById('statusCaixa')
        status.classList.remove('placeholder')
        status.classList.add('bg-red')
        status.textContent = `Caixa Fechado - R$ 0`
    }
}

async function set_expenses() {
    const expenses = await get_expenses()

    expenses.forEach(expense => {
        const list_of_expenses = document.getElementById("lista_de_despesas")
        const date = new Date(expense.data)
        const date_with_time = date.toLocaleDateString("pt-br", {"day": "numeric", "month": "long", "hour": "2-digit", "minute": "2-digit"})
        
        const li_expense = document.createElement("li")
        li_expense.classList.add(
            "list-group-item", "d-flex",
            "justify-content-between", "align-items-center"
        )
        li_expense.innerHTML = `<span>${expense.motivo} - ${to_real(expense.valor)} - ${date_with_time}</span>`
        
        const div_btn = document.createElement("div")
        div_btn.classList.add("btn-group")
        
        const btn_del = document.createElement("button")
        btn_del.classList.add("btn", 'btn-red')
        btn_del.innerHTML = icon_lixeira
        btn_del.addEventListener("click", async function(){
            if(delete_expense(expense.id)){ // Tenta deletar a despesa, e caso consiga remove-a
                list_of_expenses.removeChild(li_expense)
                show_toast("Removido com sucesso")
            }
        })

        const btn_view = document.createElement("button")
        btn_view.classList.add("btn", "btn-primary")
        btn_view.innerHTML = icon_eye
        btn_view.addEventListener("click", async function(){
            show_toast("Removido com sucesso " + expense.id)
            // ...
        })

        div_btn.appendChild(btn_view)
        div_btn.appendChild(btn_del)

        li_expense.appendChild(div_btn)
        list_of_expenses.appendChild(li_expense)
        

    });
}

// ====================================================================== POS
// Obtem o status do caixa
async function get_pos() {
    const req = await request("caixa/")
    const res = await req.json()
    if(req.ok){return res}
    else{show_toast(res, "error"); return false}
}

// ====================================================================== DESPESAS
// Obtem as despesas cadastradas
async function get_expenses(data=null, id=null) {
    if(data){req = await request("despesas/?date="+data)}
    else if(id){req = await request("despesas/?id="+id)}
    else{req = await request("despesas/")}

    const res = await req.json()
    console.log(res)
    if(req.ok){return res}
    else{show_toast(res, "error"); return false}
}

// Deleta uma despesa
async function delete_expense(expense_id) {
    const req = await request("despesas/?id="+ expense_id, "DELETE")
    const res = await req.json()
    if(req.ok){return res}
    else{show_toast(res, "error"); return false}
}


get_expenses("20-08-2025")