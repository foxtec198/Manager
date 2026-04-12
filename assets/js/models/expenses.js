import { ApiRequest } from "../utils/request.js"

// GERENCIAMENTO DE DESPESAS!
export class ExpensesModel{
    // OBTÉM AS DESPESAS (COM FILTRO OU SEM)
    async get(filter, value){
        const request = new ApiRequest()
        switch(filter){
            case "id": request.path = `despesas?id=${value}`
            case "date": request.path = `despesas?date=${value}`
            default: request.path = "despesas"
        }
        request.method = "GET"
        return await request.send()
    }

    // CADASTRA UMA DESPESA
    async set(mat, value, reason) {
        const request = new ApiRequest("despesas", "POST")
        request.data = { mat:mat, valor:value, motivo:reason }
        return await request.send()
        
    }
    
    // ALTERA A DESPESA CADASTRADA
    async update(id, mat, value, reason) {
        const request = new ApiRequest("despesas", "PATCH")
        request.data = { id:id, mat:mat, valor:value, motivo:reason }
        return await request.send()
    }

    // REMOVE UMA DESPESA
    async delete(id) {
        const request = new ApiRequest(`despesa?id=${id}`, "DELETE")
        return await request.send()
    }
}