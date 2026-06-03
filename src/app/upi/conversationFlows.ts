/**
 * Quebra-gelos: 4 perguntas raiz + 2–4 continuações por tema (e opcional 2º nível).
 * Textos alinhados às intenções do backend (intent.py).
 */

export type FlowId = "scheduling" | "location" | "services" | "tea";

export interface FlowNode {
  id: string;
  text: string;
  /** Perguntas de aprofundamento após o aluno tocar nesta sugestão */
  children?: FlowNode[];
}

export interface ConversationFlow {
  id: FlowId;
  rootQuestion: string;
  followUps: FlowNode[];
}

export const CONVERSATION_FLOWS: ConversationFlow[] = [
  {
    id: "scheduling",
    rootQuestion: "Como agendar um atendimento?",
    followUps: [
      {
        id: "scheduling:email",
        text: "O que devo escrever no e-mail para o NAPSI?",
        children: [
          {
            id: "scheduling:email:retorno",
            text: "Em quanto tempo o NAPSI costuma responder?",
          },
        ],
      },
      {
        id: "scheduling:presencial",
        text: "Posso agendar indo presencialmente ao NAPSI?",
      },
      {
        id: "scheduling:formulario",
        text: "Onde fica o formulário de solicitação no site da POLI?",
      },
      {
        id: "scheduling:quem",
        text: "Qualquer aluno da POLI pode solicitar atendimento?",
      },
      {
        id: "scheduling:escolaridade",
        text: "O NAPSI ajuda com segunda chamada e abono de faltas?",
      },
    ],
  },
  {
    id: "location",
    rootQuestion: "Onde fica o NAPSI?",
    followUps: [
      {
        id: "location:horario",
        text: "Qual o horário de funcionamento do NAPSI?",
      },
      {
        id: "location:bloco",
        text: "Como encontro o Bloco A, Sala 12?",
      },
      {
        id: "location:acessibilidade",
        text: "O acesso ao NAPSI tem apoio de acessibilidade?",
      },
      {
        id: "location:sem-agendar",
        text: "Posso ir ao NAPSI sem agendar antes?",
        children: [
          {
            id: "location:sem-agendar:como",
            text: "O que acontece se eu chegar sem agendamento?",
          },
        ],
      },
    ],
  },
  {
    id: "services",
    rootQuestion: "Quais serviços o NAPSI oferece?",
    followUps: [
      {
        id: "services:psicoped",
        text: "O que é o apoio psicopedagógico do NAPSI?",
      },
      {
        id: "services:psicologico",
        text: "O NAPSI oferece acolhimento psicológico?",
      },
      {
        id: "services:adaptacao",
        text: "Ajuda em adaptação de provas e atividades?",
        children: [
          {
            id: "services:adaptacao:tempo",
            text: "Como solicitar tempo adicional ou ambiente separado na prova?",
          },
        ],
      },
      {
        id: "services:provas",
        text: "Estou ansioso na semana de provas, o NAPSI pode ajudar?",
      },
      {
        id: "services:publico",
        text: "Quem pode usar os serviços do NAPSI?",
        children: [
          {
            id: "services:publico:tea",
            text: "Alunos com TEA também são atendidos?",
          },
        ],
      },
    ],
  },
  {
    id: "tea",
    rootQuestion: "O NAPSI apoia alunos com TEA?",
    followUps: [
      {
        id: "tea:plano",
        text: "Como funciona o plano de apoio individualizado?",
      },
      {
        id: "tea:documentacao",
        text: "Preciso de laudo ou documentação para TEA?",
      },
      {
        id: "tea:sala",
        text: "O NAPSI ajuda com adaptações em sala de aula?",
      },
      {
        id: "tea:ambiente",
        text: "Posso pedir ambiente com menos ruído por causa do TEA?",
      },
      {
        id: "tea:tdah",
        text: "Também atendem alunos com TDAH ou dislexia?",
        children: [
          {
            id: "tea:tdah:como",
            text: "O apoio para TDAH é parecido com o do TEA?",
          },
        ],
      },
    ],
  },
];

/** Perguntas raiz exibidas no início (quebra-gelos principais). */
export const ROOT_QUICK_QUESTIONS = CONVERSATION_FLOWS.map((f) => f.rootQuestion);

const _flowByRoot = new Map(
  CONVERSATION_FLOWS.map((f) => [normalize(f.rootQuestion), f]),
);

const _nodeByText = new Map<string, { flow: ConversationFlow; node: FlowNode }>();

function normalize(text: string): string {
  return text.trim().toLowerCase().replace(/\s+/g, " ");
}

function registerNodes(flow: ConversationFlow, nodes: FlowNode[]) {
  for (const node of nodes) {
    _nodeByText.set(normalize(node.text), { flow, node });
    if (node.children?.length) {
      registerNodes(flow, node.children);
    }
  }
}

for (const flow of CONVERSATION_FLOWS) {
  registerNodes(flow, flow.followUps);
}

export interface FlowResolution {
  flowId: FlowId;
  nodeId: string;
}

/** Identifica fluxo a partir do texto enviado (raiz ou sugestão conhecida). */
export function resolveFlowFromText(text: string): FlowResolution | null {
  const key = normalize(text);
  const flow = _flowByRoot.get(key);
  if (flow) {
    return { flowId: flow.id, nodeId: `${flow.id}:root` };
  }
  const hit = _nodeByText.get(key);
  if (hit) {
    return { flowId: hit.flow.id, nodeId: hit.node.id };
  }
  return null;
}

function findNode(flow: ConversationFlow, nodeId: string): FlowNode | null {
  const walk = (nodes: FlowNode[]): FlowNode | null => {
    for (const n of nodes) {
      if (n.id === nodeId) return n;
      if (n.children) {
        const c = walk(n.children);
        if (c) return c;
      }
    }
    return null;
  };
  if (nodeId === `${flow.id}:root`) return null;
  return walk(flow.followUps);
}

export interface SuggestionState {
  flowId: FlowId;
  lastNodeId: string;
  askedTexts: Set<string>;
}

/**
 * Próximas sugestões clicáveis: filhos do último nó, senão irmãos no 1º nível ainda não usados.
 */
export function getNextSuggestions(state: SuggestionState): string[] {
  const flow = CONVERSATION_FLOWS.find((f) => f.id === state.flowId);
  if (!flow) return [];

  const asked = state.askedTexts;
  const lastNode = findNode(flow, state.lastNodeId);

  if (lastNode?.children?.length) {
    const children = lastNode.children
      .map((c) => c.text)
      .filter((t) => !asked.has(normalize(t)));
    if (children.length) return children.slice(0, 4);
  }

  const topLevel = flow.followUps
    .map((n) => n.text)
    .filter((t) => !asked.has(normalize(t)));
  return topLevel.slice(0, 4);
}

export function getFlowLabel(flowId: FlowId): string {
  const labels: Record<FlowId, string> = {
    scheduling: "Agendamento",
    location: "Local e horários",
    services: "Serviços do NAPSI",
    tea: "TEA e inclusão",
  };
  return labels[flowId];
}
