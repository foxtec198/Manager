import { EmailModel } from "../models/email.js"
import { show_toast, is_loading } from "../utils/ui.js"

const email_model = new EmailModel()

export async function sendEmail(emailData) {
    is_loading(true)

    const req = await email_model.send(emailData)
    const res = await req.json()

    if (req.ok) {
        show_toast(res.message || "Email enviado com sucesso")
        return res
    } else {
        show_toast(res.message || "Erro ao enviar email", "danger")
    }
    is_loading(false)
}
