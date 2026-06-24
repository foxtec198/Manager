// Utils and Widgets
import { Button } from "primereact/button";
import { Menu } from "primereact/menu";
import { useLocation, useNavigate } from "react-router-dom";
import { useRef } from "react";

// Services
import AuthService from "../../services/auth"

// CSS's
import './main.css'

// Logic and vars
export default function TopBar() {
  const menuRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  const auth = AuthService

  const items = [
    { label: "Caixa", icon: "pi pi-wallet", target: "/pos" },
    { label: "Vendas", icon: "pi pi-tag", target: "/sales" },
    { label: "Ordens", icon: "pi pi-file", target: "/orders" },
    { label: "Clientes", icon: "pi pi-users", target: "/clients" },
    { label: "Estoque", icon: "pi pi-box", target: "/products" },
    { label: "Peças", icon: "pi pi-wrench", target: "/parts" },
    { label: "Relatórios", icon: "pi pi-chart-bar", target: "/reports" }
  ];

  const mobileItems = items.map((item) => ({
    label: item.label,
    icon: item.icon,
    command: () => { navigate(item.target) }
  }));

  return (
    <header>
      <img
        src="https://api.hubbix.com.br/img/logo.png"
        alt="logo"
        width={120}
        style={{ "cursor": "pointer" }}
        onClick={() => navigate("/init")}
      />

      {/* Desktop */}
      <div className="topbar-desktop flex">
        <div className="topbar-desktop-itens flex gap-2">
          {items.map((item) => (
            <Button
              key={item.label}
              label={item.label}
              className={location.pathname === item.target ? "active" : ""}
              onClick={() => navigate(item.target)}
              outlined
            />
          ))}
          <Button label="Configurações" icon="pi pi-cog" severity="secondary" onClick={() => navigate("/config")} />
        </div>
        <Button label="Sair" icon="pi pi-sign-out" severity="danger" onClick={() => { auth.logout; navigate("/login") }} />
      </div>

      {/* Mobile and small sizes */}
      <div className="topbar-mobile">
        <Menu ref={menuRef} model={mobileItems} popup />
        <Button icon="pi pi-bars" onClick={(e) => menuRef.current.toggle(e)} />
        <Button icon="pi pi-cog" onClick={() => navigate("/config")} />
        <Button icon="pi pi-sign-out" severity="danger" onClick={() => { auth.logout; navigate("/login") }} />
      </div>
    </header>
  );
}