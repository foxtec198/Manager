import { EmployeeModel } from "../models/employees.js"
import { icon_trash, icon_edit } from "../utils/icons.js"
import { create_table, show_toast, is_loading } from "../utils/ui.js"

const employee_model = new EmployeeModel()

export async function setEmployeeTable(filter = null) {
    is_loading(true)
    const req = await employee_model.get(filter)
    const res = await req.json()

    if (req.ok) {
        document.querySelectorAll("[data-api='employees']").forEach(el => {
            el.innerHTML = ""
            const data = res ? res.map(item => {
                return [
                    item.nome || item.name || item.id,
                    item.matricula || item.registration || "-",
                    item.cargo || item.position || "-",
                    item.email || "-",
                    gridjs.html(`
                        <button class="btn btn-sm btn-primary" onclick="edit_employee(${item.id})">
                            ${icon_edit}
                        </button>
                        <button class="btn btn-sm btn-danger" onclick="delete_employee(${item.id})">
                            ${icon_trash}
                        </button>
                    `)
                ]
            }) : []
            create_table(el, data, ["Nome", "Matrícula", "Cargo", "Email", "Ações"], 10)
        })
        show_toast("Funcionários carregados")
    } else {
        show_toast("Erro ao carregar funcionários", "danger")
    }
    is_loading(false)
}

export async function createEmployee(formData) {
    is_loading(true)
    const req = await employee_model.set(formData)
    const res = await req.json()

    if (req.ok) {
        show_toast(res.message || "Funcionário criado com sucesso")
        setEmployeeTable()
        document.getElementById("employeeForm")?.reset()
    } else {
        show_toast(res.message || "Erro ao criar funcionário", "danger")
    }
    is_loading(false)
}

window.edit_employee = async function(id) {
    const req = await employee_model.get(`id=${id}`)
    const res = await req.json()
    if (req.ok && res.length > 0) {
        const employee = res[0]
        document.getElementById("employeeId").value = employee.id
        document.getElementById("employeeName").value = employee.nome || employee.name
        document.getElementById("employeeRegistration").value = employee.matricula || employee.registration
        document.getElementById("employeePosition").value = employee.cargo || employee.position
        document.getElementById("employeeEmail").value = employee.email || ""
        document.getElementById("submitEmployeeBtn").textContent = "Atualizar Funcionário"
    }
}

export async function updateEmployee(id, formData) {
    is_loading(true)
    const req = await employee_model.update(id, formData)
    const res = await req.json()

    if (req.ok) {
        show_toast("Funcionário atualizado com sucesso")
        setEmployeeTable()
        document.getElementById("employeeForm")?.reset()
        document.getElementById("submitEmployeeBtn").textContent = "Criar Funcionário"
    } else {
        show_toast(res.message || "Erro ao atualizar funcionário", "danger")
    }
    is_loading(false)
}

window.delete_employee = async function(id) {
    if (confirm("Tem certeza que deseja remover este funcionário?")) {
        is_loading(true)
        const req = await employee_model.delete(id)
        const res = await req.json()

        if (req.ok) {
            show_toast("Funcionário removido com sucesso")
            setEmployeeTable()
        } else {
            show_toast(res.message || "Erro ao remover funcionário", "danger")
        }
        is_loading(false)
    }
}
