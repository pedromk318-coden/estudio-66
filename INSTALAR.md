# Começar a usar o Estúdio 66 pelo celular

**Você não precisa instalar Node.js, Python, FFmpeg ou programas no celular.** O Estúdio 66 prepara os arquivos e o GitHub Actions renderiza o MP4 em um computador temporário na nuvem.

## O que é necessário

- Conta no GitHub com acesso a GitHub Actions.
- Claude com acesso ao repositório (por uma integração disponível na sua conta/ambiente Claude Code) ou possibilidade de enviar os arquivos ao GitHub pelo navegador/app.
- O pacote do Estúdio 66 enviado a um repositório GitHub. Para projetos pessoais, prefira repositório privado.

A integração Claude–GitHub e a disponibilidade do Claude Code no celular variam conforme plano, região e produto. Se a sua interface não permitir editar o repositório, use o app/site do GitHub para enviar os arquivos; não é necessário usar computador.

## 1. Criar o repositório

1. No app ou site do GitHub, crie um repositório chamado `estudio-66` (privado é recomendado).
2. Envie para a raiz do repositório o conteúdo da pasta `estudio-66` deste ZIP. A raiz deve conter `SKILL.md`, `biblioteca/`, `scripts/`, `REELS.md` e `.github/workflows/render-film.yml`.
3. Confirme que o arquivo `.github/workflows/render-film.yml` aparece no repositório.
4. Em **Settings → Actions → General**, confirme que GitHub Actions está permitido.

## 2. Conectar Claude ao repositório

Se o Claude oferecer integração/conexão GitHub, conecte somente o repositório `estudio-66` e conceda as permissões necessárias para ler e editar arquivos. Se essa opção não aparecer, não presuma que Claude tem acesso: peça que ele prepare os arquivos e envie-os ao repositório pelo GitHub no celular.

## 3. Criar um vídeo

No Claude, peça por exemplo:

> Crie um reel de 30 segundos sobre uma curiosidade histórica, estilo anime anos 80. Salve o projeto em `films/curiosidade-historica/`, prepare `build.sh` para o GitHub Actions e não tente executar renderização local.

Claude deve criar o roteiro, os arquivos de animação e áudio, `TREATMENT.md`, `CREDITS`, `legenda.txt` e `build.sh`. Confirme que tudo foi enviado/commitado ao repositório antes de renderizar.

## 4. Renderizar pelo celular

1. Abra o repositório no GitHub.
2. Toque em **Actions**.
3. Escolha **Render film in the cloud**.
4. Toque em **Run workflow**.
5. Em `project_path`, informe o caminho exato, por exemplo `films/curiosidade-historica`.
6. Toque em **Run workflow** novamente.
7. Aguarde a execução ficar verde (sucesso). Se ficar vermelha, abra os logs e envie o erro ao Claude para correção.

## 5. Baixar o MP4

Abra a execução concluída em **Actions**, role até **Artifacts** e toque no arquivo `estudio-66-...` para baixar o ZIP com o vídeo e os arquivos de apoio.

## Limites importantes

- GitHub Actions tem cotas de minutos, armazenamento e duração que variam por plano e podem mudar. Confira o uso da sua conta.
- O runner padrão não garante GPU dedicada. Animações 3D pesadas podem renderizar lentamente; use 1–2 workers ou prefira estilos 2D quando necessário.
- A voz offline Kokoro requer dependências e modelos adicionais. Se não estiverem configurados, o Claude deve avisar e não fingir que gerou a voz.
- A renderização só está pronta depois que o workflow terminar com sucesso e o MP4 aparecer em Artifacts.
- Nunca coloque tokens, senhas ou chaves de API nos arquivos do projeto. Use GitHub Actions Secrets somente quando necessário e com sua autorização.

## Se quiser usar computador depois

O modo local original pode continuar sendo configurado seguindo as instruções de `biblioteca/TECHNIQUE.md`. Isso é opcional; o fluxo recomendado é celular + nuvem.
