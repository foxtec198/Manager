import { ReleaseModel } from "../models/releases.js"
import { icon_trash, icon_edit } from "../utils/icons.js"
import { create_table, show_toast, is_loading } from "../utils/ui.js"

const release_model = new ReleaseModel()

export async function setReleaseTable(filter = null) {
    is_loading(true)
    const req = await release_model.get(filter)
    const res = await req.json()

    if (req.ok) {
        document.querySelectorAll("[data-api='releases']").forEach(el => {
            el.innerHTML = ""
            const data = res ? res.map(item => {
                return [
                    item.numero || item.number || item.id,
                    item.tipo || item.type || "-",
                    item.valor || item.value || "0",
                    item.data || item.date || "-",
                    gridjs.html(`
                        <button class="btn btn-sm btn-primary" onclick="edit_release(${item.id})">
                            ${icon_edit}
                        </button>
                        <button class="btn btn-sm btn-danger" onclick="delete_release(${item.id})">
                            ${icon_trash}
                        </button>
                    `)
                ]
            }) : []
            create_table(el, data, ["Número", "Tipo", "Valor", "Data", "Ações"], 10)
        })
        show_toast("Saídas carregadas")
    } else {
        show_toast("Erro ao carregar saídas", "danger")
    }
    is_loading(false)
}

export async function createRelease(formData) {
    is_loading(true)
    const req = await release_model.set(formData)
    const res = await req.json()

    if (req.ok) {
        show_toast(res.message || "Saída criada com sucesso")
        setReleaseTable()
        document.getElementById("releaseForm")?.reset()
    } else {
        show_toast(res.message || "Erro ao criar saída", "danger")
    }
    is_loading(false)
}

window.edit_release = async function(id) {
    const req = await release_model.get(`id=${id}`)
    const res = await req.json()
    if (req.ok && res.length > 0) {
        const release = res[0]
        document.getElementById("releaseId").value = release.id
        document.getElementById("releaseNumber").value = release.numero || release.number
        document.getElementById("releaseType").value = release.tipo || release.type
        document.getElementById("releaseValue").value = release.valor || release.value
        document.getElementById("submitReleaseBtn").textContent = "Atualizar Saída"
    }
}

export async function updateRelease(id, formData) {
    is_loading(true)
    const req = await release_model.update(id, formData)
    const res = await req.json()

    if (req.ok) {
        show_toast("Saída atualizada com sucesso")
        setReleaseTable()
        document.getElementById("releaseForm")?.reset()
        document.getElementById("submitReleaseBtn").textContent = "Criar Saída"
    } else {
        show_toast(res.message || "Erro ao atualizar saída", "danger")
    }
    is_loading(false)
}

window.delete_release = async function(id) {
    if (confirm("Tem certeza que deseja remover esta saída?")) {
        is_loading(true)
        const req = await release_model.delete(id)
        const res = await req.json()

        if (req.ok) {
            show_toast("Saída removida com sucesso")
            setReleaseTable()
        } else {
            show_toast(res.message || "Erro ao remover saída", "danger")
        }
        is_loading(false)
    }
}
