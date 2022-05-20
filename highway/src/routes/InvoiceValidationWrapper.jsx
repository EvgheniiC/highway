import axios from "axios";
import { Navigate } from 'react-router-dom';
import { useState } from "react";

export default function InvoiceValidationWrapper() {
    const [comp, setComp] = useState(<div></div>);
    
    console.log("################# axios",axios.get("/get_free_invoice_val").then((res) => {console.log(res)}))
    console.log("################# axios",axios.get("/get_free_invoice_val"))
    axios.get("/get_free_invoice_val").then((res) => {
        console.log("################# InvoiceValidationWrapper")
        if (res.data["M_IV_BARCODE"] === 0) {
            setComp(<Navigate to={"/all_work_done"} />)
        } else {
            setComp(<Navigate to={"/invoice_validation/" + res.data["M_IV_BARCODE"].toString()} />)
        }
    })
    return (<div>
        {
            comp
        }

    </div>

    );
}