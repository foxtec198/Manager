from psycopg2 import connect
from datetime import datetime as dt, timedelta, timezone
from pandas import read_sql

def now():
    tz_brl = timezone(timedelta(hours=-3))
    return dt.now().astimezone(tz_brl)

class DB:
    def __init__(self, conn):
        self.conn = conn
        self.c = self.conn.cursor()

    # PEDIDOS =========================
    def get_pedidos(self, cmd=None, cr=None):
        if cmd: self.c.execute(F"SELECT * FROM PEDIDOS WHERE CMD = '{cmd}' AND CR = '{cr}' ")
        else:self.c.execute(F"SELECT DISTINCT CMD, STATUS FROM PEDIDOS WHERE CR = '{cr}' ")
        return self.c.fetchall()
    
    def new_pedido(self, gc, cr, produto, quantidade:int, cmd, valor, funcionario, data=now(), status='ABERTO', cliente:str='Não Informado'):
        if cliente == '': cliente = 'Não Informado'
        self.c.execute(f"""insert into pedidos(produto, quantidade, cmd, valor, funcionario, data, status, grupodecliente, cr)
        values ('{produto}','{quantidade}','{cmd}','{valor}','{funcionario}','{data}','{status}','{gc}','{cr}')""")
        valorN = valor*quantidade
        exists = self.get_cmd(cmd, cr)
        if exists: 
            self.c.execute(f"select valor_real from comandas where cmd = '{cmd}' and cr = '{cr}' ")
            valorAntigo = self.c.fetchone()
            if not valorAntigo: valorAntigo = 0
            else: valorAntigo = valorAntigo[0]
            newValor = valorAntigo + valorN
            self.c.execute(f"update comandas set valor_real = {newValor} where cmd = '{cmd}' and cr = '{cr}'")
            if not self.config_pedidos(cr): self.levar_pedido(cmd, cr)
            self.minus_prod(self.get_produto_by_name(produto, cr), quantidade)
            self.conn.commit()
        else: 
            self.new_cmd(cmd, valorN, funcionario, cliente, gc=gc, cr=cr)
            if self.config_pedidos(cr): self.conn.rollback()
            else: self.levar_pedido(cmd, cr)
            self.minus_prod(self.get_produto_by_name(produto, cr), quantidade)
        self.conn.commit()

    def levar_pedido(self, cmd, cr):
        self.c.execute(f"update pedidos set status = 'ENTREGUE' where status = 'ABERTO' and cmd = '{cmd}' and cr = '{cr}' ")
        self.conn.commit()

    def cancelar_pedido(self, cmd, cr):
        exits = self.get_cmd(cmd, cr)
        if exits:
            for item in exits: ...
            self.c.execute(f"select sum(valor*quantidade) from pedidos where status = 'ABERTO' and cmd = '{cmd}' and cr = '{cr}'")
            valorC = self.c.fetchone()
            if not valorC[0]: valorC = 0
            else: valorC = valorC[0]
            valorA = item[1]
            valorNovo = valorA - valorC
            self.c.execute(f"update comandas set valor_real = '{valorNovo}' where cmd = '{cmd}' and cr = '{cr}' ")
            self.c.execute(f"update pedidos set status = 'CANCELADO' where status = 'ABERTO' and cmd = '{cmd}' and cr = '{cr}' ")
            self.c.execute(f"select produto, quantidade, status from pedidos where status in ('ABERTO','ENTREGUE','CANCELADO') and cmd = '{cmd}' and cr = '{cr}'")
            prod = self.c.fetchall()
            for prod, quantA, st in prod:
                if st == 'CANCELADO': self.add_prod(self.get_produto_by_name(prod, cr), quantA)
            self.conn.commit()
            return 'Sucesso'

    def finalizar_pedidos(self, cmd, status='FINALIZADO', cr=None, idVenda=None):
        self.c.execute(f"select * from pedidos where status in ('ABERTO','ENTREGUE','CANCELADO') and cmd = '{cmd}' and cr = '{cr}' ")
        if status != 'VENDA CANCELADA':
            for nome, quantidade, cmd, st, valor, atendente, data, gc, cr in self.c.fetchall():
                if st != 'CANCELADO': self.c.execute(f"insert into saidas(id_venda, nome_produto, quantidade, valor, funcionario, data, cr) values ('{idVenda}','{nome}',{quantidade},{valor},'{atendente}','{data}','{cr}')")
                self.c.execute(f"update pedidos set status = '{status}' where status in ('ABERTO','ENTREGUE','CANCELADO') and cmd = '{cmd}' and cr = '{cr}' ")
        else: self.c.execute(f"update pedidos set status = '{status}' where status in ('ABERTO','ENTREGUE','CANCELADO') and cmd = '{cmd}' and cr = '{cr}' ")
        self.conn.commit()

    # COMANDAS =========================
    def new_cmd(self, cmd, valor_real, funcionario, cliente:str='Não informado', data=now(), gc=None, cr=None):
        self.c.execute(f"""
                  insert into comandas(cmd, valor_real, funcionario, data, cliente, grupodecliente, cr)
                  values ('{cmd}','{valor_real}','{funcionario}','{data}','{cliente}','{gc}','{cr}')
                  """)
        self.conn.commit()
        
    def get_cmd_all(self, cr):
        self.c.execute(f"select * from comandas where cr = '{cr}'")
        return self.c.fetchall()

    def get_cmd(self, cmd = None, cr=None):
        self.c.execute(f"select * from comandas where cmd = '{cmd}' and cr = '{cr}'")
        return self.c.fetchall()

    def del_cmd(self, cmd = None, cr = None):
        if cmd: self.c.execute(f"delete from comandas where cmd = '{cmd}' and cr = '{cr}' ")
        else: self.c.execute(f"delete from comandas where cr = '{cr}' ")
        self.conn.commit()

    def fechar_cmd(self, gc, cr, cmd, pago='', tipo='', status='FINALIZADA'):
        exits = self.get_cmd(cmd, cr)
        for item in exits: 
            if not pago: pago = item[1]
        if exits:
            idVenda = self.new_venda(cmd, item[1], pago, tipo, item[2], status, data= item[3], cliente=item[4], gc=gc, cr=cr)
            if status == 'CANCELADA': self.finalizar_pedidos(cmd, 'VENDA CANCELADA', cr=cr, idVenda=0)
            else: self.finalizar_pedidos(cmd, cr=cr, idVenda=idVenda[0])
            self.del_cmd(cmd, cr)
    
    def cancelar_cmd(self, gc, cr, cmd):
        self.c.execute(f"select produto, quantidade, status from pedidos where status in ('ABERTO','ENTREGUE','CANCELADO') and cmd = '{cmd}' and cr = '{cr}'")
        prod = self.c.fetchall()
        for prod, quantA, status in prod:
            if status != 'CANCELADO': self.add_prod(self.get_produto_by_name(prod, cr), quantA)
        self.fechar_cmd(gc, cr, cmd, '', 'CANCELADO', status='CANCELADA',)
        self.conn.commit()
        return 'Sucesso'

    def cancelar_item(self, nome, status, valor, cmd, cr):
        self.c.execute(f"""UPDATE PEDIDOS SET status = 'CANCELADO'WHERE produto = '{nome}' AND cmd = '{cmd}' AND status = '{status}' AND cr = '{cr}'""")
        self.c.execute(f"select valor_real from comandas where cmd = '{cmd}' and cr = '{cr}'")
        valorAntigo = self.c.fetchone()
        valorNovo = float(valorAntigo[0]) - float(valor)
        self.c.execute(f"update comandas set valor_real = {valorNovo} where cmd = '{cmd}' and cr = '{cr}' ")
        self.conn.commit()

    # VENDAS ===========================
    def new_venda(self, cmd, valor, pago, tipo, funcionario, status = 'FINALIZADA', data=now(), cliente='Não informado', gc=None, cr=None):
        if cliente == '': cliente = 'Não Informado'
        self.c.execute(f"""
            insert into vendas (cmd, valor_real, valor_pago, tipo, cliente, data, funcionario, status, grupodecliente, cr)
            values ('{cmd}','{valor}','{pago}','{tipo}','{cliente}','{data}','{funcionario}','{status}','{gc}','{cr}') returning id
            """)
        self.conn.commit()
        idVenda = self.c.fetchone()
        return idVenda

    def get_vendas_dia(self, cr, dia=now().strftime('%d-%m-%Y')):
        self.c.execute(F'''
            select sum(valor_real) from vendas 
            where cr = '{cr}' 
            and to_char(data, 'DD-MM-YYYY') = '{dia}'
            and status = 'FINALIZADA'
            ''')
        res = self.c.fetchone()
        if res[0]: res = res[0]
        else: res = 0
        return res
        
    def get_vendas_mes(self, cr, mes=now().strftime('%m-%Y')):
        self.c.execute(F'''
            select sum(valor_real) from vendas 
            where cr = '{cr}' 
            and to_char(data, 'MM-YYYY') = '{mes}'
            and status = 'FINALIZADA'
            ''')
        res = self.c.fetchone()
        if res[0]: res = res[0]
        else: res = 0
        return res

    def get_quant_vendas_mes(self, cr, mes=now().strftime('%m')):
        self.c.execute(F'''
            select count(valor_real) from vendas 
            where cr = '{cr}' 
            and to_char(data, 'MM') = '{mes}'
            and status = 'FINALIZADA'
            ''')
        res = self.c.fetchone()
        if res[0]: res = res[0]
        else: res = 0
        return res

    def get_vendas_tipo_dia(self, cr, tipo=None, dia=now().strftime('%d-%m-%Y')):
        if not tipo:
            self.c.execute(f"""
                select tipo, sum(valor_real)  
                from vendas
                where cr = '{cr}'
                and to_char(data, 'DD-MM-YYYY') = '{dia}'
                group by tipo
            """)
            res = self.c.fetchall()
            return res
        else:
            self.c.execute(f"""
                select sum(valor_real)
                from vendas
                where cr = '{cr}'
                and to_char(data, 'DD-MM-YYYY') = '{dia}'
                and tipo = '{tipo}'
            """)
            res = self.c.fetchone()
            if res[0]: res  = res[0]
            else: res = 0
            return res

    def get_vendas_tipo_mes(self, cr, mes=now().strftime('%m')):
        self.c.execute(f"""
            select tipo, sum(valor_real)  
            from vendas
            where cr = '{cr}'
            and to_char(data, 'MM') = '{mes}'
            group by tipo
        """)
        res = self.c.fetchall()
        return res

    def get_vendas(self,cr,  mes=now().strftime('%m-%Y')):
        self.c.execute(f"select cmd, valor_real, valor_pago, tipo, cliente, data, funcionario, status, id from vendas where cr = '{cr}' and to_char(data, 'MM-YYYY') = '{mes}' order by data desc")
        return self.c.fetchall()

    def cancelar_venda(self, id, cr):
        self.c.execute(f"select nome_produto, quantidade from saidas where id_venda = {id}")
        res = self.c.fetchall()
        for nome, quant in res:
            idProd = self.get_produto_by_name(nome, cr)
            if idProd:
                self.add_prod(idProd, quant)
        self.c.execute(f"delete from saidas where id_venda = {id}")
        self.c.execute(f"UPDATE VENDAS SET STATUS = 'CANCELADA', TIPO = 'CANCELADO' WHERE ID = {id}")
        self.conn.commit()
        return True

    def confer_alerta(self, id, cr):
        self.c.execute(f"select quantidade, alerta from produtos where id = {id} and cr = '{cr}'")
        res = self.c.fetchone()
        if res[0] <= res[1]: return True
        else: return False
    
    def confer_zero(self, id, cr):  
        self.c.execute(f"select quantidade from produtos where id = {id} and cr = '{cr}'")
        res = self.c.fetchone()
        if res[0] == 0: return True
        else: return False

    def get_saidas(self, idVenda, cr):
        self.c.execute(f"select distinct nome_produto, quantidade from saidas where id_venda = {idVenda} and cr = '{cr}' ")
        return self.c.fetchall()
    
    # CATEGORIAS ===========================
    def get_categorias(self, cr):
        self.c.execute(f"select * from categorias where cr = '{cr}' order by nome")
        return self.c.fetchall()
    
    def get_categ_by_name(self, name, cr):
        self.c.execute(f"select id from categorias where nome = '{name}' and cr = '{cr}' ")
        res = self.c.fetchone()
        if res[0]: return res[0]
        else: return res

    def add_categ(self, *args):
        for nome, gc, cr in args:
            self.c.execute(f"insert into categorias(nome, grupodecliente, cr) values('{nome.upper()}','{gc}','{cr}')")
            self.conn.commit()

    def remove_categ(self, id):
        self.c.execute(f"delete from categorias where id = {id}")
        self.conn.commit()

    # PRODUTOS ===========================
    def get_produtos(self, cr):
        self.c.execute(f"select * from produtos where cr = '{cr}'")
        return self.c.fetchall()

    def get_produtos_with_categ(self, cr):
        self.c.execute(f"select * from produtos p inner join categorias c on c.id = p.id_categoria where p.cr = '{cr}' order by p.nome")
        return self.c.fetchall()
      
    def get_produto_id(self, id, cr):
        self.c.execute(f"select nome, valor from produtos where id =  '{id}' and cr = '{cr}'")
        return self.c.fetchall()

    def prod_categ(self, categ = None, cr = None):
        if not categ: self.c.execute(f"select p.nome, p.valor, p.quantidade, c.nome as categoria, p.img from produtos p inner join categorias c on c.id = p.id_categoria where p.cr = '{cr}'")
        else: self.c.execute(f"select p.nome, p.valor, p.quantidade, c.nome as categoria, p.id from produtos p inner join categorias c on c.id = p.id_categoria where c.nome = '{categ}' and p.cr = '{cr}'")
        return self.c.fetchall()

    def idsProd(self, cr):
        self.c.execute(F"SELECT ID FROM PRODUTOS WHERE CR = '{cr}' ")
        res = self.c.fetchall()
        ids = []
        if res[0]:
            for item in res:
                ids.append(item[0])
            return ids

    def quantidade_produtos(self, cr):
        self.c.execute(f"select count(id) from produtos where cr = '{cr}'")
        return self.c.fetchone()

    def get_categorias_with_id(self, cr):
        self.c.execute(f"select id, nome from categorias where cr = '{cr}'")
        return self.c.fetchall()

    def update_prod(self, *args):
        for id, nome, categoria, custo, valor, quantidade, alerta, img, cr in args:
            idCateg = self.get_categ_by_name(categoria, cr)
            if not img: 
                self.c.execute(f"""update produtos set 
                               nome = '{nome}',
                               id_categoria = {idCateg},
                               custo = {float(custo)},
                               valor = {float(valor)},
                               quantidade = {quantidade},
                               alerta = {alerta}
                               where id = {id}
                               """)
            else:
                self.c.execute(f"""update produtos set 
                               nome = '{nome}',
                               id_categoria = {idCateg},
                               custo = {float(custo)},
                               valor = {float(valor)},
                               quantidade = {quantidade},
                               alerta = {alerta},
                               img = '../../static/img/prods/{img}'
                               where id = {id}
                               """)
            self.conn.commit()
    
    def del_prod(self, id):
        self.c.execute(f'delete from produtos where id = {id}')
        self.conn.commit()

    def new_prod(self, nome, id_categoria:int, custo:float, valor:float, quantidade:int, alerta:int, gc, cr, img='../../static/img/blank.png'):
        self.c.execute(
            F"""
            INSERT INTO PRODUTOS(NOME, ID_CATEGORIA, CUSTO, VALOR, QUANTIDADE, ALERTA, DATA, IMG, GRUPODECLIENTE, CR)
            VALUES('{nome}',{id_categoria},{custo},{valor},{quantidade},{alerta},'{now()}','{img}','{gc}','{cr}')
            """
        )
        self.conn.commit()

    def add_prod(self, id, nv=1):
        self.c.execute(F"select quantidade from produtos where id = '{id}' ")
        exists = self.c.fetchone()
        valor = exists[0]
        quantidade = valor + nv
        self.c.execute(f"update produtos set quantidade = '{quantidade}' where id = '{id}' ")
        return valor, quantidade

    def minus_prod(self, id, nv=1):
        self.c.execute(f"select quantidade from produtos where id = '{id}' ")
        exists = self.c.fetchone()
        valor = exists[0]
        quantidade = valor - nv
        self.c.execute(f"update produtos set quantidade = '{quantidade}' where id = '{id}' ")
        return valor, quantidade

    def get_produto_by_name(self, name, cr):
        self.c.execute(f"select id from produtos where cr = '{cr}' and nome = '{name}' ")
        res = self.c.fetchone()
        if res: return res[0]
        else: return False

    # CONFIG ===========================
    def get_atendente(self, matricula, cr):
        if matricula: self.c.execute(f"SELECT NOME, PERMISSAO, SENHA, GRUPODECLIENTE, CR FROM FUNCIONARIOS WHERE MATRICULA = '{matricula}' AND CR = '{cr}' ")
        else: self.c.execute(f"SELECT NOME, PERMISSAO, SENHA, GRUPODECLIENTE, CRFROM FUNCIONARIOS WHERE CR = '{cr}' ")
        return self.c.fetchall()

    def remove_func(self, mat, cr):
        self.c.execute(f"delete from funcionarios where matricula = {mat} and cr = '{cr}' ")
        self.conn.commit()

    def get_login(self, matricula):
        self.c.execute(f"""SELECT NOME, PERMISSAO, SENHA, GRUPODECLIENTE, CR FROM funcionarios WHERE MATRICULA = '{matricula}' """)
        return self.c.fetchall()

    def get_config(self, cr):
        self.c.execute(f"select * from config where cr = '{cr}'")
        return self.c.fetchall()

    def salvar_config(self, imp, ped, cmds, es, cr):
        self.c.execute(f"""update config set
                        imprimir = {imp},
                        pedidos = {ped},
                        comandas = {cmds},
                        estoque = {es} 
                        where cr = '{cr}' 
                    """)
        self.conn.commit()

    def config_pedidos(self, cr):
        self.c.execute(f"select pedidos from config where cr = '{cr}'")
        return self.c.fetchone()[0]

    def get_atendentes(self, cr):
        self.c.execute(f"select matricula, nome, permissao from funcionarios where cr = '{cr}' ")
        return self.c.fetchall()

    def get_perm(self, mat):
        self.c.execute(f"select permissao from funcionarios where matricula = {mat}")
        res = self.c.fetchone()
        if res: return res[0]

    def admin_func(self, mat, cr):
        self.c.execute(f"update funcionarios set permissao = 'ADMIN' where matricula = {mat}")
        self.conn.commit()
    
    def exportar_vendas_dia(self, cr, data=now()):
        cons = (f"""
        SELECT * FROM VENDAS
        WHERE CR = '{cr}'
        AND to_char(data, 'DD-MM-YYYY') = '{data.strftime('%d-%m-%Y')}' 
        """)
        nome = f"vendas_dia_{cr}.xlsx"
        arquivo = 'static/export/' + nome
        df = read_sql(cons, self.conn)
        df.to_excel(arquivo)
        return nome

    def exportar_vendas_mes(self, cr, data=now()):
        print(data.strftime('%m-%Y'))
        cons = (f"""
        SELECT * FROM VENDAS
        WHERE CR = '{cr}'
        AND to_char(data, 'MM-YYYY') = '{data.strftime('%m-%Y')}' 
        """)
        nome = f"vendas_mesal_{cr}.xlsx"
        arquivo = 'static/export/' + nome
        df = read_sql(cons, self.conn)
        df.to_excel(arquivo)
        return nome

    def exportar_vendas_ano(self, cr, data=now()):
        cons = (f"""
        SELECT * FROM VENDAS
        WHERE CR = '{cr}'
        AND to_char(data, 'YYYY') = '{data.strftime('%Y')}' 
        """)
        nome = f"vendas_anual_{cr}.xlsx"
        arquivo = 'static/export/' + nome
        df = read_sql(cons, self.conn)
        df.to_excel(arquivo)
        return nome

    def exportar_produtos(self, cr):
        cons = (f"""
        SELECT P.ID, P.NOME, C.NOME AS CATEGORIA, CUSTO, VALOR, QUANTIDADE, ALERTA, DATA FROM PRODUTOS P
        INNER JOIN CATEGORIAS C
                ON C.ID = P.ID_CATEGORIA
        WHERE P.CR = '{cr}'
        """)
        nome = f"PRODUTOS_{cr}.xlsx"
        arquivo = 'static/export/' + nome
        df = read_sql(cons, self.conn)
        df.to_excel(arquivo)
        return nome

    def exportar_maiores_saidas(self, cr):
        cons = (f"""
        SELECT DISTINCT NOME_PRODUTO, sum(QUANTIDADE) AS TOTAL
        FROM SAIDAS
        WHERE CR = '{cr}'
        GROUP BY NOME_PRODUTO
        ORDER BY TOTAL DESC
        """)
        nome = f"MAIORES_SAIDAS_{cr}.xlsx"
        arquivo = 'static/export/' + nome
        df = read_sql(cons, self.conn)
        df.to_excel(arquivo)
        return nome

    def exportar_zerados(self, cr):
        cons = (f"""
        SELECT * FROM PRODUTOS
        WHERE CR = '{cr}'
        AND QUANTIDADE = 0
        """)
        nome = f"ZERADOS_{cr}.xlsx"
        arquivo = 'static/export/' + nome
        df = read_sql(cons, self.conn)
        df.to_excel(arquivo)
        return nome

    def exportar_limitados(self, cr):
        cons = (f"""
        SELECT * FROM PRODUTOS
        WHERE CR = '{cr}'
        AND QUANTIDADE <= ALERTA
        """)
        nome = f"PRODUTOS_NO_LIMITE_{cr}.xlsx"
        arquivo = 'static/export/' + nome
        df = read_sql(cons, self.conn)
        df.to_excel(arquivo)
        return nome

    def exportar_saidas(self, cr, data=now()):
        cons = (f"""
        SELECT * FROM SAIDAS
        WHERE CR = '{cr}'
        AND to_char(DATA, 'DD-MM-YYYY') = '{data.strftime('%d-%m-%Y')}'
        """)
        nome = f"SAIDAS_{cr}.xlsx"
        arquivo = 'static/export/' + nome
        df = read_sql(cons, self.conn)
        df.to_excel(arquivo)
        return nome
    
    def exportar_funcs(self, cr):
        cons = (f"""
        SELECT MATRICULA, NOME, PERMISSAO FROM FUNCIONARIOS
        WHERE CR = '{cr}'
        """)
        nome = f"FUNCIONARIOS_{cr}.xlsx"
        arquivo = 'static/export/' + nome
        df = read_sql(cons, self.conn)
        df.to_excel(arquivo)
        return nome

    # DASHBORAD ===========================
    def vendas_por_tipo(self, cr):
        cons = f"""
        SELECT DISTINCT TIPO, sum(VALOR_REAL) as total FROM VENDAS WHERE CR = '{cr}' AND STATUS = 'FINALIZADA' GROUP BY TIPO
        """
        df = read_sql(cons, self.conn)
        tipos = []
        total = []
        for item in df['tipo']: tipos.append(item)
        for item in df['total']: total.append(item)
        return {'tipos':tipos, 'total':total}

    def vendas_dia(self, cr):
        cons = f"""
        SELECT DISTINCT to_char(data, 'DD') as dia, 
        sum(VALOR_REAL) as total,
        count(VALOR_REAL) as quantidade
        FROM VENDAS 
        WHERE CR = '{cr}' 
        AND status = 'FINALIZADA'
        GROUP BY dia 
        ORDER BY dia desc
        """
        df = read_sql(cons, self.conn)
        dias = []
        quant = []
        total = []
        for item in df['dia']: dias.append(item)
        for item in df['quantidade']: quant.append(item)
        for item in df['total']: total.append(item)
        return {'dias':dias, 'total':total, 'quantidade': quant}

    def total_vendas_mes(self, cr):
        self.c.execute(f"select sum(valor_real) from vendas where status = 'FINALIZADA' and cr = '{cr}'")
        res = self.c.fetchone()
        if res[0]: return res[0]
        else: return 0

    def ticket_por_cumpom(self, cr):
        ref = now().strftime('%m-%Y')
        self.c.execute(f"select sum(quantidade) as prod, count(id) as cmd from saidas where cr = '{cr}' and to_char(data, 'MM-YYYY') = '{ref}' ")
        res = self.c.fetchall()
        for prod, cmd in res:
            if prod and cmd:
                ticket = prod/cmd
                return round(ticket, 2)
            else: return 0

    def ticket_medio(self, cr):
        ref = now().strftime('%m-%Y')
        self.c.execute(f"select sum(valor)/sum(quantidade) from saidas where cr = '{cr}' ")
        res = self.c.fetchone()
        if res[0]: return round(res[0], 2)
        else: return 0

    def canceladas_mes(self, cr):
        ref = now().strftime('%m-%Y')
        self.c.execute(f"select sum(valor_real) from vendas where status = 'CANCELADA' and cr = '{cr}' and to_char(data, 'MM-YYYY') = '{ref}'")
        res = self.c.fetchone()
        if res[0]: return res[0]
        else: return 0

    def saida_produtos(self, cr):
        ref = now().strftime('%m-%Y')
        cons = f"select distinct nome_produto, sum(quantidade) as total from saidas where cr = '{cr}' and to_char(data, 'MM-YYYY') = '{ref}' group by nome_produto order by total desc"
        self.c.execute(cons)
        return self.c.fetchall()

    def saida_produtos_dia(self, cr): 
        ref = now().strftime('%d-%m-%Y')
        cons = f"select distinct nome_produto, sum(quantidade) as total from saidas where cr = '{cr}' and to_char(data, 'DD-MM-YYYY') = '{ref}' group by nome_produto order by total desc"
        self.c.execute(cons)
        return self.c.fetchall()

    def new_func(self, nome, pwd, perm, gc, cr):
        self.c.execute(f"""
                    insert into funcionarios(nome, permissao, senha, grupodecliente, cr)
                    values ('{nome.upper()}','{perm.upper()}','{pwd}','{gc}','{cr}')
                       """)
        self.conn.commit()

    def ranking_func(self, cr):
        self.c.execute(
            f"select distinct funcionario, sum(quantidade) as total from saidas where cr = '{cr}' group by funcionario order by total desc"
        )
        return self.c.fetchall()

    def vendas_categ2(self, cr):
        ref = now().strftime('%m-%Y')
        cons = (f"select distinct nome_produto as nome, sum(quantidade) as total from saidas where cr = '{cr}' and to_char(data,'MM-YYYY') = '{ref}' group by nome_produto order by total desc")
        self.c.execute(cons)
        res = self.c.fetchall()
        categs = []
        quants = []

        for nome, quant in res:
            self.c.execute(f"select c.nome from produtos p inner join categorias c on c.id = p.id_categoria where p.cr = '{cr}' and p.nome = '{nome}' ")
            res = self.c.fetchone()
            if res:
                categs.append(nome)
                quants.append(quant)

        return categs, quants

if __name__ == '__main__':
    cr = '2 - PR - TECNOBREVE'
    conn = connect(host='stately-allowing-snapper.data-1.use1.tembo.io', port='5432',user='postgres', password='H6KAGLThX39kcNNH', database='HBXGourmet')
    c = conn.cursor()
    db = DB(conn)
    
    print(
        db.vendas_categ2(cr)
    )
