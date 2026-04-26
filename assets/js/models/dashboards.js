import { ApiRequest } from "../utils/request.js"

export class InitDashboard {
    async get(mat){
        const request = new ApiRequest(`dashboards?mat=${mat}`)
        return await request.send()
    }
}

export class PaymentsDashboard {
    async get(filter){
        const request = new ApiRequest(`dashboards/payments?filter=${filter}`)
        return await request.send()
    }

}