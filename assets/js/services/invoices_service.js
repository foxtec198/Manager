import { InvoiceModel } from "../models/invoices.js"
import { icon_trash, icon_edit } from "../utils/icons.js"
import { create_table, show_toast, is_loading } from "../utils/ui.js"

const invoice_model = new InvoiceModel()

export async function setInvoiceTable(filter = null) {
    is_loading(true)
    const req = await invoice_model.get(filter)
    const res = await req.json()

    if (req.ok) {
        document.querySelectorAll("[data-api='invoices']").forEach(el => {
            el.innerHTML = ""
            const data = res ? res.map(item => {
                return [
                    item.numero || item.number || item.id,
                    item.cliente || item.client || "-",
                    item.valor || item.value || "0",
                    item.status || "-",
                    gridjs.html(`
                        <button class="btn btn-sm btn-primary" onclick="edit_invoice(${item.id})">
                            ${icon_edit}
                        </button>
                        <button class="btn btn-sm btn-danger" onclick="delete_invoice(${item.id})">
                            ${icon_trash}
                        </button>
                    `)
                ]
            }) : []
            create_table(el, data, ["Número NF", "Cliente", "Valor", "Status", "Ações"], 10)
        })
        show_toast("Notas fiscais carregadas")
    } else {
        show_toast("Erro ao carregar notas fiscais", "danger")
    }
    is_loading(false)
}

export async function createInvoice(formData) {
    is_loading(true)
    const req = await invoice_model.set(formData)
    const res = await req.json()

    if (req.ok) {
        show_toast(res.message || "Nota fiscal criada com sucesso")
        setInvoiceTable()
        document.getElementById("invoiceForm")?.reset()
    } else {
        show_toast(res.message || "Erro ao criar nota fiscal", "danger")
    }
    is_loading(false)
}

window.edit_invoice = async function(id) {
    const req = await invoice_model.get(`id=${id}`)
    const res = await req.json()
    if (req.ok && res.length > 0) {
        const invoice = res[0]
        document.getElementById("invoiceId").value = invoice.id
        document.getElementById("invoiceNumber").value = invoice.numero || invoice.number
        document.getElementById("invoiceClient").value = invoice.cliente || invoice.client
        document.getElementById("invoiceValue").value = invoice.valor || invoice.value
        document.getElementById("invoiceStatus").value = invoice.status || ""
        document.getElementById("submitInvoiceBtn").textContent = "Atualizar Nota Fiscal"
    }
}

export async function updateInvoice(id, formData) {
    is_loading(true)
    const req = await invoice_model.update(id, formData)
    const res = await req.json()

    if (req.ok) {
        show_toast("Nota fiscal atualizada com sucesso")
        setInvoiceTable()
        document.getElementById("invoiceForm")?.reset()
        document.getElementById("submitInvoiceBtn").textContent = "Criar Nota Fiscal"
    } else {
        show_toast(res.message || "Erro ao atualizar nota fiscal", "danger")
    }
    is_loading(false)
}

window.delete_invoice = async function(id) {
    if (confirm("Tem certeza que deseja remover esta nota fiscal?")) {
        is_loading(true)
        const req = await invoice_model.delete(id)
        const res = await req.json()

        if (req.ok) {
            show_toast("Nota fiscal removida com sucesso")
            setInvoiceTable()
        } else {
            show_toast(res.message || "Erro ao remover nota fiscal", "danger")
        }
        is_loading(false)
    }
}
