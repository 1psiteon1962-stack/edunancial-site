---
id: WHITE-L3-041
track: WHITE
officialTrackName: "Paper Assets"
level: 3
lessonNumber: 41
title: "\"Por que uma ordem stop-loss não garante o seu preço de saída\""
summary: "\"Entenda como funciona uma ordem stop-loss e por que ela é um gatilho para uma ordem a mercado, e não uma garantia do preço exato que você vai receber.\""
version: "1.0"
author: "\"Waldemar M. Caban, JD MA\""
date: "2026-10-19"
locale: "pt-BR"
source_locale: "en-US"
---
<!-- Learning Objectives -->
# WHITE-L3-041: Por que uma ordem stop-loss não garante o seu preço de saída

## Objetivos de aprendizagem
<!-- Core Content -->
Ao final desta lição, você será capaz de:
- Explicar como funciona uma ordem stop-loss
- Explicar por que ela não garante a execução no preço de stop definido
- Explicar o que uma ordem stop-limit muda nessa troca

## Conteúdo principal

Uma **ordem stop-loss** é uma instrução para vender um ativo automaticamente se o preço dele cair até um nível definido. Ela foi criada para ajudar a limitar as perdas em uma posição sem que o investidor precise acompanhar o preço o tempo todo.

Veja o "porquê" de ela não garantir um preço de saída exato: quando o preço de stop é atingido, uma ordem stop-loss comum normalmente se transforma em uma **ordem a mercado**, ou seja, uma ordem para vender imediatamente pelo melhor preço disponível no momento, e não especificamente pelo próprio preço de stop. Se o preço estiver se movendo rápido, ou se o ativo abrir com um gap de baixa forte (pulando o preço de stop sem nenhuma negociação no meio, algo que pode acontecer em torno de notícias importantes), a ordem pode ser executada a um preço bem pior do que o preço de stop que a disparou.

[VERIFIED FACT] Uma **ordem stop-limit** é uma variação que define tanto um preço de stop (que dispara a ordem) quanto um preço limite (o pior preço que o investidor está disposto a aceitar). Isso protege contra um preço de execução inesperadamente ruim, mas introduz um risco diferente: se o preço passar do preço limite rápido demais, a ordem pode nem ser executada, deixando a posição sem vender justamente durante a queda contra a qual o investidor tentava se proteger.

## Exemplo prático

[ILLUSTRATIVE EXAMPLE] Uma investidora coloca uma ordem stop-loss em $45 para uma ação que está sendo negociada a $50, com a intenção de limitar sua perda se o preço cair. [ASSUMPTION] Se uma notícia negativa fizer a ação abrir com um gap de baixa durante a noite, começando o dia seguinte a $38 sem nenhuma negociação entre $45 e $38, a ordem stop-loss dela seria disparada e executada perto do novo preço de abertura, mais baixo, e não no preço de stop de $45 que ela pretendia. O resultado seria uma perda maior do que ela talvez esperasse que o stop-loss evitaria.

## Teste de prática

1. O que uma ordem stop-loss faz?
2. Por que uma ordem stop-loss comum não garante a execução exatamente no preço de stop definido?
3. Que troca uma ordem stop-limit introduz em comparação com uma ordem stop-loss comum?

## Gabarito

1. Ela dispara automaticamente uma venda se o preço de um ativo cair até um nível definido, ajudando a limitar as perdas sem exigir que você acompanhe o preço o tempo todo.
2. Porque, depois de disparada, ela normalmente se transforma em uma ordem a mercado, executada pelo melhor preço disponível no momento, que pode ser bem pior do que o preço de stop em condições de movimento rápido ou em um gap de preço.
3. Ela define um limite para o pior preço de execução aceitável, protegendo contra uma execução ruim, mas corre o risco de a ordem nem ser executada se o preço passar desse limite rápido demais.

## Respostas e explicações

1. Esta é a definição fundamental da lição.
2. Este é o mecanismo central que explica o alerta de "sem garantia" do título da lição.
3. Isto apresenta o tipo de ordem alternativo e a troca específica que ele envolve.

## Pontos-chave
- Uma ordem stop-loss dispara automaticamente uma venda quando um preço definido é atingido, mas normalmente é executada como ordem a mercado, pelo melhor preço disponível, e não necessariamente pelo próprio preço de stop.
- Um gap de preço forte pode resultar em um preço de execução bem pior do que o preço de stop.
- Uma ordem stop-limit define o pior preço aceitável, protegendo contra uma execução ruim, mas corre o risco de nem ser executada se o preço se mover rápido demais.

---

*Esta lição tem fins exclusivamente de educação financeira geral e não constitui aconselhamento financeiro, de investimentos, tributário ou jurídico personalizado. Consulte um profissional financeiro licenciado antes de tomar decisões de investimento.*
