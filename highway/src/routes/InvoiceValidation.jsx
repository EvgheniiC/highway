import { useState, useEffect } from "react";
import axios from "axios";
import { Navigate, useParams } from "react-router-dom";
// import { Document, Page, pdfjs } from "react-pdf";
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import SaveIcon from '@mui/icons-material/Save';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Paper, { PaperProps } from '@mui/material/Paper';
import Draggable from 'react-draggable';
import { PDFObject } from 'react-pdfobject'

// pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

// function PaperComponent(props: PaperProps) {
//   return (
//     <Draggable
//       handle="#draggable-dialog-title"
//       cancel={'[class*="MuiDialogContent-root"]'}
//     >
//       <Paper {...props} />
//     </Draggable>
//   );
// }

function PaperComponent() {
  return (
    <Draggable
      handle="#draggable-dialog-title"
      cancel={'[class*="MuiDialogContent-root"]'}
    >
      {/* <Paper {...props} /> */}
    </Draggable>
  );
}


const client_names = {
  "1": "Sixt GmbH & Co. Autovermietung KG",
  "10": "Sixt SE",
  "14": "BLM Verwaltungs GmbH",
  "15": "Sixt VerwGes mbH & Co. Gamma Immobilien KG",
  "16": "Sixt VerwGes mbH & Co. Delta Immobilien KG",
  "17": "SXT Res- und Vertriebs-GmbH & Co. KG",
  "18": "Sigma Grundstücks- & Verw-GmbH & Co. Immo. KG",
  "27": "Sigma Grundstuecks- und Verwaltungs GmbH",
  "30": "Sixt B.V.",
  "31": "Sixt Beteiligungen GmbH & Co. Holding KG",
  "32": "Sixt VerwGes mbH & Co. Epsilon Immobilien KG",
  "35": "Sixt Belgium BV",
  "37": "Sixt Air GmbH",
  "38": "SIXT S.a.r.l.",
  "42": "Sixt rent a car Limited",
  "52": "Sixt Car Sales GmbH",
  "53": "SXT Telesales GmbH",
  "56": "Sixt Ventures GmbH",
  "60": "SIXT SAS",
  "61": "Nizza Mobility SARL",
  "62": "SIXTI SARL",
  "63": "SIXT Developpement SARL",
  "66": "Sixt RENT A CAR S.L.U.",
  "67": "United Rentalsystem SARL",
  "69": "SIXT SARL (Monaco)",
  "70": "Sixt AG",
  "75": "Sixt rent-a-car AG",
  "78": "Sixt Transatlantik GmbH",
  "79": "Smaragd International Holding GmbH",
  "80": "Sixt GmbH",
  "88": "Sixt Rent a Car L.L.C.",
  "639": "SXT V+R Verwaltungs GmbH",
  "700": "SIXT Asset and Finance SAS",
  "701": "Sixt Limousine SARL",
  "702": "Sixt Financial Services GmbH",
  "703": "Sixt Ride Verwaltungs GmbH",
  "704": "Sixt Ride GmbH & Co. KG",
  "705": "SXT Services GmbH & Co.KG",
  "706": "SXT Verwaltungs-GmbH",
  "707": "Sixt Ride Holding GmbH & Co. KG",
  "708": "SXT Beteiligungsverwaltungs GmbH",
  "710": "Rhonesaone Mobility SARL",
  "711": "Phocemoove SARL",
  "717": "SIXT Seine SARL",
  "718": "Bopobiloc SARL",
  "719": "SXT Dienstleistungen GmbH & Co. KG",
  "720": "SXT International Projects and Finance GmbH",
  "723": "SXT Projects and Finance GmbH",
  "724": "Sigma Pi Holding GmbH & Co. KG",
  "725": "Lightning Holding GmbH & Co. KG",
  "726": "Matterhorn Holding GmbH & Co. KG",
  "727": "Blueprint Holding GmbH & Co. KG",
  "728": "Velocity Holding GmbH & Co. KG",
  "729": "Rail Paris Mobility SARL",
  "730": "Eiffel City Rent SARL",
  "731": "Francilsud Location SARL",
  "732": "Capitole Autos SARL",
  "733": "Benezet Location SARL",
  "734": "Wezz Rent SARL",
  "735": "Eaux Vives Location SARL",
  "736": "Flash Holding GmbH & Co. KG",
  "737": "Speed Holding GmbH & Co. KG",
  "738": "Varmayol Rent SARL",
  "739": "Septentri Loc SARL",
  "740": "Azucarloc SARL",
  "741": "Sixt Rent A Car SRL",
  "744": "Sixt International Services GmbH",
  "745": "Sixt R+D Private Limited",
  "746": "Sixt Verwaltungs B.V.",
  "747": "1501 NW 49 St 33309, LLC",
  "748": "Sixt Shack",
  "749": "Sixt Verwaltungs GmbH in Vösendorf",
  "750": "Sixt Beteiligungen GmbH",
  "752": "SXT Projects and Services GmbH",
  "753": "Sixt Ride Holding Verwaltungs GmbH",
  "754": "SXT DR Services GmbH",
  "757": "SXT Retina Lab Verwaltungs GmbH",
  "758": "SXT Retina Lab GmbH & Co. KG",
  "760": "Sixt GmbH",
  "761": "Atlic Rent SARL",
  "762": "Urbanizy Loc SARL",
  "763": "Akrimo Beteiligungs GmbH",
  "764": "AKRIMO GmbH & Co. KG",
  "766": "Sixt Limousine Switzerland AG",
  "767": "Sixt Canadian Holding GmbH",
  "771": "Brenoloc SARL",
  "772": "Sixt VerwGes mbH & Co. Sita Immobilien KG",
  "773": "Sixt Systems GmbH",
  "774": "Sixt Immobilien Beteiligungen GmbH",
  "776": "Ory Rent SARL",
  "777": "Mobimars SARL",
  "778": "Utilymoov SARL",
  "780": "Sixt Car Sales LLC",
  "781": "SIL CAP, LLC",
  "783": "Sixt Funding LLC",
  "784": "Sixt Fleet Transfer LLC",
  "785": "Sixt Funding Associate LLC",
  "786": "Tango International Holding GmbH",
  "788": "Sixt Franchise USA, LLC",
  "791": "Sixt Rent a Car Inc.",
  "792": "SXT Projects GmbH"
}

const clients = [
  "1 - Sixt GmbH & Co. Autovermietung KG",
  "10 - Sixt SE",
  "14 - BLM Verwaltungs GmbH",
  "15 - Sixt VerwGes mbH & Co. Gamma Immobilien KG",
  "16 - Sixt VerwGes mbH & Co. Delta Immobilien KG",
  "17 - SXT Res- und Vertriebs-GmbH & Co. KG",
  "18 - Sigma Grundstücks- & Verw-GmbH & Co. Immo. KG",
  "27 - Sigma Grundstuecks- und Verwaltungs GmbH",
  "30 - Sixt B.V.",
  "31 - Sixt Beteiligungen GmbH & Co. Holding KG",
  "32 - Sixt VerwGes mbH & Co. Epsilon Immobilien KG",
  "35 - Sixt Belgium BV",
  "37 - Sixt Air GmbH",
  "38 - SIXT S.a.r.l.",
  "42 - Sixt rent a car Limited",
  "52 - Sixt Car Sales GmbH",
  "53 - SXT Telesales GmbH",
  "56 - Sixt Ventures GmbH",
  "60 - SIXT SAS",
  "61 - Nizza Mobility SARL",
  "62 - SIXTI SARL",
  "63 - SIXT Developpement SARL",
  "66 - Sixt RENT A CAR S.L.U.",
  "67 - United Rentalsystem SARL",
  "69 - SIXT SARL (Monaco)",
  "70 - Sixt AG",
  "75 - Sixt rent-a-car AG",
  "78 - Sixt Transatlantik GmbH",
  "79 - Smaragd International Holding GmbH",
  "80 - Sixt GmbH",
  "88 - Sixt Rent a Car L.L.C.",
  "639 - SXT V+R Verwaltungs GmbH",
  "700 - SIXT Asset and Finance SAS",
  "701 - Sixt Limousine SARL",
  "702 - Sixt Financial Services GmbH",
  "703 - Sixt Ride Verwaltungs GmbH",
  "704 - Sixt Ride GmbH & Co. KG",
  "705 - SXT Services GmbH & Co.KG",
  "706 - SXT Verwaltungs-GmbH",
  "707 - Sixt Ride Holding GmbH & Co. KG",
  "708 - SXT Beteiligungsverwaltungs GmbH",
  "710 - Rhonesaone Mobility SARL",
  "711 - Phocemoove SARL",
  "717 - SIXT Seine SARL",
  "718 - Bopobiloc SARL",
  "719 - SXT Dienstleistungen GmbH & Co. KG",
  "720 - SXT International Projects and Finance GmbH",
  "723 - SXT Projects and Finance GmbH",
  "724 - Sigma Pi Holding GmbH & Co. KG",
  "725 - Lightning Holding GmbH & Co. KG",
  "726 - Matterhorn Holding GmbH & Co. KG",
  "727 - Blueprint Holding GmbH & Co. KG",
  "728 - Velocity Holding GmbH & Co. KG",
  "729 - Rail Paris Mobility SARL",
  "730 - Eiffel City Rent SARL",
  "731 - Francilsud Location SARL",
  "732 - Capitole Autos SARL",
  "733 - Benezet Location SARL",
  "734 - Wezz Rent SARL",
  "735 - Eaux Vives Location SARL",
  "736 - Flash Holding GmbH & Co. KG",
  "737 - Speed Holding GmbH & Co. KG",
  "738 - Varmayol Rent SARL",
  "739 - Septentri Loc SARL",
  "740 - Azucarloc SARL",
  "741 - Sixt Rent A Car SRL",
  "744 - Sixt International Services GmbH",
  "745 - Sixt R+D Private Limited",
  "746 - Sixt Verwaltungs B.V.",
  "747 - 1501 NW 49 St 33309, LLC",
  "748 - Sixt Shack",
  "749 - Sixt Verwaltungs GmbH in Vösendorf",
  "750 - Sixt Beteiligungen GmbH",
  "752 - SXT Projects and Services GmbH",
  "753 - Sixt Ride Holding Verwaltungs GmbH",
  "754 - SXT DR Services GmbH",
  "757 - SXT Retina Lab Verwaltungs GmbH",
  "758 - SXT Retina Lab GmbH & Co. KG",
  "760 - Sixt GmbH",
  "761 - Atlic Rent SARL",
  "762 - Urbanizy Loc SARL",
  "763 - Akrimo Beteiligungs GmbH",
  "764 - AKRIMO GmbH & Co. KG",
  "766 - Sixt Limousine Switzerland AG",
  "767 - Sixt Canadian Holding GmbH",
  "771 - Brenoloc SARL",
  "772 - Sixt VerwGes mbH & Co. Sita Immobilien KG",
  "773 - Sixt Systems GmbH",
  "774 - Sixt Immobilien Beteiligungen GmbH",
  "776 - Ory Rent SARL",
  "777 - Mobimars SARL",
  "778 - Utilymoov SARL",
  "780 - Sixt Car Sales LLC",
  "781 - SIL CAP, LLC",
  "783 - Sixt Funding LLC",
  "784 - Sixt Fleet Transfer LLC",
  "785 - Sixt Funding Associate LLC",
  "786 - Tango International Holding GmbH",
  "788 - Sixt Franchise USA, LLC",
  "791 - Sixt Rent a Car Inc.",
  "792 - SXT Projects GmbH"
]

const client_taxrates = {
  "1": 19,
  "88": 0,
  "60": 20,
  "66": 21,
  "741": 22,
  "42": 20,
  "80": 20,
  "30": 21,
  "10": 19,
  "75": 7.7,
  "35": 21,
  "700": 20,
  "38": 0,
  "719": 19,
  "17": 19,
  "705": 19,
  "780": 0,
  "710": 20,
  "52": 19,
  "53": 19,
  "37": 0,
  "15": 19,
  "771": 20,
  "67": 20,
  "733": 20,
  "747": 0
}

export default function InvoiceValidation() {
  let { barcode } = useParams();
  const [M_IV_ID, setM_IV_ID] = useState("")
  const [M_IV_BARCODE, setM_IV_BARCODE] = useState("")
  const [M_IV_MANDANT, setM_IV_MANDANT] = useState("1 - Sixt GmbH & Co. Autovermietung KG")
  const [M_IV_INVOICENUMBER, setM_IV_INVOICENUMBER] = useState("")
  const [M_IV_KINDOFINVOICE, setM_IV_KINDOFINVOICE] = useState("")
  const [M_IV_INVOICETYPE, setM_IV_INVOICETYPE] = useState("")
  const [M_IV_KREDITOR, setM_IV_KREDITOR] = useState("")
  const [M_IV_INVOICEDATE, setM_IV_INVOICEDATE] = useState("")
  const [M_IV_DELIVERYDATE, setM_IV_DELIVERYDATE] = useState("")
  const [M_IV_DELIVERYDATE_BIS, setM_IV_DELIVERYDATE_BIS] = useState("")
  const [M_IV_ORDERID, setM_IV_ORDERID] = useState("")
  const [M_IV_INVOICEAMOUNT, setM_IV_INVOICEAMOUNT] = useState("")
  const [M_IV_TOTALAMOUNT, setM_IV_TOTALAMOUNT] = useState("")
  const [M_IV_TAXRATE1, setM_IV_TAXRATE1] = useState("")
  const [M_IV_NETBASE1, setM_IV_NETBASE1] = useState("")
  const [M_IV_TAXRATE2, setM_IV_TAXRATE2] = useState("")
  const [M_IV_NETBASE2, setM_IV_NETBASE2] = useState("")
  const [M_IV_TAXAMOUNT1, setM_IV_TAXAMOUNT1] = useState("")
  const [M_IV_TAXAMOUNT2, setM_IV_TAXAMOUNT2] = useState("")
  const [M_IV_TOTALTAXAMOUNT, setM_IV_TOTALTAXAMOUNT] = useState("")
  const [M_IV_KOMMENTAR, setM_IV_KOMMENTAR] = useState("")
  const [M_IV_IBAN, setM_IV_IBAN] = useState("")
  const [M_IV_CURRENCY, setM_IV_CURRENCY] = useState("")
  const [M_IV_MAIL_SUBJECT, setM_IV_MAIL_SUBJECT] = useState("")
  const [S_KR_IBAN, setS_KR_IBAN] = useState("")
  const [S_KR_NAME, setS_KR_NAME] = useState("")
  // const [DEFAULT_TAXRATE, setDEFAULT_TAXRATE] = useState(0)
  const [pdf_loader, set_pdf_loader] = useState("Loading PDF...")
  const [M_IV_MANDANT_BACKEND, setM_IV_MANDANT_BACKEND] = useState(1)
  const [redirectMe, setRedirectMe] = useState(false)
  const [displayTaxes, setDisplayTaxes] = useState(true)
  const [kreSearchName, setKreSearchName] = useState("")
  const [kreSearchZip, setKreSearchZip] = useState("")
  const [noSuppliersFound, setNoSuppliersFound] = useState(false)

  const [suppliersFound, setSuppliersFound] = useState([])

  const [messageDiv, setMessageDiv] = useState("")
  const [numPages, setNumPages] = useState(null);
  const [pageNumber] = useState(1);

  const [supplierSearchOpen, setSupplierSearchOpen] = useState(false)

  // const onDocumentLoadSuccess = ({ numPages }) => {
  //   setNumPages(numPages);
  // };

  useEffect(() => {
    console.log("Fetching new invoice")
    // got a barcode
    axios.post("/get_free_invoice_val", {
      "M_IV_BARCODE": barcode
    }).then((res) => {

      const db_data = res.data;
      setM_IV_ID(db_data.M_IV_ID)
      setM_IV_BARCODE(db_data.M_IV_BARCODE)
      setM_IV_MANDANT(db_data.M_IV_MANDANT + " - " + client_names[db_data.M_IV_MANDANT])
      setM_IV_INVOICENUMBER(db_data.M_IV_INVOICENUMBER)
      setM_IV_KINDOFINVOICE(db_data.M_IV_KINDOFINVOICE)
      setM_IV_INVOICETYPE(db_data.M_IV_INVOICETYPE)
      setM_IV_KREDITOR(db_data.M_IV_KREDITOR)
      setM_IV_IBAN(db_data.M_IV_IBAN)
      setM_IV_INVOICEDATE(db_data.M_IV_INVOICEDATE)
      setM_IV_DELIVERYDATE(db_data.M_IV_DELIVERYDATE)
      setM_IV_DELIVERYDATE_BIS(db_data.M_IV_DELIVERYDATE_BIS)
      setM_IV_ORDERID(db_data.M_IV_ORDERID)
      setM_IV_INVOICEAMOUNT(db_data.M_IV_INVOICEAMOUNT)
      setM_IV_TOTALAMOUNT(db_data.M_IV_TOTALAMOUNT)
      setM_IV_TAXRATE1(db_data.M_IV_TAXRATE1)
      setM_IV_NETBASE1(db_data.M_IV_NETBASE1)
      setM_IV_TAXRATE2(db_data.M_IV_TAXRATE2)
      setM_IV_NETBASE2(db_data.M_IV_NETBASE2)
      setM_IV_TAXAMOUNT1(db_data.M_IV_TAXAMOUNT1)
      setM_IV_TAXAMOUNT2(db_data.M_IV_TAXAMOUNT2)
      setM_IV_TOTALTAXAMOUNT(db_data.M_IV_TOTALTAXAMOUNT)
      setS_KR_NAME(db_data.S_KR_NAME)
      setM_IV_KOMMENTAR(db_data.M_IV_KOMMENTAR)
      setDisplayTaxes(checkDisplayTaxes(db_data.M_IV_MANDANT))
      setM_IV_CURRENCY(db_data.M_IV_CURRENCY)
      setM_IV_MAIL_SUBJECT(db_data.M_IV_MAIL_SUBJECT)
      set_pdf_loader(
        <PDFObject url={"PROD_PDF/" + db_data.M_IV_BARCODE.toString() + '.pdf'} style={{ width: "100%" }} />
          // <Document
          // fileUrl={"PROD_PDF/" + db_data.M_IV_BARCODE.toString() + '.pdf'}
        //   file=
        //   onLoadSuccess={onDocumentLoadSuccess}
        // >
        //   <Page pageNumber={pageNumber} />
        // </Document>
      )
    })
  }, [])

  const setAllDates = (dateVal) => {
    setM_IV_INVOICEDATE(dateVal)
    setM_IV_DELIVERYDATE(dateVal)
    setM_IV_DELIVERYDATE_BIS(dateVal)
  }

  const checkDisplayTaxes = (client) => {
    client = parseInt(client)
    if (client === 88) return false
    return true
  }

  const setClientData = (mandant) => {
    if (mandant.search(/^\d+/g) > -1) {
      let client = [...mandant.matchAll(/^\d+/g)][0][0];
      setDisplayTaxes(checkDisplayTaxes(client))
      setM_IV_MANDANT_BACKEND(client)
      let def_tax = client_taxrates[client]
      setM_IV_TAXRATE1(def_tax)
      // setDEFAULT_TAXRATE(def_tax)
    }
  }

  const nvl = (val) => {
    if (val === null || val === undefined || val === "") return 0
    return val
  }

  useEffect(() => {
    // set M_IV_TOTALTAXAMOUNT and M_IV_TOTALAMOUNT
    let IV_TAXAMOUNT1 = parseFloat((parseFloat(nvl(M_IV_NETBASE1)) * (nvl(M_IV_TAXRATE1) / 100)).toFixed(2))
    setM_IV_TAXAMOUNT1(IV_TAXAMOUNT1);
    let IV_TAXAMOUNT2 = parseFloat((parseFloat(nvl(M_IV_NETBASE2)) * (nvl(M_IV_TAXRATE2) / 100)).toFixed(2))
    setM_IV_TAXAMOUNT2(IV_TAXAMOUNT2);
    let IV_TOTALTAXAMOUNT = parseFloat((IV_TAXAMOUNT1 + IV_TAXAMOUNT2).toFixed(2))
    setM_IV_TOTALTAXAMOUNT(IV_TOTALTAXAMOUNT);
    setM_IV_TOTALAMOUNT(parseFloat((parseFloat(M_IV_INVOICEAMOUNT) + IV_TOTALTAXAMOUNT).toFixed(2)))
  }, [M_IV_INVOICEAMOUNT, M_IV_TAXRATE1, M_IV_NETBASE1, M_IV_TAXRATE2, M_IV_NETBASE2])


  const enter_inv_nr = (event) => {
    setM_IV_INVOICENUMBER(event.target.value.toLowerCase().replace(/[^a-z0-9]/g, ''))
  }

  const save_data = (action) => {
    console.log("Saving data");
    setMessageDiv("")
    axios.post("/save_data", {
      "M_IV_MANDANT": M_IV_MANDANT_BACKEND,
      "M_IV_INVOICENUMBER": M_IV_INVOICENUMBER,
      "M_IV_KINDOFINVOICE": M_IV_KINDOFINVOICE,
      "M_IV_INVOICETYPE": M_IV_INVOICETYPE,
      "M_IV_KREDITOR": M_IV_KREDITOR,
      "M_IV_INVOICEDATE": M_IV_INVOICEDATE,
      "M_IV_DELIVERYDATE": M_IV_DELIVERYDATE,
      "M_IV_DELIVERYDATE_BIS": M_IV_DELIVERYDATE_BIS,
      "M_IV_ORDERID": M_IV_ORDERID,
      "M_IV_INVOICEAMOUNT": M_IV_INVOICEAMOUNT,
      "M_IV_TOTALAMOUNT": M_IV_TOTALAMOUNT,
      "M_IV_TAXRATE1": M_IV_TAXRATE1,
      "M_IV_NETBASE1": M_IV_NETBASE1,
      "M_IV_TAXRATE2": M_IV_TAXRATE2,
      "M_IV_NETBASE2": M_IV_NETBASE2,
      "M_IV_TAXAMOUNT1": M_IV_TAXAMOUNT1,
      "M_IV_TAXAMOUNT2": M_IV_TAXAMOUNT2,
      "M_IV_TOTALTAXAMOUNT": M_IV_TOTALTAXAMOUNT,
      "M_IV_KOMMENTAR": M_IV_KOMMENTAR,
      "M_IV_CURRENCY": M_IV_CURRENCY,
      "M_IV_ID": M_IV_ID
    }).then(() => {

      if (action === "save") {
        setMessageDiv(<div className="alert alert-success" role="alert">Speicherung erfolgreich!</div>)
        setTimeout(() => {
          setMessageDiv("")
        }, 2000);

      } else {
        // not only save, but also process
        axios.post("/finish_validation", {
          "NEW_STATUS": action,
          "M_IV_ID": M_IV_ID
        }).then((res) => {
          if (action === "Validated") {
            // if okay, forward to next invoice
            // if not, display error message
            if (!res.data.success) {
              setMessageDiv(<div className="alert alert-danger" role="alert">Es sind nicht alle Pflichtfelder gefüllt oder die Beträge stimmen nicht!</div>)
            } else {
              // forward to next invoice
              console.log("Sending you to next invoice...")
              setRedirectMe(true)
            }
          } else if (action === "Deleted") {
            if (M_IV_KOMMENTAR === null || M_IV_KOMMENTAR.length < 5) {
              setMessageDiv(<div className="alert alert-danger" role="alert">Bitte gib einen Kommentar ein (mind. 10 Zeichen)!</div>)
            } else {
              setRedirectMe(true)

            }
          } else if (action === "Resubmission") {
            if (M_IV_KOMMENTAR === null || M_IV_KOMMENTAR.length < 5) {
              setMessageDiv(<div className="alert alert-danger" role="alert">Bitte gib einen Kommentar ein (mind. 10 Zeichen)!</div>)
            } else {
              setRedirectMe(true)

            }
          }
        })
      }

    })
  }

  const searchForSupplier = () => {
    console.log("Searching for supplier");
    setSuppliersFound([])
    axios.post("/supplier_search", {
      "param": kreSearchName,
      "zip": kreSearchZip,
      "mandant": M_IV_MANDANT_BACKEND
    }).then((res) => {
      if (res.data.suppliers.length === 0) {
        setNoSuppliersFound(true)
      } else {
        setNoSuppliersFound(false)
        setSuppliersFound(res.data.suppliers)
      }
    })
  }

  const setNetBase2 = (val) => {
    setM_IV_NETBASE2(val)
    if (M_IV_TAXRATE2 === undefined || M_IV_TAXRATE2 === null) setM_IV_TAXRATE2(0)
    console.log(`M_IV_TAXRATE2 is ${M_IV_TAXRATE2}`)
    console.log(`M_IV_TAXAMOUNT2 is ${M_IV_TOTALAMOUNT}`)
    let gross_amt = parseFloat(parseFloat(M_IV_TOTALAMOUNT) + parseFloat(M_IV_TAXRATE2 / 100 * val)).toFixed(2);
    console.log(`gross_amt is ${gross_amt}`)

    setM_IV_TOTALAMOUNT(gross_amt)
  }

  const setKreSearchNameWrapper = (e) => {
    if (e.key === "Enter") searchForSupplier()
    else setKreSearchName(e.target.value)
  }

  const setKreSearchZipWrapper = (e) => {
    if (e.key === "Enter") searchForSupplier()
    else setKreSearchZip(e.target.value)
  }

  const setM_IV_KREDITORenter = (e) => {
    if (e.key === "Enter") {
      setNoSuppliersFound(false)
      setSuppliersFound([])
      setSupplierSearchOpen(true)
    } else {
      setM_IV_KREDITOR(e.target.value)
    }
  }

  const openModal = () => {
    setSupplierSearchOpen(true)
  }

  const handleClose = () => {
    setSupplierSearchOpen(false)
  }

  const [redirect, setRedirect] = useState(false);
  const backHome = () => {
    setRedirect(true)
  }
  if (redirectMe) {
    console.log("################# InvoiceValidation")
    return (<Navigate replace to="/invoice_validation_wrapper" />)
  } if (M_IV_BARCODE === "0") {
    console.log("################# InvoiceValidation")
    return (<Navigate replace to="/" />)
  } else {
    console.log("################# InvoiceValidation")
    return (

      <main className="p-4">
        <Dialog open={supplierSearchOpen} maxWidth="lg" BackdropProps={{ invisible: true }} onClose={handleClose} PaperComponent={PaperComponent} aria-labelledby="draggable-dialog-title">
          <DialogTitle>Kreditor-Suche</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              id="supplier_name"
              label="Nummer, IBAN, Name,..."
              type="text"
              fullWidth
              variant="standard"
              defaultValue={M_IV_IBAN}
              onKeyDown={(e) => { setKreSearchNameWrapper(e) }}
            />
            <TextField
              margin="dense"
              id="supplier_zip"
              label="Ort / PLZ"
              type="text"
              fullWidth
              variant="standard"
              onKeyDown={(e) => { setKreSearchZipWrapper(e) }}
            />
            {noSuppliersFound && <h5 className="mt-2 text-danger">No supplier found!</h5>}
            {suppliersFound.length > 0 &&

              <table className='table mt-3 table-hover'>
                <thead className='thead-dark'>
                  <tr>
                    <th>Nummer</th>
                    <th>Name</th>
                    <th>Strasse</th>
                    <th>Ort / PLZ</th>
                    <th>IBAN</th>
                    <th>VAT ID</th>
                    <th>Steuernummer</th>
                    <th>ABKZ</th>
                  </tr>
                </thead>
                <tbody>
                  {suppliersFound.map((row) => {
                    return (<tr onClick={(e) => {
                      setM_IV_KREDITOR(row["id"])
                      setS_KR_IBAN(row["iban"])
                      setS_KR_NAME(row["name"])
                      setSupplierSearchOpen(false)
                    }}>
                      <td>{row["id"]}</td>
                      <td>{row["name"]}</td>
                      <td>{row["street"]}</td>
                      <td>{row["zip"]}</td>
                      <td>{row["iban"]}</td>
                      <td>{row["vat"]}</td>
                      <td>{row["ste"]}</td>
                      <td>{row["abk"]}</td>

                    </tr>)
                  })}
                </tbody>
              </table>
            }
          </DialogContent>
        </Dialog>
        <h2><button className="btn-sixt" onClick={backHome} tabIndex="-1">⌂</button> Barcode {M_IV_BARCODE}</h2>
        {redirect && <Navigate replace to="/" />}
        <div id="validation-div" className="row">

          <hr />

          <div className="col">
            <div className="row p-2">
              {messageDiv}
            </div>
            <div className="row">
              <h5>{M_IV_MAIL_SUBJECT !== "" ? "Betreff: " + M_IV_MAIL_SUBJECT : ""}</h5>
            </div>
            <div className="row">
              <div className="col-10">
                <h4>Kopfdaten</h4>
              </div>
              <div className="col">
                <Button autoFocus onClick={(e) => { save_data("save") }} variant="contained" size="medium" tabIndex="-1">Save <SaveIcon /></Button>
              </div>
            </div>


            <div className="col" id="first-col">
              <div className="d-flex flex-row justify-content-between mb-5 ">
                <div className="">

                  <label className="label-above" htmlFor="M_IV_MANDANT">Mandant:</label><br />
                  <Autocomplete
                    disablePortal
                    freeSolo
                    id="M_IV_MANDANT"
                    autoSelect
                    value={M_IV_MANDANT}
                    options={clients}
                    onInputChange={(event, newInputValue) => {
                      setClientData(newInputValue);
                    }}
                    renderInput={(params) => <TextField {...params} />}
                  /><br />
                  <label className="label-above" htmlFor="M_IV_INVOICENUMBER">Rechnungsnummer:</label><br />
                  <input id="M_IV_INVOICENUMBER" onChange={enter_inv_nr} type="text" value={M_IV_INVOICENUMBER} /><br />
                  <label className="label-above" htmlFor="M_IV_KINDOFINVOICE">Dok-Typ:</label><br />
                  <select id="M_IV_KINDOFINVOICE" defaultValue={""} onChange={(e) => { setM_IV_KINDOFINVOICE(e.target.value) }} type="text" value={M_IV_KINDOFINVOICE} style={{ width: "100%" }}>
                    <option value=""></option>
                    <option value="Rechnung">Rechnung</option>
                    <option value="Gutschrift">Gutschrift</option>
                  </select><br />
                  <label className="label-above" htmlFor="M_IV_INVOICETYPE">Rechnungsart-Typ:</label><br />
                  <select id="M_IV_INVOICETYPE" defaultValue={""} onChange={(e) => { setM_IV_INVOICETYPE(e.target.value) }} type="text" value={M_IV_INVOICETYPE} style={{ width: "100%" }}>
                    <option value=""></option>
                    <option>Standard</option>
                    <option>Gutachten</option>
                    <option>Reparatur</option>
                    <option>Transport</option>
                    <option>PDI</option>
                  </select><br />
                </div>
                <div className="" id="second-col">
                  <label className="label-above" htmlFor="M_IV_KREDITOR">Kreditor:</label><br />
                  <input id="M_IV_KREDITOR" onClick={openModal} onKeyDown={(e) => { setM_IV_KREDITORenter(e) }} type="text" value={M_IV_KREDITOR} /><br />
                  <label className="label-above" htmlFor="S_KR_NAME1">Lieferant:</label><br />
                  {S_KR_NAME || "---"}<br />
                  <label className="label-above" htmlFor="S_KR_NAME1">IBAN (Lieferant):</label><br />
                  {S_KR_IBAN || "---"}<br />
                  <label className="label-above" htmlFor="M_IV_IBAN">IBAN (Rechnung):</label><br />
                  {M_IV_IBAN || "---"}
                </div>
                <div className="" id="third-col">
                  <label className="label-above" htmlFor="M_IV_INVOICEDATE">Rechnungsdatum:</label><br />
                  <input id="M_IV_INVOICEDATE" onChange={(e) => { setAllDates(e.target.value) }} type="date" lang="de-DE" value={M_IV_INVOICEDATE} /><br />
                  <label className="label-above" htmlFor="M_IV_DELIVERYDATE">Leistungszeitraum von:</label><br />
                  <input id="M_IV_DELIVERYDATE" onChange={(e) => { setM_IV_DELIVERYDATE(e.target.value) }} type="date" lang="de-DE" value={M_IV_DELIVERYDATE} /><br />
                  <label className="label-above" htmlFor="M_IV_DELIVERYDATE">Leistungszeitraum bis:</label><br />
                  <input id="M_IV_DELIVERYDATE_BIS" onChange={(e) => { setM_IV_DELIVERYDATE_BIS(e.target.value) }} type="date" lang="de-DE" value={M_IV_DELIVERYDATE_BIS} /><br />
                  <label className="label-above" htmlFor="M_IV_ORDERID">{M_IV_INVOICETYPE === "Reparatur" ? "Auftragsnummer:" : "Bestellnummer:"} </label><br />
                  <input id="M_IV_ORDERID" type="number" max="9400000000" onChange={(e) => { setM_IV_ORDERID(e.target.value) }} value={M_IV_ORDERID} /><br />
                </div>
              </div>
              <hr />
              <h4>Beträge</h4>
              <div className="d-flex flex-row-reverse">
                <div>
                  <div className="row mb-1" id="currency">
                    <div className="col">
                      <span>Währung:</span>
                    </div>
                    <div className="col">

                    </div>
                    <div className="col">

                    </div>
                    <div className="col">
                      <select id="M_IV_CURRENCY" defaultValue={""} onChange={(e) => { setM_IV_CURRENCY(e.target.value) }} type="text" value={M_IV_CURRENCY} style={{ width: "100%" }}>
                        <option value=""></option>
                        <option>EUR</option>
                        <option>USD</option>
                        <option>GBP</option>
                        <option>CHF</option>
                        <option>DKK</option>
                        <option>HRK</option>
                        <option>HUF</option>
                        <option>CZK</option>
                        <option>CAD</option>
                        <option>PLN</option>
                      </select>
                    </div>
                  </div>
                  <div className="row mb-1" id="netto">
                    <div className="col">
                      <span>{displayTaxes ? "Netto:" : "Betrag:"}</span>
                    </div>
                    <div className="col">

                    </div>
                    <div className="col">

                    </div>
                    <div className="col">
                      <input size="10" id="M_IV_INVOICEAMOUNT" onChange={(e) => { setM_IV_INVOICEAMOUNT(e.target.value); setM_IV_NETBASE1(e.target.value); }} type="text" value={M_IV_INVOICEAMOUNT} />
                    </div>
                  </div>
                  {displayTaxes && (<div>
                    <div className="row mb-1" id="vat-1">
                      <div className="col">
                        <span>VAT1:</span>
                      </div>
                      <div className="col">
                        <input size="7" id="M_IV_TAXRATE1" onChange={(e) => { setM_IV_TAXRATE1(e.target.value); }} type="text" value={M_IV_TAXRATE1} placeholder="Steuersatz 1" />
                      </div>
                      <div className="col">
                        <input size="10" id="M_IV_NETBASE1" onChange={(e) => { setM_IV_NETBASE1(e.target.value); }} type="text" value={M_IV_NETBASE1} placeholder="Steuerbasis 1" />
                      </div>
                      <div className="col">
                        <input size="10" id="M_IV_TAXAMOUNT1" onChange={(e) => { setM_IV_TAXAMOUNT1(e.target.value) }} type="text" value={M_IV_TAXAMOUNT1} placeholder="Steuerbasis 1" />
                      </div>
                    </div>
                    <div className="row mb-1" id="vat-2">
                      <div className="col">
                        <span>VAT2:</span>
                      </div>
                      <div className="col">
                        <input size="7" id="M_IV_TAXRATE2" onChange={(e) => { setM_IV_TAXRATE2(e.target.value); }} type="text" value={M_IV_TAXRATE2} placeholder="Steuersatz 2" />
                      </div>
                      <div className="col">
                        <input size="10" id="M_IV_NETBASE2" onChange={(e) => { setNetBase2(e.target.value); }} type="text" value={M_IV_NETBASE2} placeholder="Steuerbasis 2" />
                      </div>
                      <div className="col">
                        <input size="10" id="M_IV_TAXAMOUNT2" onChange={(e) => { setM_IV_TAXAMOUNT2(e.target.value) }} type="text" value={M_IV_TAXAMOUNT2} placeholder="Steuerbasis 1" />
                      </div>
                    </div>
                    <div className="row mb-1" id="gesamtsteuer">
                      <div className="col">
                        <span>Steuerbetrag:</span>
                      </div>
                      <div className="col">
                      </div>
                      <div className="col">
                      </div>
                      <div className="col">
                        <input size="10" id="M_IV_TOTALTAXAMOUNT" onChange={(e) => { setM_IV_TOTALTAXAMOUNT(e.target.value) }} type="text" value={M_IV_TOTALTAXAMOUNT} />
                      </div>
                    </div>
                    <div className="row mb-1" id="brutto">
                      <div className="col">
                        <span>Brutto:</span>
                      </div>
                      <div className="col">
                      </div>
                      <div className="col">
                      </div>
                      <div className="col">
                        <input size="10" id="M_IV_TOTALAMOUNT" onChange={(e) => { setM_IV_TOTALAMOUNT(e.target.value) }} type="text" value={M_IV_TOTALAMOUNT} />
                      </div>
                    </div>
                  </div>)}
                </div>
              </div>
              <div className="row mt-4">
                <div className="d-flex flex-row justify-content-between">
                  <input id="M_IV_KOMMENTAR" style={{ width: "50%" }} placeholder="Kommentar..." onChange={(e) => { setM_IV_KOMMENTAR(e.target.value) }} type="text" value={M_IV_KOMMENTAR} />
                </div>
              </div>
              <div className="row mt-4 mb-2">
                <div className="d-flex flex-row justify-content-between">
                  <button onClick={(e) => { save_data("Validated") }} className="btn-success p-2">Validierung abschließen</button>
                  <button onClick={(e) => { save_data("Deleted") }} className="btn-danger p-2">Rechnung löschen</button>
                  <button onClick={(e) => { save_data("Resubmission") }} className="btn-sixt p-2" >Wiedervorlage</button>
                </div>
              </div>
            </div>
          </div>
          <div className="col pdf-container">
            {pdf_loader}
          </div>
        </div>

      </main>
    );
  }
}