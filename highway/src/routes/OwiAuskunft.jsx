import axios from "axios";
import { useState } from "react";
import { Navigate } from "react-router-dom";

export default function Expenses() {

    const [backHome, setBackHome] = useState(false)

    const [AMT, setAMT] = useState("")
    const [DAT, setDAT] = useState(null)
    const [UHR, setUHR] = useState("")
    const [AKTZ, setAKTZ] = useState("")
    const [driverCountry, setDriverCountry] = useState("")
    const [authMail, setAuthMail] = useState("")
    const [driverAnnouncementDisable, setDriverAnnouncementDisable] = useState(false)
    const [driverDataFound, setDriverDataFound] = useState(false)


    const [err, setErr] = useState(false)
    const [mailInfo, setMailInfo] = useState("")
    const [aktzErr, setAktzErr] = useState("")
    const [driverDataUi, setDriverDataUi] = useState("")
    const [driverData, setDriverData] = useState({})

    const announceDriver = () => {
        setMailInfo("")
        setAktzErr("")
        let err_exists = false;
        if (isEmpty(authMail) || authMail.search(/.+@.+\..+/) === -1) {
            err_exists = true
            setMailInfo(<p className="text-danger text-center">Bitte gib eine Mail Adresse an!</p>)
        }
        if (isEmpty(AKTZ)) {
            err_exists = true
            setAktzErr("Bitte gib ein Aktenzeichen an")
        }
        if (!err_exists) {
            setDriverAnnouncementDisable(true)
            console.log("Announcing driver")
            axios.post("/announce_driver", {
                "mail": authMail,
                "owiData": {
                    "amt": AMT,
                    "dat": DAT,
                    "uhr": UHR,
                    "aktz": AKTZ
                },
                "driverData": driverData,
                "driverCountry": driverCountry
            }).then((res) => {
                if (res.data["success"]) {
                    setMailInfo(<p className="text-success text-center fw-bold">Fahrerdaten wurden bekanntgegeben!</p>)
                } else {
                    setMailInfo(<p className="text-danger text-center fw-bold">Etwas ist schiefgelaufen! Bitte gib Laurenz Bescheid.</p>)
                }
            }).except(() => {
                setMailInfo(<p className="text-danger text-center fw-bold">Etwas ist schiefgelaufen! Bitte gib Laurenz Bescheid.</p>)
            })
        }
    }

    const isEmpty = (val) => {
        if (val === null || val === undefined || val === "" || val.length === 0) return true
        return false
    }

    const getDriver = () => {
        setErr(false)
        setDriverDataUi("")
        setDriverData({})
        setMailInfo("")
        setAuthMail("")
        setDriverCountry("")
        setAKTZ("")
        if (isEmpty(AMT) || isEmpty(DAT) || isEmpty(UHR)) {
            setErr(true)
        } else {
            axios.post("/driver_info", {
                "amt": AMT,
                "dat": DAT,
                "uhr": UHR
            }).then((res) => {
                // no data found
                if (!res.data["success"]) {
                    setDriverDataFound(false)
                    setDriverDataUi(<p className="text-danger">Keine Fahrerdaten gefunden!</p>)
                } else {
                    setDriverDataFound(true)
                    setDriverData({
                        "forename": res.data["driverData"]["forename"],
                        "surname": res.data["driverData"]["surname"],
                        "street": res.data["driverData"]["street"],
                        "zip": res.data["driverData"]["zip"],
                        "city": res.data["driverData"]["city"],
                        "country": res.data["driverData"]["country"],
                        "licDate": res.data["driverData"]["licDate"],
                        "licCity": res.data["driverData"]["licCity"],
                        "licCountry": res.data["driverData"]["licCountry"],
                        "birthDay": res.data["driverData"]["birthDay"],
                        "rate": res.data["driverData"]["rate"],
                        "mvnr": res.data["driverData"]["mvnr"]
                    })
                    setDriverCountry(res.data["driverData"]["driverCountry"])
                    setDriverAnnouncementDisable(false)
                    setDriverDataUi(
                        <div>
                            <table className="table">
                                <tbody>
                                    <tr><th scope="col">Vorname</th><td>{res.data["driverData"]["forename"]}</td></tr>
                                    <tr><th scope="col">Nachname</th><td>{res.data["driverData"]["surname"]}</td></tr>
                                    <tr><th scope="col">Adresse</th><td>{res.data["driverData"]["street"]}</td></tr>
                                    <tr><th scope="col">PLZ / Ort</th><td>{res.data["driverData"]["zip"]} {res.data["driverData"]["city"]}</td></tr>
                                    <tr><th scope="col">Führerschein Datum</th><td>{res.data["driverData"]["licDate"]}</td></tr>
                                    <tr><th scope="col">Geburtsdatum</th><td>{res.data["driverData"]["birthDay"]}</td></tr>
                                    <tr><th scope="col">Rate</th><td>{res.data["driverData"]["rate"]}</td></tr>
                                    <tr><th scope="col">Mietvertragsnummer</th><td>{res.data["driverData"]["mvnr"]}</td></tr>
                                </tbody>
                            </table>

                        </div>
                    )
                }
            })
        }
    }

    const setUHRhelper = (val) => {
        val = val.replace(/\D/g, '')
        if (val > 0 && val < 2359) setUHR(val)
    }

    if (backHome) {
        return (
            <Navigate replace to="/" />
        )
    } else {


        return (

            <main style={{ padding: "1rem" }}>
                <h2><button onClick={(e) => { setBackHome(true) }} className="btn-sixt" tabIndex="-1">⌂</button> OWI Fahrerauskunft</h2>
                <div className="row">
                    <div className="col-3">

                        <div className="form-group mb-2">
                            <label for="AMT">Nummernschild</label>
                            <input mandatory type="text" className="form-control" id="AMT" aria-describedby="AMT" value={AMT} onChange={(e) => setAMT(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ''))} placeholder="z.B. MNY5461" maxLength={15} />
                        </div>
                        <div className="form-group mb-2">
                            <label for="owidate">Datum</label>
                            <input mandatory type="date" lang="de-DE" className="form-control" id="owidate" aria-describedby="owidate" value={DAT} onChange={(e) => setDAT(e.target.value)} placeholder="Datum" />
                        </div>
                        <div className="form-group mb-2">
                            <label for="owitime">Uhrzeit</label>
                            <input mandatory type="number" className="form-control" id="owitime" aria-describedby="owitime" value={UHR} min={0} max={2359} onChange={(e) => setUHRhelper(e.target.value)} placeholder="z.B. 942 (9:42)" />
                        </div>
                        {err && <p className="text-danger">Bitte alle Felder füllen!</p>}
                        <div className="form-group mb-2">
                            <button onClick={getDriver} className="w-100 btn btn-sixt">Wer wars?</button>
                        </div>
                    </div>
                    <div className="col-3">
                        {
                            driverDataUi
                        }
                        {
                            driverDataFound &&
                            <div>
                                <div className="form-group mb-2">
                                    <label for="driverCountry">Land Fahrer</label>
                                    <input type="text" className="form-control" id="driverCountry" aria-describedby="driverCountry" value={driverCountry} onChange={(e) => setDriverCountry(e.target.value)} placeholder="z.B. Germany" />
                                </div>
                                <div className="form-group mb-2">
                                    <label for="aktz">Aktenzeichen</label>
                                    <input mandatory type="text" className="form-control" id="aktz" aria-describedby="aktz" value={AKTZ} onChange={(e) => setAKTZ(e.target.value)} placeholder="z.B. 1.303.205.645.766" />
                                    <p className="text-danger">{aktzErr}</p>
                                </div>
                                <div className="form-group mb-2">
                                    <label for="authMail">Mailadresse</label>
                                    <input mandatory id="authMail" type="email" className="form-control mb-2" value={authMail} onChange={(e) => { setAuthMail(e.target.value) }} placeholder="behörde@digitales-deutschland.de" />
                                    {mailInfo}
                                </div>
                                <button className="w-100 btn btn-sixt" disabled={driverAnnouncementDisable} onClick={announceDriver}>Fahrerdaten bekanntgeben</button>
                            </div>
                        }
                    </div>
                </div>
            </main>
        );
    }
}