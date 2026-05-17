import { ProviderModel } from "../models/providers.js"
import { icon_trash, icon_edit } from "../utils/icons.js"
import { create_table, show_toast, is_loading } from "../utils/ui.js"

const provider_model = new ProviderModel()

export async function setProviderTable(filter = null) {
    is_loading(true)
    const req = await provider_model.get(filter)
    const res = await req.json()

    if (req.ok) {
        document.querySelectorAll("[data-api='providers']").forEach(el => {
            el.innerHTML = ""
            const data = res ? res.map(item => {
                return [
                    item.nome || item.name || item.id,
                    item.email || "-",
                    item.telefone || item.phone || "-",
                    gridjs.html(`
                        <button class="btn btn-sm btn-primary" onclick="edit_provider(${item.id})">
                            ${icon_edit}
                        </button>
                        <button class="btn btn-sm btn-danger" onclick="delete_provider(${item.id})">
                            ${icon_trash}
                        </button>
                    `)
                ]
            }) : []
            create_table(el, data, ["Nome", "Email", "Telefone", "Ações"], 10)
        })
        show_toast("Fornecedores carregados")
    } else {
        show_toast("Erro ao carregar fornecedores", "danger")
    }
    is_loading(false)
}

export async function createProvider(formData) {
    is_loading(true)
    const req = await provider_model.set(formData)
    const res = await req.json()

    if (req.ok) {
        show_toast(res.message || "Fornecedor criado com sucesso")
        setProviderTable()
        document.getElementById("providerForm")?.reset()
    } else {
        show_toast(res.message || "Erro ao criar fornecedor", "danger")
    }
    is_loading(false)
}

window.edit_provider = async function(id) {
    const req = await provider_model.get(`id=${id}`)
    const res = await req.json()
    if (req.ok && res.length > 0) {
        const provider = res[0]
        document.getElementById("providerId").value = provider.id
        document.getElementById("providerName").value = provider.nome || provider.name
        document.getElementById("providerEmail").value = provider.email || ""
        document.getElementById("providerPhone").value = provider.telefone || provider.phone || ""
        document.getElementById("submitProviderBtn").textContent = "Atualizar Fornecedor"
    }
}

export async function updateProvider(id, formData) {
    is_loading(true)
    const req = await provider_model.update(id, formData)
    const res = await req.json()

    if (req.ok) {
        show_toast("Fornecedor atualizado com sucesso")
        setProviderTable()
        document.getElementById("providerForm")?.reset()
        document.getElementById("submitProviderBtn").textContent = "Criar Fornecedor"
    } else {
        show_toast(res.message || "Erro ao atualizar fornecedor", "danger")
    }
    is_loading(false)
}

window.delete_provider = async function(id) {
    if (confirm("Tem certeza que deseja remover este fornecedor?")) {
        is_loading(true)
        const req = await provider_model.delete(id)
        const res = await req.json()

        if (req.ok) {
            show_toast("Fornecedor removido com sucesso")
            setProviderTable()
        } else {
            show_toast(res.message || "Erro ao remover fornecedor", "danger")
        }
        is_loading(false)
    }
}
