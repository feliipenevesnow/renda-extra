# Revisão da página de venda — 11/09/2026

A página continua vendendo o e-book “Dinheiro Online Agora 2026”, de Felipe Neves, por R$ 29,90, com os três materiais complementares já anunciados no projeto. O foco da oferta passou a ser o conteúdo e o desenvolvimento de habilidades para explorar trabalho digital.

## Alterações

- Removidos simulador financeiro, visitantes aleatórios, notificações fictícias de compradores e redução automática de vagas.
- Removidos descontos e preços de referência sem comprovação, urgência de lançamento e modal de saída que pressionava o visitante.
- Reescritos os 10 temas, benefícios, metadados e perguntas frequentes, eliminando promessas de facilidade, renda automática, pagamentos imediatos e retornos em prazos definidos.
- Mantidos identidade visual, apresentação dos temas, preço, materiais complementares e URL original de compra na Hotmart.
- A capa original (`assets/cover.png`) e a imagem do autor (`assets/author-badge.png`) estão preservadas e exibidas na página. A representação em texto foi retirada a pedido do autor, e a capa e sua legenda foram centralizadas. O título do produto permanece “Dinheiro Online Agora 2026”.
- O botão principal do início leva aos 10 temas e o link sublinhado leva à apresentação da oferta. A capa ganhou inclinação 3D e reflexo suaves vinculados ao scroll, com resposta adicional ao mouse no desktop. A preferência de movimento reduzido desativa o efeito, inclusive quando alterada durante a navegação. Nenhum conteúdo ou link depende da animação.
- Acabamento geral: tipografia e espaçamentos revisados, separadores discretos entre seções, sombras mais contidas nos temas e bônus, oferta com borda suave e FAQ com indicação visual de abertura. Títulos e blocos acompanham a entrada na tela conforme o scroll, nos dois sentidos, com deslocamento de até 38 px e sem ocultar o conteúdo. A capa tem parallax e inclinação mais perceptíveis. CSS e JavaScript usam uma versão na URL para renovar o cache. O movimento foi verificado em celular e desktop, incluindo rolagem de volta e preferência de movimento reduzido. A verificação final foi limitada a celular e desktop, navegação, FAQ e ausência de erros no navegador.
- Explicados formato digital, pagamento único, aprovação do pagamento, eventuais custos de execução e procedimento de reembolso. Retiradas alegações não verificadas de criptografia, certificação e acesso vitalício.
- Criadas páginas de privacidade, termos/reembolso e aviso sobre resultados, acessíveis por links comuns sem JavaScript. O contato e o nome completo usados são os que já constavam no repositório.
- FAQ convertido para controles nativos. Removida dependência de fontes externas; esta versão não inclui pixels, analytics, cookies ou armazenamento no navegador.

## Validação realizada

- Sintaxe de `script.js` e `git diff --check`.
- Chromium: 320, 390, 768 e 1440 px, com e sem JavaScript.
- Dez temas, três materiais, ausência de controles financeiros e notificações fictícias, IDs únicos e ausência de rolagem horizontal.
- FAQ por clique e teclado, navegação interna, URL do botão de compra, páginas institucionais e barra fixa sem obstruir a oferta ou o rodapé.
- Inspeção visual de capturas do início e da oferta em celular e desktop; nenhum erro de JavaScript nos testes.

## Limites da revisão e publicação

O PDF e o conteúdo dos materiais complementares não estão neste repositório. A abertura do checkout pela ferramenta de consulta retornou erro; foi validado o endereço preservado no código, não a conclusão de uma compra. Os nomes descritivos dos materiais na página devem corresponder aos arquivos entregues.

Antes de reenviar os anúncios, confira no produto e na Hotmart: preço de R$ 29,90, entrega dos três materiais, formato PDF, garantia anunciada de 7 dias, identidade do produtor e funcionamento do e-mail de suporte. Publique os seis arquivos do site juntos (`index.html`, `styles.css`, `script.js`, `privacidade.html`, `termos.html` e `aviso-legal.html`). Esta revisão não publica o site nem altera anúncios ou configurações da Hotmart.

A hospedagem e eventuais scripts adicionados fora deste repositório precisam corresponder à política de privacidade publicada. A revisão reduz problemas identificados na página, mas não garante aprovação: anúncio, destino, produto e conta são avaliados pelo Google. Um aviso no rodapé não corrige uma promessa enganosa no restante da oferta.

## Referências consultadas

- [Google Ads — Declarações não confiáveis](https://support.google.com/adspolicy/answer/15936857?hl=pt-BR): promessas ilusórias de retorno financeiro com pouco esforço, risco ou investimento.
- [Google Ads — Deturpação](https://support.google.com/adspolicy/answer/6020955?hl=pt-BR): informação sobre produto, identidade, preço e afiliações. As políticas consultadas não estabelecem proibição automática das palavras “dinheiro” ou “oficial”; contexto e veracidade são determinantes.
- [Hotmart — Termo Geral de Compra](https://hotmart.com/pt-br/legal/termos-de-compra) e [solicitação de reembolso](https://refund.hotmart.com/).
