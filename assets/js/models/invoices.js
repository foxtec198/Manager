import { ApiRequest } from "../utils/request.js"

export class InvoiceModel {
    async get(filter = null) {
        const request = new ApiRequest("nnf")
        if (filter) request.path = `nnf?${filter}`
        request.method = "GET"
        return await request.send()
    }

    async set(data) {
        const request = new ApiRequest("nnf", "POST")
        request.data = data
        return await request.send()
    }

    async update(id, data) {
        const request = new ApiRequest("nnf", "PATCH")
        request.data = { id, ...data }
        return await request.send()
    }

    async delete(id) {
        const request = new ApiRequest(`nnf?id=${id}`, "DELETE")
        return await request.send()
    }
}
