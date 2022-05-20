import * as axios from "axios";

const instance = axios.create({
    withCredentials: true,
    baseURL: 'http://localhost:3000',
});

export const dataAPI = {
     getFreeInvoiceValue(barcode) {
        return instance.post("/get_free_invoice_val", {
            "M_IV_BARCODE": barcode
          });
     },
     saveData(M_IV_MANDANT_BACKEND, M_IV_INVOICENUMBER, M_IV_KINDOFINVOICE, M_IV_INVOICETYPE, M_IV_KREDITOR, M_IV_INVOICEDATE, M_IV_DELIVERYDATE, M_IV_DELIVERYDATE_BIS, M_IV_ORDERID, M_IV_INVOICEAMOUNT, M_IV_TOTALAMOUNT, M_IV_TAXRATE1, M_IV_NETBASE1, M_IV_TAXRATE2, M_IV_NETBASE2, M_IV_TAXAMOUNT1, M_IV_TAXAMOUNT2, M_IV_TOTALTAXAMOUNT, M_IV_KOMMENTAR, M_IV_CURRENCY, M_IV_ID) {
        return instance.post("/save_data", {
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
          })
     },
     finischValidation(action,M_IV_ID) {
        return instance.post("/finish_validation", {
            "NEW_STATUS": action,
            "M_IV_ID": M_IV_ID
          });
     }

     
}

export const searchData = {
    searchSupplier(kreSearchName,kreSearchZip,M_IV_MANDANT_BACKEND) {
        return instance.post("/supplier_search", {
            "param": kreSearchName,
            "zip": kreSearchZip,
            "mandant": M_IV_MANDANT_BACKEND
          });
     }

}



// or with .then(response => response.data) ??
// export const dateAPI = {
//     getBarcode(barcode) {
//        return instance.post("/get_free_invoice_val", {
//            "M_IV_BARCODE": barcode
//          }).then(response => response.data);
//     },

    
// }