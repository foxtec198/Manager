// UTILS
import { useState, useRef, useEffect } from 'react';
import { TabView, TabPanel } from "primereact/tabview";

// WIDGETS
import { Fieldset } from 'primereact/fieldset';
import { Tag } from "primereact/tag"
import { Button } from "primereact/button"
import { InputText } from "primereact/inputtext"
import { FloatLabel } from 'primereact/floatlabel';
import { InputNumber } from 'primereact/inputnumber';
import { Dropdown } from 'primereact/dropdown';
import { Toast } from 'primereact/toast';
import { confirmPopup, ConfirmPopup } from 'primereact/confirmpopup';
import { Avatar } from 'primereact/avatar';

// COMPONENTS
import Table from "../../components/tables/table";

// LOCALS
import { useLoading } from "../../providers/LoadingProvider"
import { toReal } from '../../utils/format';
import { useToast } from "../../providers/ToastProvider"
import { MiniReportService } from '../../services/dashboards';
import { default_data_for_mini_report } from '../../utils/default_data';

import PosService from "../../services/pos"
import ExpensesServices from '../../services/expenses';
import MiniReport from '../../components/mini_report'

// CSS
import './main.css'

// Services do CAIXA, processamento e requests
const pos = PosService;

// Services das Despesasa
const exp = ExpensesServices;

const mini_report = new MiniReportService()

// Função principal do Caixa (FrontEnd)
export default function Pos() {
    // States - Estados de veriaveis para a aplicação
    const [posOpen, setPosOpen] = useState(false);
    const [resRport, setResReport] = useState(default_data_for_mini_report);
    const [posMat, setPosMat] = useState("");
    const [expensesMat, setExpensesMat] = useState("");
    const [expensesValue, setExpensesValue] = useState(null);
    const [expensesReason, setExpensesReason] = useState("sangria");
    const [expensesOtherReason, setExpensesOtherReason] = useState("");
    const [appendMat, setAppendMat] = useState("");
    const [appendValue, setAppendMValue] = useState(null);
    const [period, setPeriod] = useState("week");
    const [coinChange, setCoinChange] = useState(null);
    const [refresh, setRefresh] = useState(false);
    const [despesas, setDespesas] = useState([]);
    const [expenseDate, setExpenseDate] = useState(null)
    let expenseId;

    // Normal vars
    const toast = useRef(null);
    const { showToast } = useToast();
    const { setLoading } = useLoading();
    const reasons = [
        { name: "Sangria", value: "sangria" },
        { name: "Despesa", value: "despesa" }
    ];

    // Callbacks vars
    const deleteExpenseAccept = () => { deleteExpense(expenseId) };

    // Effect para efeito onLoad porem com refresh 
    useEffect(() => {
        async function _() {
            try {
                // =========== POS
                const res = await pos.get(); // Obtem o status do caixa
                if (res.data.status) { // Se o caixa esta aberto
                    setPosOpen(toReal(res.data.valor)); // Define o caixa como aberto e converte o valor da API pra real
                } else { // Se esta fechado
                    const lastClose = await pos.last_close() // Obtem o ultimo valor a ser fechado
                    setPosOpen(false); // Seta o caixa como fechado
                    setCoinChange(parseFloat(lastClose.data)); // E o seta ao campo de troco
                }

                // =========== EXPENSES
                const expenses = await exp.get(expenseDate)
                setDespesas(expenses.data)

                // =========== MINI REPORT
                const report_data = await mini_report.get(period)
                setResReport(report_data.data)
            }
            // Caso dê erro mostra o erro e seta o caixa como fechado
            catch (error) {
                console.error(error)
            };
        } _();
    }, [refresh]);

    // Função responsavel pelo callback de abrir ou fechar o caixa
    async function setPos(e) {
        e.preventDefault() // Evita reload
        setLoading(true) // Inicia o carregamento
        try {
            posOpen // Confere o state do caixa e executa a ação devida
                ? await pos.close(posMat)  // Fechar caixa
                : await pos.open(posMat, coinChange); // Abrir caixa
            setRefresh(prev => !prev); // Refresh manual no Effect
        }
        catch (error) { showToast('error', "Erro", error.response.data) } // Em caso de erro
        finally { setLoading(false), setPosMat("") }; // Desativa o loading
    };

    async function appendPos(e) {
        e.preventDefault()
        setLoading(true)
        try {
            await pos.append(appendMat, appendValue)
            setRefresh(prev => !prev)
            showToast("success", "Sucesso", "Reforço aplicado com sucesso!")
        }
        catch (error) { showToast("error", "Erro ao fazer Reforço", error, response.data) }
        finally { setLoading(false) };

    };

    async function createExpense(e) {
        e.preventDefault()
        setLoading(true)
        try {
            const reason = expensesReason == "despesa"
                ? expensesOtherReason
                : expensesReason

            await exp.create(expensesMat, expensesValue, reason)
            setRefresh(prev => !prev)
            showToast('success', "Sucesso", "Dispesa criada com sucesso1")
        }
        catch (error) { console.warn(error); error.response ? showToast("error", "Erro ao criar Despesa", error.response.data) : "" }
        finally { setLoading(false) };
    };

    async function deleteExpense(id) {
        try {
            await exp.delete(id)
            setRefresh(prev => !prev)
            showToast('success', "Sucesso", "Dispesa removida com sucesso1")
        }
        catch (error) { console.warn(error); error.response ? showToast("error", "Erro ao deletar Despesa", error.response.data) : "" }
        finally { setLoading(false) };
    }

    const confirmDeleteExpense = (e) => {
        confirmPopup({
            target: e.currentTarget,
            message: 'Remover permanentemente esta despesa?',
            acceptLabel: "Sim",
            rejectLabel: "Não",
            icon: 'pi pi-exclamation-triangle',
            defaultFocus: 'accept',
            accept: deleteExpenseAccept
        });
    };

    const avatarDirective = (row) => {
        return <div className='flex align-items-center gap-2'>
            {row.photo == "person_blank.png" ?
                <Avatar
                    label={row.funcionario[0]}
                    shape='circle'
                    style={{
                        backgroundColor: 'var(--secondary)',
                        color: 'var(--foreground)',
                        fontWeight: "bold"
                    }}
                />
                : <Avatar
                    image={`https://dev.api.hubbix.com.br/api/files/img/manager/${encodeURI(row.photo)}`}
                    size='small'
                    shape='circle'
                    className='flex align-items-center justify-content-center ms-auto'
                />

            }
            {row.funcionario}
        </div>
    }

    const columns = [
        {
            field: "data", header: "Data", body: (row) => new Date(row.data).toLocaleDateString("pt-br", {
                day: "2-digit",
                month: "long",
                hour: "2-digit",
                minute: "2-digit",
            })
        },
        {
            field: "motivo", header: "Motivo", body: (row) => {
                return <Tag
                    className='fw-bold'
                    value={row.motivo.toUpperCase()}
                    severity="success"
                />
            }
        },
        { field: "funcionario", header: "Funcionário", body: (row) => avatarDirective(row) },
        { field: "valor", header: "Valor", body: (row) => toReal(row.valor) },
        {
            header: "Ações",
            body: (row) => (
                <Button
                    icon="pi pi-trash"
                    severity="danger"
                    onClick={(e) => { expenseId = row.id; confirmDeleteExpense(e) }}
                />
            ),
            style: { width: "80px" }
        },
    ];

    return (
        <>
            <Toast ref={toast} />
            <ConfirmPopup />

            {/* SEÇÃO PRINCIPAL */}
            <section className="flex flex-column p-2">
                {/* FIRST FRAME (OPEN/CLOSE & SET EXPENSE/SET OUT & MINI REPORT) */}
                <div className='first-frame'>
                    {/* ABERTURA E FECHAMENTO DE CAIXA!*/}
                    <Fieldset className='frame-pos align-items-center justify-content-center' legend={
                        <span className="flex align-items-center gap-2">
                            <i className={`pi ${posOpen ? "pi-lock" : "pi-lock-open"}`} />
                            <span>{posOpen ? "Fechar Caixa" : "Abrir Caixa"}</span>
                        </span>
                    }>
                        <Tag
                            className='badge-pos'
                            icon={`pi ${posOpen ? "pi-lock-open" : "pi-lock"}`}
                            severity={posOpen ? "success" : "danger"}
                            value={posOpen ? `Caixa Aberto - ${posOpen}` : "Caixa Fechado"}
                            rounded
                        />

                        <form onSubmit={(e) => setPos(e)} className="flex flex-column mt-5 gap-5 h-full">
                            <FloatLabel className='w-full '>
                                <InputText
                                    value={posMat}
                                    className='w-full'
                                    onChange={(e) => { setPosMat(e.target.value) }}
                                    keyfilter="int"
                                    required
                                />
                                <label htmlFor="matricula">Matricula</label>
                            </FloatLabel>

                            <FloatLabel className={`w-full ${posOpen ? "hidden" : ""}`}>
                                <InputNumber
                                    className='w-full'
                                    value={coinChange}
                                    onValueChange={(e) => setCoinChange(e.value)}
                                    mode="currency"
                                    currency="BRL"
                                    locale="pt-BR"
                                />
                                <label htmlFor="">Valor do Troco</label>
                            </FloatLabel>

                            <Button
                                className='w-full'
                                type='submit'
                                label={posOpen ? "Fechar Caixa" : "Abrir Caixa"}
                                severity={posOpen ? "danger" : "success"}
                            />
                        </form>
                    </Fieldset>

                    {/* ENTRADAS E SAIDAS DO CAIXA! */}
                    <Fieldset className='align-items-center justify-content-top' legend={
                        <span className="flex align-items-center gap-2">
                            <i className="pi pi-sort-alt" />
                            <span>Movimentação de Caixa</span>
                        </span>
                    }>
                        <TabView>
                            <TabPanel header="Entradas" leftIcon="pi pi-arrow-up mr-2">
                                <form
                                    onSubmit={(e) => appendPos(e)}
                                    className="flex flex-column gap-4 py-5 h-full">
                                    <FloatLabel className='w-full'>
                                        <InputText
                                            value={appendMat}
                                            onChange={(e) => setAppendMat(e.target.value)}
                                            keyfilter="int"
                                            className="w-full"
                                        />
                                        <label htmlFor="">Matricula</label>
                                    </FloatLabel>

                                    <FloatLabel className='w-full'>
                                        <InputNumber
                                            value={appendValue}
                                            onValueChange={(e) => setAppendMValue(e.value)}
                                            className="w-full"
                                            mode='currency'
                                            locale='pt-BR'
                                            currency='BRL'
                                            required
                                        />
                                        <label htmlFor="">Valor</label>
                                    </FloatLabel>
                                    <Button label="Adicionar Sangria." severity="danger" className="w-full" />
                                </form>
                            </TabPanel>

                            <TabPanel header="Saídas" leftIcon="pi pi-arrow-down mr-2">
                                <form
                                    onSubmit={(e) => createExpense(e)}
                                    className="flex flex-column gap-4 py-5 h-full"
                                >
                                    <div className="flex justify-content-center align-items-center gap-4 w-full">
                                        <FloatLabel className="w-full">
                                            <InputText
                                                value={expensesMat}
                                                className="w-full"
                                                onChange={(e) => { setExpensesMat(e.target.value) }}
                                                keyfilter="int"
                                                required
                                            />
                                            <label>Matricula</label>
                                        </FloatLabel>

                                        <FloatLabel className="w-full">
                                            <InputNumber
                                                className="w-full"
                                                inputClassName="w-full"
                                                value={expensesValue}
                                                onValueChange={(e) => setExpensesValue(e.target.value)}
                                                mode="currency"
                                                currency="BRL"
                                                locale="pt-BR"
                                                required
                                            />
                                            <label>Valor</label>
                                        </FloatLabel>
                                    </div>
                                    <div className="flex justify-content-center align-items-center gap-4 w-full">
                                        <Dropdown
                                            className="w-full"
                                            value={expensesReason}
                                            options={reasons}
                                            optionLabel="name"
                                            placeholder="Selecione o motivo"
                                            checkmark={true}
                                            highlightOnSelect={false}
                                            onChange={(e) => { setExpensesReason(e.target.value) }}
                                        />

                                        <FloatLabel className={`w-full ${expensesReason != "despesa" ? "hidden" : ""}`}>
                                            <InputText
                                                className="w-full"
                                                inputClassName="w-full"
                                                value={expensesOtherReason}
                                                onInput={(e) => setExpensesOtherReason(e.target.value)}
                                            />
                                            <label htmlFor="">Descreva o motivo</label>
                                        </FloatLabel>
                                    </div>
                                    <Button label="Adicionar Reforço." severity="success" className="w-full" />
                                </form>
                            </TabPanel>
                        </TabView>
                    </Fieldset>

                    {/* MINI REPORT PARA ACOMPANHAMENTO */}
                    <Fieldset legend={
                        <span className="flex align-items-center gap-2">
                            <i className="pi pi-chart-bar" />
                            <span>Análise Financeira</span>
                        </span>
                    }>
                        <MiniReport
                            data={resRport}
                            setRefresh={setRefresh}
                            period={period}
                            setPeriod={setPeriod}
                        />
                    </Fieldset>
                </div>

                {/* DATATABLE EXPENSES */}
                <Fieldset className='mt-3' legend={
                    <span className="flex align-items-center gap-2">
                        <i className="pi pi-eject" />
                        <span>Despesas</span>
                    </span>
                }>
                    <Table
                        data={despesas}
                        columns={columns}
                        mode="paginate"
                        dateValue={expenseDate}
                        handleSetDate={setExpenseDate}
                        setRefresh={setRefresh}
                    />
                </Fieldset>
            </section>
        </>
    )
}