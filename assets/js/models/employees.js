import { ApiRequest } from "../utils/request.js"

export class EmployeeModel {
    async get(filter = null) {
        const request = new ApiRequest("funcionarios")
        if (filter) request.path = `funcionarios?${filter}`
        request.method = "GET"
        return await request.send()
    }

    async set(data) {
        const request = new ApiRequest("funcionarios", "POST")
        request.data = data
        return await request.send()
    }

    async update(id, data) {
        const request = new ApiRequest("funcionarios", "PATCH")
        request.data = { id, ...data }
        return await request.send()
    }

    async delete(id) {
        const request = new ApiRequest(`funcionarios?id=${id}`, "DELETE")
        return await request.send()
    }
}
