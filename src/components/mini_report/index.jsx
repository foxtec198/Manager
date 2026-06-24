import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { toReal } from "../../utils/format";
import { useNavigate } from "react-router-dom";
import "./main.css"

const periods = [
  { label: "Hoje", value: "day" },
  { label: "Últimos 7 dias", value: "week" },
  { label: "Mês", value: "month" },
];

function calcParticipacao(valor, total) {
  if (total === 0) return 0;
  return ((valor / total) * 100).toFixed(2);
}

export default function MiniReport({ data, setRefresh, period, setPeriod}) {
  const totalGeral = data.total;
  const hasVendas = data.total > 0 ? true : false
  const participacaoProdutos = calcParticipacao(data.products, totalGeral);
  const participacaoOrdens = calcParticipacao(data.orders, totalGeral);
  const navigate = useNavigate();

  return (
    <div className="flex flex-column gap-3 w-full h-full"  style={{zoom:"80%"}}>

      {/* Dropdown de período */}
      <Dropdown
        value={period}
        options={periods}
        onChange={(e) => {setPeriod(e.value); setRefresh(prev => !prev)}}
        placeholder="Selecione um período"
        className="w-full"
      />

      {/* Cards */}
      <div className="flex gap-3">
        <div className="report-card flex-1">
          <span className="report-card-label">Venda de Produtos</span>
          <span className="report-card-value">{toReal(data.products)}</span>
          <span className={`report-card-percent ${participacaoProdutos < 40 ? "negative" : "positive"}`}>
            <i className={`pi ${participacaoProdutos >= 40 ? "pi-arrow-up" : "pi-arrow-down"}`} />
            {participacaoProdutos}% ( {data.product_count} )
          </span>
        </div>

        <div className="report-card flex-1">
          <span className="report-card-label">Venda de Ordens</span>
          <span className="report-card-value">{toReal(data.orders)}</span>
          <span className={`report-card-percent ${participacaoOrdens < 40 ? "negative" : "positive"}`}>
            <i className={`pi ${participacaoOrdens >= 40 ? "pi-arrow-up" : "pi-arrow-down"}`} />
            {participacaoOrdens}% ( {data.orders_count} )
          </span>
        </div>
      </div>

      {/* Barras ou empty state */}
      {hasVendas ? (
        <div className="report-bars">
          {Object.keys(data.payments).map((p) => (
            <div key={Object.keys(p)} className="report-bar-item">
              <div className="report-bar-track">
                <div
                  className="report-bar-fill"
                  style={{ height: `${(Object.values(p) / totalGeral) * 100}%` }}
                  />
              </div>
              <span className="report-bar-label">{Object.keys(p)}</span>
              <span className="report-bar-value">{toReal(Object.values(p))}</span>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-column align-items-center gap-3 py-3">
          <span className="text-color-secondary">Nenhuma venda ainda!</span>
          <Button
            label="Bora vender?"
            icon="pi pi-send"
            rounded
            severity="success"
            onClick={() => {navigate("/sales"); setActive("Vendas")}}
          />
        </div>
      )}
    </div>
  );
}