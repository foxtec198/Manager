// Utils
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Pages and Layouts
import MainLayout from "./layouts/MainLayout";
import Auth from "./pages/auth";
import Init from "./pages/init";
import Pos from "./pages/pos"
import Sales from "./pages/sales"
import Orders from "./pages/orders"
import Clients from "./pages/clients"
import Products from "./pages/products"
import Parts from "./pages/parts"
import Reports from "./pages/reports"
import Config from "./pages/configs"

// Providers
import { PrimeReactProvider } from 'primereact/api';
import { LoadingProvider, useLoading } from "./providers/LoadingProvider";
import { ToastProvider } from './providers/ToastProvider';

// CSS AND THEMES
import 'primeicons/primeicons.css';
import 'primereact/resources/themes/arya-green/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeflex/primeflex.css';
import "./providers/LoadingProvider/loading.css"
import "./index.css"

// Normal Vars
const token = function () { return !!sessionStorage.getItem("token") };

// Componente separado pra poder usar o hook de ntro do BrowserRouter
function AppRoutes() {
  const { loading } = useLoading();

  return (
    <>
      <Routes>
        <Route path="" element={<Auth />} />
        <Route path="/" element={<Auth />} />
        <Route path="/login" element={<Auth />} />

        <Route element={<MainLayout />}>
          <Route path="/init" element={<Init />} />
          <Route path="/pos" element={<Pos />} />
          <Route path="/sales" element={<Sales />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/clients" element={<Clients />} />
          <Route path="/products" element={<Products />} />
          <Route path="/parts" element={<Parts />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/config" element={<Config />} />
        </Route>

        <Route path="*" element={<Navigate to={token() ? "/init" : "/"} />} />
      </Routes>
    </>
  );
}

// Indexar providers
createRoot(document.getElementById("root")).render(
  <PrimeReactProvider>
    <LoadingProvider>
      <ToastProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </ToastProvider>
    </LoadingProvider>
  </PrimeReactProvider>
);