import { PosModel } from "../models/pos.js"

const pos = new PosModel()

console.log(
    await pos.last_closed(), await pos.status()
);
