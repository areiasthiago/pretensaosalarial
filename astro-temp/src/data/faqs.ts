// src/data/faqs.ts
// Fonte única de verdade para os FAQs do site.
// Consumido tanto pelos componentes FaqSection quanto pelo SchemaOrg (dados estruturados).

export interface FaqItem {
  pergunta: string
  resposta: string
}

export const faqHome: FaqItem[] = [
  {
    pergunta: 'Meus dados são realmente anônimos?',
    resposta: 'Sim. Seu email é convertido em um hash criptográfico e vinculado ao seu cadastro apenas para permitir atualizações futuras. Não é possível recuperar o email original a partir do hash.'
  },
  {
    pergunta: 'Por que vocês pedem meu email?',
    resposta: 'Para permitir que você atualize seus dados no futuro. Armazenamos apenas um hash criptográfico — o email original nunca é salvo.'
  },
  {
    pergunta: 'Com que frequência posso atualizar meu salário?',
    resposta: 'Num intervalo mínimo de 24 horas. Basta preencher o formulário novamente com o mesmo email. O cadastro anterior será substituído automaticamente.'
  },
  {
    pergunta: 'Os dados são confiáveis?',
    resposta: 'Aplicamos filtros anti-spam, removemos entradas antigas e exibimos resultados apenas quando há um número mínimo de respostas.'
  },
  {
    pergunta: 'Por que devo informar dados de diversidade?',
    resposta: 'Para identificar desigualdades salariais entre gêneros, raças e outros grupos. Esses dados são completamente opcionais.'
  },
  {
    pergunta: 'O site é gratuito? Como vocês se sustentam?',
    resposta: 'Sim, completamente gratuito. O site é mantido por anúncios não intrusivos. Não vendemos seus dados — nunca.'
  }
]

export const faqSobre: FaqItem[] = [
  {
    pergunta: 'Quem mantém o Pretensão Salarial?',
    resposta: 'É um projeto independente, mantido de forma voluntária. Não temos vínculo com empresas de recrutamento, consultorias de RH ou qualquer organização com interesse comercial nos dados.'
  },
  {
    pergunta: 'Como o projeto se sustenta financeiramente?',
    resposta: 'Atualmente por meio de publicidade não intrusiva (banners reservados no layout). Nunca vendemos dados e nunca aceitamos patrocínio de empresas com conflito de interesse com os dados.'
  },
  {
    pergunta: 'Os dados são verificados?',
    resposta: 'Não verificamos vínculos empregatícios — isso seria incompatível com o anonimato. Usamos proteções técnicas para dificultar inserções em massa e monitoramos a base para identificar padrões atípicos.'
  },
  {
    pergunta: 'Posso sugerir melhorias ou reportar problemas?',
    resposta: 'Sim! Você pode enviar uma mensagem em nossa página de contato.'
  },
  {
    pergunta: 'A consulta sempre será gratuita?',
    resposta: 'Atualmente a consulta é totalmente gratuita e não exige cadastro. Esse é nosso modelo hoje e pretendemos mantê-lo assim pelo maior tempo possível.'
  }
]

export const faqConsulta: FaqItem[] = [
  {
    pergunta: 'Por que não consigo visualizar resultados mesmo sem aplicar filtros?',
    resposta: 'Nossa base de dados ainda está em crescimento. Para proteger a privacidade dos usuários, só exibimos resultados quando há um número mínimo de cadastros. Quanto mais pessoas contribuem, mais completa fica a pesquisa.'
  },
  {
    pergunta: 'Por que meus filtros não retornaram resultados?',
    resposta: 'Pode ser que ainda não tenhamos dados suficientes para essa combinação específica de filtros. Tente ampliar os filtros removendo alguns critérios, ou cadastre seu salário para enriquecer a base.'
  },
  {
    pergunta: 'Por que vocês usam mediana e não média?',
    resposta: 'A média é facilmente distorcida por valores extremos — um salário muito alto ou muito baixo puxa toda a conta para cima ou para baixo. A mediana representa o valor central real: metade dos profissionais ganha acima, metade ganha abaixo. Para entender o mercado, ela é muito mais honesta.'
  },
  {
    pergunta: 'Os dados são atualizados com que frequência?',
    resposta: 'Os dados são atualizados em tempo real conforme novos cadastros são feitos. Removemos automaticamente entradas com mais de 36 meses para garantir que as informações sejam sempre relevantes para o mercado atual.'
  },
  {
    pergunta: 'Por que não encontrei meu cargo?',
    resposta: 'Se seu cargo não aparece no autocomplete, é porque ainda não temos cadastros para ele. Seja o primeiro a contribuir — seu cadastro é anônimo e ajuda outros profissionais da sua área.'
  },
  {
    pergunta: 'Os salários incluem benefícios?',
    resposta: 'Não. Os valores exibidos referem-se ao salário bruto mensal. Informações sobre benefícios são exibidas separadamente como percentual de quem os recebe.'
  },
  {
    pergunta: 'Como posso contribuir para melhorar os dados?',
    resposta: 'Cadastre seu salário! Leva menos de 3 minutos, é completamente anônimo e seu email é armazenado apenas como hash criptográfico. Quanto mais pessoas contribuem, mais precisos ficam os resultados para todos.'
  }
]