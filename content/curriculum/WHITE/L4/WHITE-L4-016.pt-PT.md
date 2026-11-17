---
id: WHITE-L4-016
track: WHITE
officialTrackName: "Paper Assets"
level: 4
lessonNumber: 16
title: "Análise do straddle: por que apostar na volatilidade é diferente de apostar na direção"
summary: "Entenda como um straddle com opções permite a um investidor lucrar com um grande movimento de preço em qualquer direção, distinguindo as apostas na volatilidade das apostas na direção."
version: "1.0"
author: "Edunancial Faculty"
date: "2026-10-11"
locale: pt-PT
source_locale: "en-US"
---
# WHITE-L4-016: Análise do straddle: por que apostar na volatilidade é diferente de apostar na direção

## Cenário de abertura
SUPOSIÇÃO/OPINIÃO (cenário hipotético apenas para fins didáticos): Imagine a moeda de uma economia de porte médio perdendo, em poucos meses, uma grande parte do seu valor em relação às principais moedas de reserva, por causa da fuga de capitais do país e da queda da confiança dos investidores. À medida que a moeda de uma economia de porte médio oscila de forma imprevisível em meio à fuga de capitais, um investidor que acompanha uma ação relacionada e exposta a essa moeda acredita que um grande movimento de preço está por vir, mas não tem uma convicção forte sobre a direção. Esta lição apresenta a estratégia criada exatamente para esse tipo de incerteza.

## Objetivos de aprendizagem
- Explicar a estrutura de uma estratégia de opções de straddle comprado (long straddle).
- Explicar por que um straddle lucra com um grande movimento de preço em qualquer direção.
- Identificar as condições em que um straddle tende a perder dinheiro.
- Distinguir uma aposta direcional de uma aposta na volatilidade usando o exemplo do straddle.

## Conteúdo principal
Um straddle comprado combina a compra de uma call e de uma put da mesma ação subjacente, com o mesmo preço de exercício e a mesma data de vencimento. VERIFIED FACT: como a posição inclui tanto uma call (que ganha valor quando a ação sobe) quanto uma put (que ganha valor quando a ação cai), um straddle pode se tornar lucrativo se a ação fizer um grande movimento em qualquer direção, o que o distingue fundamentalmente de uma simples aposta direcional, como comprar apenas uma call (Lição 14) ou apenas uma put (Lição 15).

Eis o "porquê" de o straddle ser descrito como uma aposta na volatilidade, e não na direção: um investidor que não sabe para que lado uma ação exposta à moeda vai se mover em meio à incerteza do cenário acima, mas está confiante de que algum movimento significativo virá, para um lado ou para o outro, pode usar um straddle para se posicionar para essa volatilidade esperada sem precisar acertar a direção. O prêmio total pago pela call e pela put representa o custo total dessa posição, e a ação precisa se mover o suficiente em qualquer direção para cobrir esse custo combinado antes que a posição se torne lucrativa.

É por isso que um straddle perde dinheiro se a ação ficar relativamente parada, mesmo que o investidor estivesse "certo" sobre a existência da incerteza: tanto a call quanto a put perdem valor com o passar do tempo (um conceito chamado decaimento temporal, abordado com mais profundidade nas lições mais avançadas sobre opções) se o grande movimento esperado não acontecer antes do vencimento. É por isso que um straddle deve ser entendido como uma aposta pura na volatilidade: o investidor aposta que a amplitude do movimento vai superar o que o mercado de opções já incorporou aos preços, e não em alguma direção específica.

## Exemplo prático
ILLUSTRATIVE EXAMPLE: Uma ação é negociada a US$ 100. Um investidor compra uma call e uma put com preço de exercício de US$ 100, pagando um prêmio combinado de US$ 8 por ação (US$ 800 no total para contratos padrão). Se a ação chegar a US$ 130 no vencimento, a call vale US$ 30 (muito acima do custo combinado de US$ 8), gerando um bom lucro, mesmo com a put vencendo sem valor. Se, em vez disso, a ação cair para US$ 70, a put vale US$ 30, gerando um lucro semelhante, mesmo com a call vencendo sem valor. Mas, se a ação simplesmente estiver em US$ 102 no vencimento, as duas opções valem muito pouco, e o investidor perde a maior parte ou todo o prêmio combinado de US$ 800. Isso ilustra que a estratégia precisava de um grande movimento, em qualquer direção, para dar certo.

## Teste de prática
**P1. O que um straddle comprado combina?**
A) Duas calls com preços de exercício diferentes
B) Uma call e uma put da mesma ação, com o mesmo preço de exercício e o mesmo vencimento
C) A venda de uma call e a compra de uma ação
D) Apenas uma put, sem nenhuma call

**P2. Por que um straddle é descrito como uma aposta na volatilidade, e não na direção?**
A) Ele só lucra se a ação subir, assim como uma call sozinha
B) Ele pode se tornar lucrativo com um grande movimento de preço em qualquer direção, já que combina uma call e uma put
C) Ele só lucra se a ação ficar perfeitamente parada
D) Os straddles não têm nenhuma relação com o movimento de preço

**P3. Em que condição um straddle comprado normalmente perde dinheiro?**
A) Quando a ação faz um movimento muito grande em qualquer direção
B) Quando a ação fica relativamente parada, já que nem a call nem a put ganham valor suficiente para cobrir o prêmio combinado pago
C) Os straddles sempre dão lucro, independentemente do movimento da ação
D) Quando o investidor prevê corretamente a direção da ação

**P4. No exemplo, por que o investidor lucrou quando a ação subiu para US$ 130, mesmo com a put vencendo sem valor?**
A) O ganho de US$ 30 da call superou em muito o prêmio combinado de US$ 8 pago pelas duas opções
B) A put também aumentou de valor ao mesmo tempo
C) O investidor recebeu de volta o prêmio da put que não valia nada
D) O lucro não tinha nenhuma relação com o valor da call

**P5. Por que o straddle do exemplo perdeu dinheiro quando a ação ficou em US$ 102?**
A) Um movimento de US$ 2 era mais do que suficiente para lucrar com qualquer uma das opções
B) Nem a call nem a put ganharam valor suficiente com um movimento tão pequeno para cobrir o prêmio combinado de US$ 800 pago
C) A estratégia do straddle sempre perde dinheiro, independentemente do movimento da ação
D) O investidor era obrigado a exercer as duas opções ao mesmo tempo

## Chave de Respostas
P1: B
P2: B
P3: B
P4: A
P5: B

## Respostas e explicações
**P1.** Um straddle combina especificamente uma call e uma put com o mesmo preço de exercício e o mesmo vencimento para se posicionar para um grande movimento em qualquer direção.

**P2.** Como tanto a parte da call quanto a da put permitem que a posição lucre com um grande movimento independentemente da direção, o straddle mira a amplitude do movimento, e não a direção.

**P3.** Um movimento de preço insuficiente significa que nenhuma das pontas do straddle ganha valor suficiente para compensar o prêmio total pago pelas duas opções.

**P4.** O ganho expressivo apenas da call foi suficiente para compensar com folga o custo total das duas opções, mesmo com a put vencendo sem valor.

**P5.** O pequeno movimento de preço ficou abaixo do necessário para que qualquer uma das opções gerasse um ganho suficiente para compensar o custo total dos prêmios.

## Pontos-chave
- Um straddle comprado combina uma call e uma put com o mesmo preço de exercício e o mesmo vencimento, da mesma ação subjacente.
- Essa estrutura pode lucrar com um grande movimento de preço em qualquer direção, o que a torna uma aposta na volatilidade, e não na direção.
- Um straddle perde dinheiro se a ação ficar relativamente parada, já que nenhuma das opções ganha valor suficiente para cobrir o prêmio combinado.
- Um straddle dá certo quando o movimento real do preço supera o que o mercado havia previsto nos preços combinados das opções, independentemente da direção.
