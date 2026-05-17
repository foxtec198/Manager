import { BrandModel } from "../models/brands.js"
import { icon_trash, icon_edit } from "../utils/icons.js"
import { create_table, show_toast, is_loading } from "../utils/ui.js"

const brand_model = new BrandModel()

export async function setBrandTable(filter = null) {
    is_loading(true)
    const req = await brand_model.get(filter)
    const res = await req.json()

    if (req.ok) {
        document.querySelectorAll("[data-api='brands']").forEach(el => {
            el.innerHTML = ""
            const data = res ? res.map(item => {
                return [
                    item.nome || item.name || item.id,
                    item.descricao || item.description || "-",
                    gridjs.html(`
                        <button class="btn btn-sm btn-primary" onclick="edit_brand(${item.id})">
                            ${icon_edit}
                        </button>
                        <button class="btn btn-sm btn-danger" onclick="delete_brand(${item.id})">
                            ${icon_trash}
                        </button>
                    `)
                ]
            }) : []
            create_table(el, data, ["Nome", "Descrição", "Ações"], 10)
        })
        show_toast("Marcas carregadas")
    } else {
        show_toast("Erro ao carregar marcas", "danger")
    }
    is_loading(false)
}

export async function createBrand(formData) {
    is_loading(true)
    const req = await brand_model.set(formData)
    const res = await req.json()

    if (req.ok) {
        show_toast(res.message || "Marca criada com sucesso")
        setBrandTable()
        document.getElementById("brandForm")?.reset()
    } else {
        show_toast(res.message || "Erro ao criar marca", "danger")
    }
    is_loading(false)
}

window.edit_brand = async function(id) {
    const req = await brand_model.get(`id=${id}`)
    const res = await req.json()
    if (req.ok && res.length > 0) {
        const brand = res[0]
        document.getElementById("brandId").value = brand.id
        document.getElementById("brandName").value = brand.nome || brand.name
        document.getElementById("brandDesc").value = brand.descricao || brand.description
        document.getElementById("submitBrandBtn").textContent = "Atualizar Marca"
    }
}

export async function updateBrand(id, formData) {
    is_loading(true)
    const req = await brand_model.update(id, formData)
    const res = await req.json()

    if (req.ok) {
        show_toast("Marca atualizada com sucesso")
        setBrandTable()
        document.getElementById("brandForm")?.reset()
        document.getElementById("submitBrandBtn").textContent = "Criar Marca"
    } else {
        show_toast(res.message || "Erro ao atualizar marca", "danger")
    }
    is_loading(false)
}

window.delete_brand = async function(id) {
    if (confirm("Tem certeza que deseja remover esta marca?")) {
        is_loading(true)
        const req = await brand_model.delete(id)
        const res = await req.json()

        if (req.ok) {
            show_toast("Marca removida com sucesso")
            setBrandTable()
        } else {
            show_toast(res.message || "Erro ao remover marca", "danger")
        }
        is_loading(false)
    }
}
