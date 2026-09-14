# Rafael Montagens — One Page 3D

Landing page profissional para um montador de móveis, construída do zero com HTML, CSS e JavaScript.

## Recursos

- Cena 3D em Three.js que reage ao mouse e ao scroll.
- Animações com GSAP + ScrollTrigger.
- Layout responsivo/mobile-first adaptado para celular, tablet e desktop.
- Tabela de preços de referência.
- Formulário que gera mensagem de orçamento para WhatsApp.
- Integração de mapa via Google Maps embed.
- Seção preparada para avaliações reais do Google.
- Acessibilidade básica e suporte a `prefers-reduced-motion`.

## Configurar WhatsApp

Abra `script.js` e altere:

```js
const WHATSAPP_NUMBER = '';
```

Para o número real no padrão internacional, por exemplo:

```js
const WHATSAPP_NUMBER = '5511999999999';
```

## Avaliações do Google

As avaliações exibidas no protótipo são exemplos identificados como demonstração. Para produção, substitua por avaliações reais autorizadas ou conecte a Google Places API / Perfil da Empresa por uma integração segura no backend.

## Rodar localmente

Use um servidor local, por exemplo:

```bash
python -m http.server 8000
```

Depois abra `http://localhost:8000`.
