import connect from "../config/request";

export class MiniReportService{
    async get(filter="week"){
        return await connect.get(`dashboards/payments?filter=${filter}`)
    }
};