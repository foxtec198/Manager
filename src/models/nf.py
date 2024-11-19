from PIL import Image, ImageFont, ImageDraw
from time import strftime as stf

class NF():
    def __init__(self) -> None:
        self.cd_logo = (60, 40)
        self.cd_info = (60,230)
        self.cd_pedido = (60,300)
        self.cd_cmd = (60, 700)
        # self.font = ImageFont.truetype('src/fonts/BebasNeue-Regular.ttf', 25)
        # try:
        self.font = ImageFont.truetype('static/fonts/coolvetica condensed rg.otf', 28)
        self.fontProd = ImageFont.truetype('static/fonts/Roboto-Regular.ttf', 22)
        # except:
        #     self.font = ImageFont.truetype('../static/fonts/coolvetica condensed rg.otf', 28)
        #     self.fontProd = ImageFont.truetype('../static/fonts/Roboto-Regular.ttf', 22)


    def rsz(self, img, scale):
        x = int(img.size[0]) / int(scale)
        y = int(img.size[1]) / int(scale)
        newImg = img.resize((int(x), int(y)))
        return newImg

    def montar(self, cmd:int, pedido:list, atendente:str, cr:str):
        self.data = stf('%d-%m-%Y')
        self.hora = stf('%H:%M')

        modelo = Image.open('static/img/modelo_de_nota.png')

        # CENTRALIZAR
        c1 = int(modelo.size[0]/2)

        # LOGO
        logo = Image.open('static/img/logo.png', mode='r')
        logo = self.rsz(logo, 3)
        c2 = int(c1 - logo.size[0]/2)
        modelo.paste(logo, (c2, self.cd_logo[1]), logo)

        # INFO 
        info = f'{self.data} - {self.hora} | Comanda/Mesa: {cmd} | Atendente: {atendente}'
        draw = ImageDraw.Draw(modelo)
        draw.text((modelo.width//2, self.cd_info[1]), info, font=self.font, fill='black', align='center', anchor='mm')

        # PEDIDO
        x, y = self.cd_pedido
        dpedido = set(pedido)
        draw.text((modelo.width//2, self.cd_pedido[1]), 'Pedido:', font=self.fontProd, fill='black', anchor='mm')
        count = 50
        for item in dpedido:
            quant = pedido.count(item)
            draw.text((modelo.width//2, self.cd_pedido[1] + count), f' - {quant}x - {item}', font=self.fontProd, fill='black', anchor='mm')
            count += 30

        nome = f'nf_{cmd}_{cr}.png'
        arq = 'static/nf/' + nome
        modelo.save(arq)
        return nome

if __name__ == '__main__':
    NF().montar(999, ['TESTE 1','TESTE 2','TESTE 3','TESTE 1'], 'TESTE')