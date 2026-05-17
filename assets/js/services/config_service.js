import { ConfigModel } from "../models/config.js"
import { show_toast, is_loading } from "../utils/ui.js"

const config_model = new ConfigModel()

export async function loadConfig() {
    is_loading(true)
    const req = await config_model.get()
    const res = await req.json()

    if (req.ok) {
        document.querySelectorAll("[data-api='config']").forEach(el => {
            if (res && res.length > 0) {
                const config = res[0]
                Object.keys(config).forEach(key => {
                    const input = document.getElementById(`config_${key}`)
                    if (input) {
                        input.value = config[key] || ""
                    }
                })
            }
        })
        show_toast("Configurações carregadas")
    } else {
        show_toast("Erro ao carregar configurações", "danger")
    }
    is_loading(false)
}

export async function saveConfig(formData) {
    is_loading(true)
    const req = await config_model.set(formData)
    const res = await req.json()

    if (req.ok) {
        show_toast(res.message || "Configurações salvas com sucesso")
    } else {
        show_toast(res.message || "Erro ao salvar configurações", "danger")
    }
    is_loading(false)
}

export async function updateConfig(id, formData) {
    is_loading(true)
    const req = await config_model.update(id, formData)
    const res = await req.json()

    if (req.ok) {
        show_toast("Configurações atualizadas com sucesso")
    } else {
        show_toast(res.message || "Erro ao atualizar configurações", "danger")
    }
    is_loading(false)
}
