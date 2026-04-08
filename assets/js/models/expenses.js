class ExpensesModel{
    async get(filter, value){
        switch(filter){
            case "id": request.path = `despesas?id=${value}`
            case "date": request.path = `despesas?date=${value}`
            default: request.path = "despesas"
        }
        return await request.send()
    }
}