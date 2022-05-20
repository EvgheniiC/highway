import { Navigate } from "react-router-dom";
import { useState } from "react";

export default function NoTodo() {
    const [redirect, setRedirect] = useState(false);
    const backHome = () => {
        setRedirect(true)
    }
    if(redirect) {
        return (<Navigate to="/" />)
    } else {

        return (
            <main style={{ padding: "1rem" }}>
                <h2><button className="btn-sixt" onClick={backHome} tabIndex="-1">⌂</button> No invoices left for validation!!</h2>
                <img alt="Mickey Mouse dancing" src="https://media.giphy.com/media/cIxxFKOTCPwX9DUk7L/giphy.gif" />
            </main>
        );
    }
}