import connect from "../config/request"

class PosService{
    async get(){
        return await connect.get("caixa");
    };
    
    async open(mat, value){
        const data = {mat:mat, valor:value};
        return await connect.post("/caixa", data);
    };

    async close(mat){
        return await connect.delete("/caixa", { data: { mat: mat } });
    };

    async last_close(){
        return await connect.get("/caixa/last_closed");
    };

    async append(mat, value){
        return await connect.patch("/caixa", {mat:mat, valor:value});
    };
}

export default new PosService();