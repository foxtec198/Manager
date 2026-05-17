import { CategoryModel } from "../models/categories.js"
import { icon_trash, icon_edit } from "../utils/icons.js"
import { create_table, show_toast, is_loading } from "../utils/ui.js"

const category_model = new CategoryModel()

export async function setCategoryTable(filter = null) {
    is_loading(true)
    const req = await category_model.get(filter)
    const res = await req.json()

    if (req.ok) {
        document.querySelectorAll("[data-api='categories']").forEach(el => {
            el.innerHTML = ""
            const data = res ? res.map(item => {
                return [
                    item.nome || item.name || item.id,
                    item.descricao || item.description || "-",
                    gridjs.html(`
                        <button class="btn btn-sm btn-primary" onclick="edit_category(${item.id})">
                            ${icon_edit}
                        </button>
                        <button class="btn btn-sm btn-danger" onclick="delete_category(${item.id})">
                            ${icon_trash}
                        </button>
                    `)
                ]
            }) : []
            create_table(el, data, ["Nome", "Descrição", "Ações"], 10)
        })
        show_toast("Categorias carregadas")
    } else {
        show_toast("Erro ao carregar categorias", "danger")
    }
    is_loading(false)
}

export async function createCategory(formData) {
    is_loading(true)
    const req = await category_model.set(formData)
    const res = await req.json()

    if (req.ok) {
        show_toast(res.message || "Categoria criada com sucesso")
        setCategoryTable()
        document.getElementById("categoryForm")?.reset()
    } else {
        show_toast(res.message || "Erro ao criar categoria", "danger")
    }
    is_loading(false)
}

window.edit_category = async function(id) {
    const req = await category_model.get(`id=${id}`)
    const res = await req.json()
    if (req.ok && res.length > 0) {
        const category = res[0]
        document.getElementById("categoryId").value = category.id
        document.getElementById("categoryName").value = category.nome || category.name
        document.getElementById("categoryDesc").value = category.descricao || category.description
        document.getElementById("submitCategoryBtn").textContent = "Atualizar Categoria"
    }
}

export async function updateCategory(id, formData) {
    is_loading(true)
    const req = await category_model.update(id, formData)
    const res = await req.json()

    if (req.ok) {
        show_toast("Categoria atualizada com sucesso")
        setCategoryTable()
        document.getElementById("categoryForm")?.reset()
        document.getElementById("submitCategoryBtn").textContent = "Criar Categoria"
    } else {
        show_toast(res.message || "Erro ao atualizar categoria", "danger")
    }
    is_loading(false)
}

window.delete_category = async function(id) {
    if (confirm("Tem certeza que deseja remover esta categoria?")) {
        is_loading(true)
        const req = await category_model.delete(id)
        const res = await req.json()

        if (req.ok) {
            show_toast("Categoria removida com sucesso")
            setCategoryTable()
        } else {
            show_toast(res.message || "Erro ao remover categoria", "danger")
        }
        is_loading(false)
    }
}
