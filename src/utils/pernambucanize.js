/**
 * Transforma texto para aproximar a pronúncia do sotaque pernambucano/nordestino.
 * Aplicado APENAS no texto enviado ao TTS — o chat exibe o texto original.
 */

const NW  = '(?<![a-zA-ZÀ-ÿ0-9])'
const NWA = '(?![a-zA-ZÀ-ÿ0-9])'
const wb  = (w, f = 'g') => new RegExp(`${NW}${w}${NWA}`, f)

function repCase(orig, rep) {
  return /^[A-ZÁÉÍÓÚÂÊÔÃÕÀÇ]/.test(orig)
    ? rep[0].toUpperCase() + rep.slice(1)
    : rep
}

// ── Léxico regional ────────────────────────────────────────────────────────
const VOCAB = [
  ['você',     'ucê'],       // ocê com u inicial bem marcado
  ['vocês',    'ucês'],
  ['também',   'taimbém'],   // diphthong nordestino
  ['porque',   'poque'],
  ['muito',    'muinto'],
  ['muita',    'muinta'],
  ['muitos',   'muintos'],
  ['muitas',   'muintas'],
  ['está',     'tá'],
  ['estão',    'tão'],
  ['estou',    'tô'],
  ['estamos',  'tamo'],
  ['então',    'intão'],
  ['agora',    'agora'],
  ['senhor',   'sinhô'],
  ['senhora',  'sinhora'],
  ['não',      'num'],
  ['nada',     'nada'],
  ['para que', 'pra quê'],
  ['por favor', 'pô favô'],
  ['de acordo', 'di acordu'],
  ['com certeza', 'com certeza'],
]

// ── Infinitivos com queda do R ─────────────────────────────────────────────
const INFINITIVOS = [
  ['falar',     'falá'],    ['agendar',   'agendá'],   ['ajudar',    'ajudá'],
  ['solicitar', 'solicitá'],['enviar',    'enviá'],    ['buscar',    'buscá'],
  ['encontrar', 'encontrá'],['apoiar',    'apoiá'],    ['informar',  'informá'],
  ['orientar',  'orientá'], ['participar','participá'],['acessar',   'acessá'],
  ['registrar', 'registrá'],['verificar', 'verificá'], ['precisar',  'precisá'],
  ['ligar',     'ligá'],    ['entrar',    'entrá'],    ['passar',    'passá'],
  ['procurar',  'procurá'], ['conversar', 'conversá'], ['marcar',    'marcá'],
  ['contatar',  'contatá'], ['consultar', 'consultá'],
  ['preencher', 'preenchê'],['oferecer',  'oferecê'],  ['atender',   'atendê'],
  ['responder', 'respondê'],['resolver',  'resolvê'],  ['manter',    'mantê'],
  ['poder',     'podê'],    ['fazer',     'fazê'],      ['dever',     'devê'],
  ['ver',       'vê'],      ['querer',    'querê'],     ['trazer',    'trazê'],
  ['saber',     'sabê'],    ['esclarecer','esclarecê'],
  ['conseguir', 'conseguí'],['partir',    'partí'],    ['existir',   'existí'],
  ['abrir',     'abrí'],    ['sentir',    'sentí'],    ['assistir',  'assistí'],
  ['ter',       'tê'],      ['ser',       'sê'],
  ['ir',        'í'],       ['vir',       'ví'],
  ['estar',     'tá'],
]


export function pernambucanize(text) {
  if (!text) return text
  let t = text

  // 1. Léxico regional (case-insensitive, preserva capitalização)
  for (const [word, rep] of VOCAB) {
    t = t.replace(wb(word, 'gi'), m => repCase(m, rep))
  }

  // 2. "para" preposição → "pra"
  t = t.replace(
    new RegExp(`${NW}para${NWA}(?!\\s+(?:de|com)\\b)`, 'gi'),
    m => repCase(m, 'pra')
  )

  // 3. "de" átono → "di" antes de consoante
  t = t.replace(/\bde\s+([bcdfghjklmnpqrstvwxyz])/gi, (_, c) => `di ${c}`)

  // 4. Infinitivos com queda do R
  for (const [inf, pron] of INFINITIVOS) {
    t = t.replace(wb(inf, 'gi'), m => repCase(m, pron))
  }

  // 5. Terminações -ado/-ido → -adu/-idu (particípios passados)
  t = t.replace(/([a-záéíóú])ado\b/gi,  (_, p) => p + 'adu')
  t = t.replace(/([a-záéíóú])ados\b/gi, (_, p) => p + 'adus')
  t = t.replace(/([a-záéíóú])ido\b/gi,  (_, p) => p + 'idu')
  t = t.replace(/([a-záéíóú])idos\b/gi, (_, p) => p + 'idus')

  // 6. -mente → -menti  |  -ente/-ante → -enti/-anti
  t = t.replace(/mente\b/gi,  'menti')
  t = t.replace(/([a-z])ente\b/gi,  (_, p) => p + 'enti')
  t = t.replace(/([a-z])entes\b/gi, (_, p) => p + 'entis')
  t = t.replace(/([a-z])ante\b/gi,  (_, p) => p + 'anti')
  t = t.replace(/([a-z])antes\b/gi, (_, p) => p + 'antis')

  return t
}
