import { OrderModel } from "../models/orders.js"
import { icon_trash, icon_edit } from "../utils/icons.js"
import { create_table, show_toast, is_loading } from "../utils/ui.js"

const order_model = new OrderModel()

export async function setOrderTable(filter = null) {
    is_loading(true)
    const req = await order_model.get(filter)
    const res = await req.json()

    if (req.ok) {
        document.querySelectorAll("[data-api='orders']").forEach(el => {
            el.innerHTML = ""
            const data = res ? res.map(item => {
                return [
                    item.numero || item.number || item.id,
                    item.cliente || item.client || "-",
                    item.status || "-",
                    item.data_criacao || item.created_at || "-",
                    gridjs.html(`
                        <button class="btn btn-sm btn-primary" onclick="edit_order(${item.id})">
                            ${icon_edit}
                        </button>
                        <button class="btn btn-sm btn-danger" onclick="delete_order(${item.id})">
                            ${icon_trash}
                        </button>
                    `)
                ]
            }) : []
            create_table(el, data, ["Número", "Cliente", "Status", "Data", "Ações"], 10)
        })
        show_toast("Ordens carregadas")
    } else {
        show_toast("Erro ao carregar ordens", "danger")
    }
    is_loading(false)
}

export async function createOrder(formData) {
    is_loading(true)
    const req = await order_model.set(formData)
    const res = await req.json()

    if (req.ok) {
        show_toast(res.message || "Ordem criada com sucesso")
        setOrderTable()
        document.getElementById("orderForm")?.reset()
    } else {
        show_toast(res.message || "Erro ao criar ordem", "danger")
    }
    is_loading(false)
}

window.edit_order = async function(id) {
    const req = await order_model.get(`id=${id}`)
    const res = await req.json()
    if (req.ok && res.length > 0) {
        const order = res[0]
        document.getElementById("orderId").value = order.id
        document.getElementById("orderNumber").value = order.numero || order.number
        document.getElementById("orderClient").value = order.cliente || order.client
        document.getElementById("orderStatus").value = order.status || ""
        document.getElementById("submitOrderBtn").textContent = "Atualizar Ordem"
    }
}

export async function updateOrder(id, formData) {
    is_loading(true)
    const req = await order_model.update(id, formData)
    const res = await req.json()

    if (req.ok) {
        show_toast("Ordem atualizada com sucesso")
        setOrderTable()
        document.getElementById("orderForm")?.reset()
        document.getElementById("submitOrderBtn").textContent = "Criar Ordem"
    } else {
        show_toast(res.message || "Erro ao atualizar ordem", "danger")
    }
    is_loading(false)
}

window.delete_order = async function(id) {
    if (confirm("Tem certeza que deseja remover esta ordem?")) {
        is_loading(true)
        const req = await order_model.delete(id)
        const res = await req.json()

        if (req.ok) {
            show_toast("Ordem removida com sucesso")
            setOrderTable()
        } else {
            show_toast(res.message || "Erro ao remover ordem", "danger")
        }
        is_loading(false)
    }
}
