import { ApiRequest } from "../utils/request.js"

export class ConfigModel {
    async get(filter = null) {
        const request = new ApiRequest("config")
        if (filter) request.path = `config?${filter}`
        request.method = "GET"
        return await request.send()
    }

    async set(data) {
        const request = new ApiRequest("config", "POST")
        request.data = data
        return await request.send()
    }

    async update(id, data) {
        const request = new ApiRequest("config", "PATCH")
        request.data = { id, ...data }
        return await request.send()
    }
}
