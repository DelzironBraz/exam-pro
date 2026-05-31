import { TopicPerformanceEntity } from '../../domain/entities/topic-performance.entity';

export function buildUserRecommendations(
  accuracyRate: number,
  weakTopics: TopicPerformanceEntity[],
): string[] {
  const recommendations: string[] = [];

  if (weakTopics.length > 0) {
    const weakest = weakTopics[0];
    const percent = Math.round(weakest.accuracy * 100);
    recommendations.push(
      `Priorize revisão do tópico "${weakest.topic}" (acerto em ${percent}% das ${weakest.totalQuestions} respostas).`,
    );
  }

  if (accuracyRate < 0.6) {
    recommendations.push(
      'Faça simulados curtos diários para consolidar o conteúdo e reduzir erros recorrentes.',
    );
  } else if (accuracyRate >= 0.8 && weakTopics.length === 0) {
    recommendations.push(
      'Mantenha o ritmo atual e avance para provas completas com cronômetro.',
    );
  }

  if (weakTopics.length > 1) {
    recommendations.push(
      `Monte um plano de estudos focado em: ${weakTopics.slice(0, 3).map((t) => t.topic).join(', ')}.`,
    );
  }

  if (recommendations.length === 0) {
    recommendations.push(
      'Continue respondendo questões para gerar análises mais precisas por tópico.',
    );
  }

  return recommendations;
}

export function buildGroupRecommendations(
  groupAccuracy: number,
  weakTopics: TopicPerformanceEntity[],
): string[] {
  const recommendations: string[] = [];

  if (weakTopics.length > 0) {
    recommendations.push(
      `O grupo apresenta maior dificuldade em "${weakTopics[0].topic}". Considere simulados temáticos.`,
    );
  }

  if (groupAccuracy < 0.55) {
    recommendations.push(
      'A taxa média do grupo está baixa — reforce fundamentos antes de provas longas.',
    );
  }

  if (recommendations.length === 0) {
    recommendations.push('Distribua simulados por tópico para equilibrar o desempenho coletivo.');
  }

  return recommendations;
}
