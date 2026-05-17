import { ApiRequest } from "../utils/request.js"

export class EmailModel {
    async send(data) {
        const request = new ApiRequest("email", "POST", null, "general")
        request.data = data
        return await request.send()
    }
}
