class InitDashboard {
    async get(mat){
        request.path = `dashboards?mat=${mat}`
        return await request.send()
    }
}

class PaymentsDashboard {
    async get(filter){
        request.path = `dashboards/payments?filter=${filter}`
        return await request.send()
    }

}