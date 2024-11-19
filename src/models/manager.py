from datetime import datetime as dt, timedelta, timezone
try: from static.models.db import now
except: from db import now
from psycopg2 import connect
try: from static.models.myde import environ, load
except: from myde import environ, load

load()

def now():
    tz_brl = timezone(timedelta(hours=-3))
    return dt.now().astimezone(tz_brl)

class Manager:
    def __init__(self, conn):
        self.conn = conn
        self.c = conn.cursor()

    def rollback(self):
        self.conn.rollback()

    def get_login(self, mat, pwd):
        self.c.execute(f'select matricula, senha, grupodecliente, cr from funcionarios where matricula = {mat}')
        res = self.c.fetchone()
        if res:
            if res[0] == int(mat): 
                if str(res[1]) == str(pwd):
                    return [res[0], res[2], res[3]]
                return 'Senha Incorreta'
            return 'Matricula Incorreta'
        else: return 'Matricula não econtrada'
    
    def get_vendas_por_tipo(self, cr):
        mes = now().strftime('%m-%Y')
        self.c.execute(f"select distinct pagamento, sum(valor) as total from vendas where cr = '{cr}' and to_char(data, 'MM-YYYY') = '{mes}' group by pagamento")
        res = self.c.fetchall()
        tipos = {
            'CREDITO':0,
            'DEBITO':0,
            'DINHEIRO':0,
            'PIX':0
        }

        for item in res:
            tipos[item[0]] = item[1]
        
        return tipos

    def get_vendas_dia(self, cr):
        dia = now().strftime('%d-%m-%Y')
        self.c.execute(f"select distinct sum(valor) as total from vendas where cr = '{cr}' and to_char(data, 'DD-MM-YYYY') = '{dia}' ")
        resdia = self.c.fetchone()
        if resdia[0]: return resdia[0]
        else: return 0

    def get_os_por_tipo(self, cr):
        mes = now().strftime('%m-%Y')
        os = {
            'ABERTA':0,
            'CANCELADA':0,
            'SEM CONSERTO':0,
            'FINALIZADA':0,
            'ENTREGUE':0,
            }
        self.c.execute(f"""select situacao, count(situacao) 
                       from os 
                       where cr = '{cr}' 
                       and to_char(abertura , 'MM-YYYY') = '{mes}' 
                       or cr = '{cr}' 
                       and to_char(os.entrega, 'MM-YYYY') = '{mes}' 
                       group by situacao"""
                       )
        res = self.c.fetchall()
        for item in res:
            os[item[0]] = item[1]
        return os

    def get_saidas(self, cr):
        mes = now().strftime('%m-%Y')
        cons = f"""select s.nome, s.valor, c.nome, v.pagamento, f.nome, to_char(v.data, 'DD/MM/YYYY HH24:MI'), s.id, s.id_venda
            from vendas v 
            inner join saidas s 
            on s.id_venda = v.id 
            inner join funcionarios f
            on f.matricula = v.matricula
            inner join clientes c 
            on c.id = v.id_cliente
            where to_char(v.data, 'MM-YYYY') = '{mes}' 
            and v.cr = '{cr}'
            order by v.data desc
            """
        self.c.execute(cons)
        return self.c.fetchall()

    def get_os_dia(self, cr):
        self.c.execute(f"""select o.id, c.nome, o.modelo, o.tipo, o.valor, o.situacao, o.atendente, to_char(o.abertura, 'DD/MM/YYYY HH24:MI'), to_char(o.entrega , 'DD/MM/YYYY')
            from os o 
            inner join clientes c 
                on c.id = o.id_cliente
            where o.cr = '{cr}'
            and o.situacao = 'ABERTA' 
            """)
        return self.c.fetchall()

    def get_os(self, cr):
        self.c.execute(f"""select o.id, c.nome, o.modelo, o.tipo, o.valor, o.situacao, o.atendente, to_char(o.abertura, 'DD/MM/YYYY HH24:MI'), to_char(o.entrega , 'DD/MM/YYYY')
            from os o 
            inner join clientes c 
                on c.id = o.id_cliente
            where o.cr = '{cr}'
            and o.situacao <> 'ABERTA' 
            """)
        return self.c.fetchall()

    def get_clientes(self, cr):
        self.c.execute(f"select id, cpf, nome, telefone, modelo, marca, cor, endereco, obs, to_char(data, 'DD/MM/YYYY HH24:MI') from clientes where cr = '{cr}'")
        return self.c.fetchall()

    def get_produtos(self, cr):
        self.c.execute(f"select id, nome, custo, valor, estoque_minimo, quantidade from produtos where cr = '{cr}'")
        return self.c.fetchall()

    def get_pecas(self, cr):
        self.c.execute(f"select id, nome, custo, valor, quantidade from pecas where cr = '{cr}'")
        return self.c.fetchall()

    def vender(self, gc, cr, mat, valor, mt, cpf, desconto, tipo):
        if cpf:
            self.c.execute(f"select id from clientes where cpf = '{cpf}' and cr = '{cr}'")
            id = self.c.fetchone()
        else: id = 0
        self.c.execute(F"""INSERT INTO VENDAS
            (VALOR, DESCONTO, PAGAMENTO, ID_CLIENTE, DATA, TIPO, MATRICULA, GRUPODECLIENTE, CR)
            VALUES('{valor}','{desconto}','{mt.upper()}','{id}','{now()}','{tipo}','{mat}','{gc}','{cr}') 
            RETURNING id """)
        self.conn.commit()
        return self.c.fetchone()

    def mat_verify(self, mat, cr):
        self.c.execute(f"select matricula from funcionarios where matricula = {int(mat)} and cr = '{cr}'")
        if self.c.fetchone(): return True
        else: return False

    def set_saida(self, id_venda, nome, gc, cr):
        cons = f"select valor, custo from produtos where nome = '{nome}' and cr ='{cr}'"
        self.c.execute(cons) 
        item = self.c.fetchone()
        valor = item[0]
        custo = item[1]
        self.c.execute(f"""
        insert into saidas (id, id_venda, nome, valor, custo, data, grupodecliente, cr)
        values (DEFAULT, {id_venda}, '{nome}', {valor}, {custo}, '{now()}', '{gc}', '{cr}')""")
        self.conn.commit()

    def get_saidas_caixa(self, cr):
        cons =  f"select motivo, valor, to_char(data, 'DD/MM/YYYY HH24:MI'), id from caixa_sd where cr = '{cr}' and data >= '{now() - timedelta(90)}' order by data desc"
        self.c.execute(cons)
        return self.c.fetchall()

    def get_value_caixa(self, cr):
        self.c.execute(f"select troco from caixa_fc where cr = '{cr}' order by id desc limit 1")
        return self.c.fetchone()

    def abrir_caixa(self, valor, cr, mat):
        self.c.execute(f"insert into caixa_ab(valor, matricula, data, cr) values ({valor}, {mat}, '{now()}', '{cr}')")
        self.conn.commit()

    def confer_caixa(self, cr):
        self.c.execute(f"select valor from caixa_ab where cr = '{cr}'")
        res = self.c.fetchone()
        if res: return res
        else: return False

    def aplicar_valor(self, mat, valor, gc, cr):
        self.c.execute(f"select valor from caixa_ab where cr = '{cr}'")
        valorAnterior = self.c.fetchone()
        self.c.execute(f"insert into caixa_ap(matricula, valor, valor_anterior, grupodecliente, cr, data) values ({mat}, {valor}, {valorAnterior[0]}, '{gc}', '{cr}', '{now()}')")
        valorCaixa = self.confer_caixa(cr)[0]
        self.c.execute(f"update caixa_ab set valor = {float(valorCaixa) + float(valor)} where cr = '{cr}'")
        self.conn.commit()

    def retirar_valor(self, mat, valor, motivo, gc, cr):
        self.c.execute(f"insert into caixa_sd(matricula, valor, motivo, data, grupodecliente, cr) values('{mat}','{valor}','{motivo}','{now()}','{gc}','{cr}')")
        valorCaixa = self.confer_caixa(cr)[0]
        self.c.execute(f"update caixa_ab set valor = {float(valorCaixa) - float(valor)} where cr = '{cr}'")
        self.conn.commit()

    def calcular_fechamento(self, cr):
        dd = {
            'PIX':0,
            'DINHEIRO':0,
            'DEBITO':0,
            'CREDITO':0,
            'SAIDAS':0,
            'ABERTURA':0,
            'TOTAL': 0
        }

        self.c.execute(f"select sum(valor), pagamento from vendas where to_char(data, 'dd-mm-yyyy') = '{now().strftime('%d-%m-%Y')}' and cr = '{cr}' group by pagamento")
        res = self.c.fetchall()
        if res:
            for item in res: 
                dd[item[1]] = item[0]
                dd['TOTAL'] += item[0]

        self.c.execute(f"select sum(valor) from caixa_sd where to_char(data, 'dd-mm-yyy') = '{now().strftime('%d-%m-%Y')}' and cr = '{cr}'")
        saidas = self.c.fetchone()
        if saidas:
            for item in saidas: 
                if item: dd['SAIDAS'] = item[0]

        self.c.execute(f"select abertura from caixa_ab where cr = '{cr}'")
        abertura = self.c.fetchone()
        if abertura:
            for item in abertura: 
                if item: dd['ABERTURA'] = item

        return dd

    def fechar_caixa(self, gc, cr, mat):
        dd = self.calcular_fechamento(cr)
        valorCaixa = self.confer_caixa(cr)[0]

        self.c.execute(f"""insert into caixa_fc(data, dinheiro, cartao, pix, total, saida, troco, abertura, grupodecliente  , cr, matricula)
        values ('{now()}',{dd['DINHEIRO']},{dd['DEBITO'] + dd['CREDITO']},'{dd['PIX']}','{dd['TOTAL']}','{dd['SAIDAS']}','{valorCaixa}','{dd['ABERTURA']}','{gc}','{cr}','{mat}') """)
        self.c.execute(f"delete from caixa_ab where cr = '{cr}'")
        self.conn.commit()

    def excluir_saida(self, id, cr):
        self.c.execute(f"select valor from caixa_sd where id = {id} and cr ='{cr}'")
        res = self.c.fetchone()
        if res: res = res[0]
        valorCaixa = self.confer_caixa(cr)[0]

        self.c.execute(f"update caixa_ab set valor = {float(valorCaixa) + float(res)} where cr = '{cr}'")
        self.c.execute(f"delete from caixa_sd where id = {id} and cr = '{cr}'")
        self.conn.commit()

    def excluir_saida_venda(self, id, idVenda, cr):
        self.c.execute(f"select valor from saidas where id = {id}")
        valor = float(self.c.fetchone()[0])

        self.c.execute(f"select valor from vendas where id = {idVenda} and cr = '{cr}'")
        valorVenda = float(self.c.fetchone()[0])

        total = valorVenda - valor
        if total == 0: self.c.execute(f"delete from vendas where id={idVenda} and cr = '{cr}'")
        else: self.c.execute(f"update vendas set valor = {total} where id={idVenda} and cr = '{cr}'")
        self.c.execute(f"delete from saidas where id = {id} and cr = '{cr}'")
        self.conn.commit()
        
if __name__ == '__main__':
    with connect(host=environ['host'], port=environ['port'], user=environ['user'], password=environ['pwd'], database="hbxmanager") as conn:
        mn = Manager(conn)
        mn.excluir_saida_venda(1679, 771, '1 - MS - OFICINA DO CELULAR')
