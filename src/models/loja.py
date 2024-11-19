from psycopg2 import connect
from static.models.db import now

class Loja:
    def __init__(self):
        self.conn = connect(host='stately-allowing-snapper.data-1.use1.tembo.io', port='5432', user='postgres', password='H6KAGLThX39kcNNH', database="lojas")
        self.c = self.conn.cursor()

    def conf_user(self, uid):
        self.c.execute(f"""SELECT "CR", "GrupoCliente", mat FROM lojas WHERE uid = '{uid}' """)
        res = self.c.fetchall()
        if res: return res
        else: return False

    def get_next_id(self):
        self.c.execute('select count(cpf_cnpj) + 1 from lojas')
        return self.c.fetchone()[0]

    def add_loja(self, idLoja, nomeLoja, bairro, cep, cidade, estado, num, rua, negociante, email, telefone, sistema, gc, cr, mat, data_teste:now, situacao="Ativa", pacote = "Teste", dataCriacao = now()):
        self.c.execute(f"""
            INSERT INTO lojas (cpf_cnpj, nome_loja, data_criacao, bairro, cep, cidade, estado, numero, rua, negociante, email, telefone, pacote, sistema, situacao, "GrupoCliente", "CR", mat, teste)
            VALUES ('{idLoja}', '{nomeLoja}','{dataCriacao}','{bairro}','{cep}','{cidade}','{estado}','{num}','{rua}','{negociante}','{email}','{telefone}','{pacote}','{sistema}','{situacao}','{gc}','{cr}','{mat}','{data_teste}')
        """)
        self.conn.commit()

    def get_loja(self, cr):
        self.c.execute(f'''select * from lojas where "CR" = '{cr}' ''')
        return self.c.fetchall()
    
if __name__ == '__main__':
    l = Loja()
    a = l.get_next_id()
    print(a)
