export const loadingMessages = [
  'Deixa eu pensar um pouquinho...',
  'Tô processando sua pergunta...',
  'Só um instantinho...',
  'Deixa eu verificar isso pra você...',
  'Aguarda aí que já te respondo...',
  'Consultando as informações...',
  'Tô procurando a melhor resposta...',
  'Calma que já tô te ajudando...',
];

export function getRandomLoadingMessage(): string {
  return loadingMessages[Math.floor(Math.random() * loadingMessages.length)];
}
