from email.message import Message
from smtplib import SMTP
from static.models.db import now


def enviar_email(nome, emailTo, sistema, senha, mat):
    # PARAMETROS DE EMAIL
    html = f"""
<meta charset="UTF-8">
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz" crossorigin="anonymous"></script>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css">
<body data-bs-theme="dark" style="background: #333; padding: 20px; color: #fff;">
    <div class="d-flex p-3">
        <img src="https://hubbix.onrender.com/static/img/logo.png" width="200" style="margin-left: 10px;">
    </div>
    <hr>
    <div style="text-align: left; padding: 10px; margin: 20px;">
        <p class="fs-3" style="fwont-size: 20px;">Bem vindo, {nome}.</p>
        <p>Nós da Hubbix Sistemas, temos o prazer de te receber !
        Estamos te propondo, 2 meses de teste gratis do HBX {sistema},
        Esperamos que aproveite toda a patricidade e facilidade de nossos apps!
        </p>
        <hr>
        <div class="d-flex flex-column p-4 mb-4">
            <p>Estamos te enviando sua senha padrão abaixo!</p>
            <p>Matricula: {mat}</p>
            <p>Senha: {senha}</p>
        </div>
        <hr>
        <p>Caso você não tenha se cadastrado no Hubbix pedimos que ignore este email!</p>
        <div class="d-flex btn-group">
            <a href="https://wa.me/5543996617904">
                <button class="btn btn-outline-success">
                    <i class="bi bi-whatsapp"></i> Enviar Mensagem
                </button>
            </a>
            <a href="https://hubbix.onrender.com/{sistema}">
                <button  class="btn btn-success">
                    <i class="bi bi-door-open-fill"></i> Realizar Login
                </button>
            </a>
        </div>
        <p style="color: gray; font-style: italic; margin-top: 20px;">
            Desenvolvido por Tecnobreve © {now().strftime('%Y')} 
        </p>
    </div>
</body>
    """ 

    host = 'smtp.gmail.com'
    port = '587'
    email = 'foxtec198@gmail.com'
    senha = 'fwmeylchtupgrmeb'
    server = SMTP(host, port)
    server.ehlo()
    server.starttls()
    server.login(email, senha)
    
    # EMAIL EM SI
    msg = Message()
    msg['From'] = email
    msg['To'] = emailTo
    msg['Subject'] = 'Boas vindas ao HBX - Não responder!'

    msg.add_header('Content-Type', 'text/html')
    msg.set_payload(html)
    server.sendmail(msg['From'], msg['To'], msg.as_string().encode('utf-8'))

