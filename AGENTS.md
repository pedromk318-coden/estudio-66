# Estúdio 66 — instruções para agentes (celular + nuvem)

Este repositório contém uma biblioteca de estilos de filme. Cada estilo tem `biblioteca/styles/<slug>/STYLE.md`. O usuário escolhe um estilo e pede um vídeo sobre seu próprio tema. Seu trabalho é dirigir, construir o projeto e preparar a renderização remota.

**Modo padrão: celular + GitHub Actions.** Nunca presuma computador local. Não peça instalação de Node, Python, FFmpeg ou Chromium no telefone e não tente executar ferramentas localmente no dispositivo. Claude cria/edita os arquivos; GitHub Actions executa `build.sh` em Ubuntu; o usuário baixa o MP4 no GitHub.

| Pedido | Consulte |
|---|---|
| Direção, história, som, ritmo, câmera, mapas, revisão | [`biblioteca/DIRECTOR.md`](biblioteca/DIRECTOR.md) |
| Construção, páginas, voz, música, mixagem e pipeline | [`biblioteca/TECHNIQUE.md`](biblioteca/TECHNIQUE.md) |
| Formato vertical, gancho, área segura e legenda | [`REELS.md`](REELS.md) |
| Estilos disponíveis | [`ESTILOS.md`](ESTILOS.md) |
| Alterar/criar estilo próprio | [`biblioteca/MY-STYLES.md`](biblioteca/MY-STYLES.md) |
| Comandos das ferramentas | [`biblioteca/core/README.md`](biblioteca/core/README.md) |

## Regras de estilo e história

- `STYLE.md` é fixo: preserve aparência, cores, tipografia, movimento, gramática de câmera, som e limitações.
- O tema do usuário determina a história; não force a história da demo.
- Escreva `TREATMENT.md` com três estruturas e a escolhida antes de abrir `DEMO.md` ou código de demo. Exceção: estilos documentais que exigem material real podem coletá-lo antes.
- Use demos somente para aprender técnicas. Não copie sua história, arco, planos, adereços ou cronologia.
- Nunca construa dentro de `biblioteca/styles/`; copie o que precisar para o projeto.

## Fluxo de trabalho

1. **Briefing:** pergunte em uma única mensagem apenas o que falta: tema/roteiro, estilo, voz, duração e @ opcional. Não pergunte por computador, terminal, sistema operacional ou instalação local.
2. **Tratamento:** crie `films/<slug>/TREATMENT.md` antes de abrir a demo.
3. **Look:** crie quadros de estilo e confira contra `STYLE.md`.
4. **Storyboard:** só se o usuário pedir; nesse caso, aguarde aprovação.
5. **Produção:** crie páginas, animação, som, voz, legendas, poster e `build.sh` no projeto.
6. **Preparação remota:** confirme que `.github/workflows/render-film.yml` existe e que `build.sh` usa `LIB` do ambiente e gera MP4 em `films/<slug>/`.
7. **Render:** se puder iniciar GitHub Actions com autorização, use o workflow manual e o caminho exato. Caso contrário, dê instruções para o usuário iniciar pelo app/site do GitHub. Nunca diga que o render começou sem confirmação.
8. **Entrega:** só declare concluído quando Actions terminar com sucesso e o MP4 estiver no artefato. Inclua `legenda.txt`, `TREATMENT.md`, `CREDITS` e fonte no projeto.

## Contrato do `build.sh`

- Localização: `films/<slug>/build.sh`.
- Deve ser executável (`chmod +x` no runner), usar `set -e`, derivar `HERE` da localização do script e exigir `LIB` do ambiente (fallback somente se for seguro e correto).
- O workflow define `LIB` como `<repo>/biblioteca` e executa em Ubuntu com Node 20, Python 3.12, Chromium headless e FFmpeg.
- Use `cd "$LIB"` antes de chamar ferramentas `core/`; passe o caminho absoluto de `HERE`.
- Produza `<slug>.mp4` dentro de `HERE`. Não dependa de diretórios pessoais, aplicativos do telefone, processos em background ou arquivos fora do repositório.
- Use 1–2 workers por padrão; o runner padrão não oferece garantia de GPU dedicada.

## Segurança e transparência

- Nunca grave segredos no código, commits, prompts ou logs. Use GitHub Actions Secrets apenas se o usuário autorizar e configurar.
- Não use APIs pagas nem envie conteúdo a serviços externos sem autorização explícita.
- Não afirme que um MP4 foi gerado até confirmar sucesso no workflow e existência do artefato.
- Projetos em `films/` são do usuário; não inclua créditos ou marca d'água da biblioteca, exceto os créditos de terceiros em `CREDITS`.
