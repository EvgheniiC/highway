import { render } from "react-dom";
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import App from "./App";
import NoTodo from "./routes/NoTodo";
import InvoiceValidation from "./routes/InvoiceValidation";
import InvoiceValidationWrapper from "./routes/InvoiceValidationWrapper";
import OwiAuskunft from "./routes/OwiAuskunft";

const rootElement = document.getElementById("root");
render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/all_work_done" element={<NoTodo />} />
      <Route path="/owi_auskunft" element={<OwiAuskunft />} />
      <Route path="/invoice_validation_wrapper" element={<InvoiceValidationWrapper />} />
      <Route path="/invoice_validation/:barcode" element={<InvoiceValidation />} />
    </Routes>
  </BrowserRouter>,
  rootElement
);