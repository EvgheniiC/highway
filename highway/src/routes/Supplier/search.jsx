import axios from "axios";

// TO DO
export const searchForSupplier = () => {
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

  export default search;