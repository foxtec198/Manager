import connect from "../../config/request"
import { capitalize } from "../../utils/format"

import "./main.css"

export default function Init() {
    const display_name = sessionStorage.getItem("display_name")

    async function _() {
        const res = await connect.get("dashboards?mat=8")
        console.log(res.data);
    }_()

    return (
        <>
            <div className="flex flex-column w-full px-5">
                <h1 className="">Bem vindo ao Hubbix, {capitalize(display_name)}.</h1>

                <div className="flex">
                    {/* CARD HERE */}
                    <div id="person">
                        <div id="person_info">
                            <span >[DISPLAY NAME]</span>
                            <span id="person_sales">R$ 0</span>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}