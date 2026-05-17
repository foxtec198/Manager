import { PartsModel } from "../models/parts.js"
import { icon_trash, icon_edit } from "../utils/icons.js"
import { create_table, show_toast, is_loading } from "../utils/ui.js"

const parts_model = new PartsModel()

export async function setPartsTable(filter = null) {
    is_loading(true)
    const req = await parts_model.get(filter)
    const res = await req.json()

    if (req.ok) {
        document.querySelectorAll("[data-api='parts']").forEach(el => {
            el.innerHTML = ""
            const data = res ? res.map(item => {
                return [
                    item.nome || item.name || item.id,
                    item.codigo || item.code || "-",
                    item.categoria || item.category || "-",
                    item.estoque || item.stock || "0",
                    item.preco || item.price || "0",
                    gridjs.html(`
                        <button class="btn btn-sm btn-primary" onclick="edit_parts(${item.id})">
                            ${icon_edit}
                        </button>
                        <button class="btn btn-sm btn-danger" onclick="delete_parts(${item.id})">
                            ${icon_trash}
                        </button>
                    `)
                ]
            }) : []
            create_table(el, data, ["Nome", "Código", "Categoria", "Estoque", "Preço", "Ações"], 10)
        })
        show_toast("Peças carregadas")
    } else {
        show_toast("Erro ao carregar peças", "danger")
    }
    is_loading(false)
}

export async function createParts(formData) {
    is_loading(true)
    const req = await parts_model.set(formData)
    const res = await req.json()

    if (req.ok) {
        show_toast(res.message || "Peça criada com sucesso")
        setPartsTable()
        document.getElementById("partsForm")?.reset()
    } else {
        show_toast(res.message || "Erro ao criar peça", "danger")
    }
    is_loading(false)
}

window.edit_parts = async function(id) {
    const req = await parts_model.get(`id=${id}`)
    const res = await req.json()
    if (req.ok && res.length > 0) {
        const parts = res[0]
        document.getElementById("partsId").value = parts.id
        document.getElementById("partsName").value = parts.nome || parts.name
        document.getElementById("partsCode").value = parts.codigo || parts.code
        document.getElementById("partsCategory").value = parts.categoria || parts.category
        document.getElementById("partsStock").value = parts.estoque || parts.stock
        document.getElementById("partsPrice").value = parts.preco || parts.price
        document.getElementById("submitPartsBtn").textContent = "Atualizar Peça"
    }
}

export async function updateParts(id, formData) {
    is_loading(true)
    const req = await parts_model.update(id, formData)
    const res = await req.json()

    if (req.ok) {
        show_toast("Peça atualizada com sucesso")
        setPartsTable()
        document.getElementById("partsForm")?.reset()
        document.getElementById("submitPartsBtn").textContent = "Criar Peça"
    } else {
        show_toast(res.message || "Erro ao atualizar peça", "danger")
    }
    is_loading(false)
}

window.delete_parts = async function(id) {
    if (confirm("Tem certeza que deseja remover esta peça?")) {
        is_loading(true)
        const req = await parts_model.delete(id)
        const res = await req.json()

        if (req.ok) {
            show_toast("Peça removida com sucesso")
            setPartsTable()
        } else {
            show_toast(res.message || "Erro ao remover peça", "danger")
        }
        is_loading(false)
    }
}
