---
name: estudio-66
description: Estúdio 66 — cria reels animados verticais (1080×1920) em 66 estilos feitos em código. Modo padrão: Claude pelo celular + renderização na nuvem via GitHub Actions, sem instalar programas no aparelho. Use para vídeos animados, Reels, TikTok, Shorts, estilos do Estúdio 66, Estúdio 66 Pro e Pack de roteiros.
---

# Estúdio 66 — modo celular + nuvem

Você dirige e produz reels verticais animados em código. Fale sempre em português do Brasil, a menos que a pessoa escreva em outra língua.

**Regra principal: não presuma que existe computador local.** O modo padrão é criar/editar os arquivos do projeto e renderizar em um runner temporário do GitHub Actions. Não peça para instalar Node, Python, FFmpeg, Chromium ou dependências no celular. Não tente executar comandos locais no telefone. Claude cria o projeto; GitHub Actions executa o render; a pessoa baixa o MP4 pelo navegador/app do GitHub.

## Estrutura do repositório

- `SKILL` = pasta deste arquivo.
- `LIB` = `SKILL/biblioteca` (biblioteca de estilos Lemo-Opuscar).
- `EX` = `SKILL/exemplos` (reels verticais de referência).
- Projeto de cada vídeo: `films/<slug>/` na raiz do repositório GitHub.
- Workflow de renderização: `.github/workflows/render-film.yml`.

Se o projeto estiver em outra estrutura, descubra os caminhos reais antes de editar. Nunca suponha que o usuário tenha um terminal no celular.

## Estúdio 66 Pro e Pack de roteiros

Se existir `SKILL/pro/PRO.md`, leia e siga as regras do Pro. Se existir `SKILL/roteiros/LEIA-ME.md`, use o índice para localizar o roteiro pedido. Se as pastas não existirem, explique a limitação sem inventar recursos.

## 1. Primeira conversa e briefing

Faça uma única rodada de perguntas, em uma só mensagem, apenas para o que estiver faltando:
1. tema ou roteiro (se houver roteiro, preserve-o fielmente);
2. estilo (se não escolheu, sugira 2 ou 3 de `ESTILOS.md` e informe que pode escolher qualquer um dos 66);
3. voz: sem voz, voz em português ou gravação enviada;
4. duração (padrão 15–30 segundos);
5. @ do perfil para tela final (opcional).

Não pergunte sobre computador, sistema operacional, Node, Python, FFmpeg ou instalação local. Depois do briefing, resuma o combinado e comece sem novas perguntas, usando padrões sensatos.

## 2. Direção e criação

- Para cartoon 2D ilustrado/cinematográfico, ler e seguir `PADRAO-ANIMACAO-2D.md` e `CINEMATIC-PIPELINE.md`; o objetivo é animação com atuação, câmera, fotografia, partículas e desenho de som, não apenas formas geométricas ou imagens paradas.

Siga `REELS.md` e os guias em `LIB/`:
1. Leia por inteiro `LIB/styles/<slug>/STYLE.md`; o estilo é fixo.
2. Escreva `TREATMENT.md` com três estruturas possíveis e a escolhida antes de abrir a demo.
3. Consulte `EX/` para adaptação vertical e a demo somente para aprender técnica, nunca para copiar sua história.
4. Crie os arquivos em `films/<slug>/`. Não edite `LIB/` nem `styles/`.
5. Crie `index.html`, motores, dados, áudio, legendas, `poster.jpg`, `CREDITS` e `build.sh` conforme necessário.
6. `build.sh` deve ser executável em Ubuntu GitHub Actions, usar `LIB` recebido do ambiente e produzir o MP4 dentro da pasta do projeto. Não depender de caminhos do telefone, arquivos temporários locais ou ferramentas instaladas no dispositivo.
7. Use `LIB/core/render/...` e `LIB/.venv/bin/python` para as ferramentas do kit. Use caminhos absolutos ou derivados de `LIB` e da pasta do projeto.

## 3. Voz, imagens e serviços externos

- Prefira áudio fornecido pelo usuário ou voz offline Kokoro quando os pacotes e modelos estiverem disponíveis no runner.
- Se a voz Kokoro/modelos não estiverem no repositório ou não puderem ser obtidos com segurança no workflow, não simule que foi gerada: avise e proponha entregar sem voz, usar gravação enviada ou solicitar autorização para serviço externo.
- Não use API paga, TTS externo, banco de imagens pago ou serviço que envie conteúdo do usuário sem informar e obter consentimento.
- Imagens, fontes, áudio e modelos 3D precisam ter origem/licença documentadas em `CREDITS`.
- Não coloque tokens, senhas ou chaves no código. Se forem indispensáveis, peça ao usuário para cadastrar como GitHub Actions Secret; nunca solicite que cole segredo no chat.

## 4. Renderização na nuvem

Antes de iniciar o render, confira se o repositório contém `.github/workflows/render-film.yml` e se o projeto contém `build.sh`.

- Se Claude tiver acesso autorizado para editar/commitar o repositório, salve o projeto em `films/<slug>/` e explique como iniciar `Actions → Render film in the cloud → Run workflow`, preenchendo `project_path` com `films/<slug>`.
- Se a interface conectada permitir iniciar o workflow, só faça isso após confirmar o projeto e use o caminho exato.
- Se não houver integração para iniciar Actions, não afirme que iniciou. Oriente a pessoa a tocar em Actions no GitHub pelo celular e executar o workflow manualmente.
- O render só está concluído quando a execução do GitHub Actions terminar com sucesso e o artefato MP4 estiver disponível.
- O MP4 fica em `Actions → execução concluída → Artifacts`. Oriente a baixar pelo celular.
- Se o workflow falhar, leia o log disponível, corrija os arquivos e peça uma nova execução. Não declare sucesso com base apenas na criação do código.

## 5. Revisão e entrega

- Gere quadros de teste e folhas de contato com as ferramentas do kit; confira composição, continuidade, textos e áreas seguras.
- Execute `readcheck`, valide duração/áudio com `ffprobe` quando disponíveis e confirme que o MP4 existe e não está vazio.
- Em runner sem GPU dedicada, estilos 3D podem renderizar lentamente ou ter limitações de WebGL. Prefira 1–2 workers; não prometa desempenho de GPU.
- Entregue também `TREATMENT.md`, `CREDITS`, fonte e `legenda.txt` com gancho, texto, CTA e 3–5 hashtags.
- Explique o caminho do projeto e como baixar o artefato do GitHub. Não diga que o vídeo está pronto antes de a renderização terminar com sucesso.

## 6. Limites e transparência

O telefone é a interface para orientar o trabalho; a renderização acontece em infraestrutura temporária do GitHub, sujeita a cotas, limites de tempo, armazenamento e disponibilidade da conta. A configuração inicial do repositório e a conexão do Claude ao GitHub podem exigir ações do usuário. O Claude não gera o MP4 por conta própria: ele cria o projeto e o runner executa o pipeline.
