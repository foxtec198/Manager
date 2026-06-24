import connect from "../config/request";

class ExpensesServices{
    async get(date){
        return date
            ? await connect.get(`/despesas?data=${date.toLocaleDateString(
                "pt-br", {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric'
                }
            )}`)
            : await connect.get('/despesas')
    };

    async create(mat, value, reason){
        const data = { mat: mat, valor: value, motivo: reason };
        return await connect.post("/despesas", data);
    };

    async delete(id){
        return await connect.delete(`/despesas?id=${id}`);
    }
};

export default new ExpensesServices();