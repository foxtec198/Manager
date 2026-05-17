import { FileModel } from "../models/files.js"
import { show_toast, is_loading } from "../utils/ui.js"

const file_model = new FileModel()

export async function uploadFile(file) {
    is_loading(true)
    const formData = new FormData()
    formData.append("file", file)

    const req = await file_model.set(formData)
    const res = await req.json()

    if (req.ok) {
        show_toast(res.message || "Arquivo enviado com sucesso")
        return res
    } else {
        show_toast(res.message || "Erro ao enviar arquivo", "danger")
    }
    is_loading(false)
}

export async function downloadFile(path) {
    is_loading(true)
    const req = await file_model.get(path)

    if (req.ok) {
        const blob = await req.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = path.split("/").pop()
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        a.remove()
        show_toast("Arquivo baixado")
    } else {
        show_toast("Erro ao baixar arquivo", "danger")
    }
    is_loading(false)
}

export async function deleteFile(id) {
    if (confirm("Tem certeza que deseja remover este arquivo?")) {
        is_loading(true)
        const req = await file_model.delete(id)
        const res = await req.json()

        if (req.ok) {
            show_toast("Arquivo removido com sucesso")
        } else {
            show_toast(res.message || "Erro ao remover arquivo", "danger")
        }
        is_loading(false)
    }
}
