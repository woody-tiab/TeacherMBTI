import { MBTIQuestion, MBTIDimension } from '../types/mbti';

// 교사 수업 스타일 특화 MBTI 질문 데이터
export const questions: MBTIQuestion[] = [
  // E/I 차원 (외향성 vs 내향성) - 6문항
  {
    id: 1,
    text: "수업 중 학생들과의 상호작용 방식은?",
    dimension: MBTIDimension.EI,
    category: "학생 상호작용",
    options: [
      {
        id: "1a",
        text: "활발한 토론과 그룹 활동을 통해 에너지를 얻는다",
        value: 2,
        type: "A"
      },
      {
        id: "1b", 
        text: "조용한 분위기에서 개별 지도에 집중한다",
        value: 2,
        type: "B"
      }
    ]
  },
  {
    id: 2,
    text: "새로운 교육 방법을 도입할 때 어떻게 하시나요?",
    dimension: MBTIDimension.EI,
    category: "교육 혁신",
    options: [
      {
        id: "2a",
        text: "동료 교사들과 적극적으로 의견을 나누며 함께 시도한다",
        value: 2,
        type: "A"
      },
      {
        id: "2b",
        text: "충분히 혼자 연구하고 검토한 후 조용히 적용한다",
        value: 2,
        type: "B"
      }
    ]
  },
  {
    id: 3,
    text: "수업 후 어떤 시간을 선호하시나요?",
    dimension: MBTIDimension.EI,
    category: "업무 환경",
    options: [
      {
        id: "3a",
        text: "동료들과 이야기하며 수업 경험을 공유한다",
        value: 2,
        type: "A"
      },
      {
        id: "3b",
        text: "혼자만의 시간을 갖고 수업을 되돌아본다",
        value: 2,
        type: "B"
      }
    ]
  },
  {
    id: 4,
    text: "학부모 상담이나 회의에서는?",
    dimension: MBTIDimension.EI,
    category: "소통 스타일",
    options: [
      {
        id: "4a",
        text: "적극적으로 발언하고 여러 의견을 제시한다",
        value: 2,
        type: "A"
      },
      {
        id: "4b",
        text: "신중하게 들어보고 필요한 말만 정확히 한다",
        value: 2,
        type: "B"
      }
    ]
  },
  {
    id: 5,
    text: "스트레스를 받을 때 회복하는 방법은?",
    dimension: MBTIDimension.EI,
    category: "스트레스 관리",
    options: [
      {
        id: "5a",
        text: "동료들과 대화하거나 사람들과 시간을 보낸다",
        value: 2,
        type: "A"
      },
      {
        id: "5b",
        text: "혼자만의 조용한 시간을 갖는다",
        value: 2,
        type: "B"
      }
    ]
  },
  {
    id: 6,
    text: "새로운 학급을 맡게 되었을 때?",
    dimension: MBTIDimension.EI,
    category: "적응 스타일",
    options: [
      {
        id: "6a",
        text: "학생들과 빠르게 어울리며 관계를 형성한다",
        value: 2,
        type: "A"
      },
      {
        id: "6b",
        text: "시간을 두고 천천히 학생들을 파악한다",
        value: 2,
        type: "B"
      }
    ]
  },

  // S/N 차원 (감각 vs 직관) - 6문항
  {
    id: 7,
    text: "수업 계획을 세울 때 중점을 두는 부분은?",
    dimension: MBTIDimension.SN,
    category: "수업 설계",
    options: [
      {
        id: "7a",
        text: "구체적인 사실과 단계별 절차에 집중한다",
        value: 2,
        type: "A"
      },
      {
        id: "7b",
        text: "전체적인 개념과 창의적 아이디어에 집중한다",
        value: 2,
        type: "B"
      }
    ]
  },
  {
    id: 8,
    text: "학생들에게 설명할 때?",
    dimension: MBTIDimension.SN,
    category: "설명 방식",
    options: [
      {
        id: "8a",
        text: "구체적인 예시와 실생활 사례를 많이 든다",
        value: 2,
        type: "A"
      },
      {
        id: "8b",
        text: "전체적인 그림과 개념의 연결점을 보여준다",
        value: 2,
        type: "B"
      }
    ]
  },
  {
    id: 9,
    text: "교육과정을 해석할 때?",
    dimension: MBTIDimension.SN,
    category: "교육과정 이해",
    options: [
      {
        id: "9a",
        text: "명시된 내용을 정확히 따르고 실행한다",
        value: 2,
        type: "A"
      },
      {
        id: "9b",
        text: "숨겨진 의미를 찾고 창의적으로 재해석한다",
        value: 2,
        type: "B"
      }
    ]
  },
  {
    id: 10,
    text: "학생들의 미래에 대해 이야기할 때?",
    dimension: MBTIDimension.SN,
    category: "미래 지향",
    options: [
      {
        id: "10a",
        text: "현실적이고 구체적인 진로를 제시한다",
        value: 2,
        type: "A"
      },
      {
        id: "10b",
        text: "다양한 가능성과 꿈을 탐색하도록 격려한다",
        value: 2,
        type: "B"
      }
    ]
  },
  {
    id: 11,
    text: "새로운 교수법을 배울 때?",
    dimension: MBTIDimension.SN,
    category: "학습 방식",
    options: [
      {
        id: "11a",
        text: "단계별 매뉴얼과 구체적 사례를 선호한다",
        value: 2,
        type: "A"
      },
      {
        id: "11b",
        text: "전체적 이론과 새로운 가능성에 관심이 많다",
        value: 2,
        type: "B"
      }
    ]
  },
  {
    id: 12,
    text: "수업 자료를 준비할 때?",
    dimension: MBTIDimension.SN,
    category: "자료 준비",
    options: [
      {
        id: "12a",
        text: "검증된 자료와 정확한 정보를 수집한다",
        value: 2,
        type: "A"
      },
      {
        id: "12b",
        text: "창의적이고 혁신적인 접근법을 시도한다",
        value: 2,
        type: "B"
      }
    ]
  },

  // T/F 차원 (사고 vs 감정) - 6문항
  {
    id: 13,
    text: "학생을 지도할 때 중요하게 생각하는 것은?",
    dimension: MBTIDimension.TF,
    category: "학생 지도",
    options: [
      {
        id: "13a",
        text: "논리적 사고력과 문제해결 능력 향상",
        value: 2,
        type: "A"
      },
      {
        id: "13b",
        text: "학생의 감정과 동기, 자존감 향상",
        value: 2,
        type: "B"
      }
    ]
  },
  {
    id: 14,
    text: "학생들 간 갈등이 발생했을 때?",
    dimension: MBTIDimension.TF,
    category: "갈등 해결",
    options: [
      {
        id: "14a",
        text: "객관적 사실을 파악하고 공정한 규칙을 적용한다",
        value: 2,
        type: "A"
      },
      {
        id: "14b",
        text: "각자의 마음을 이해하고 화합을 이끌어낸다",
        value: 2,
        type: "B"
      }
    ]
  },
  {
    id: 15,
    text: "평가와 피드백을 제공할 때?",
    dimension: MBTIDimension.TF,
    category: "평가 방식",
    options: [
      {
        id: "15a",
        text: "객관적 기준과 논리적 근거를 제시한다",
        value: 2,
        type: "A"
      },
      {
        id: "15b",
        text: "개인적 성장과 노력 과정에 집중한다",
        value: 2,
        type: "B"
      }
    ]
  },
  {
    id: 16,
    text: "수업 운영의 우선순위는?",
    dimension: MBTIDimension.TF,
    category: "수업 운영",
    options: [
      {
        id: "16a",
        text: "효율적인 학습과 성과 달성",
        value: 2,
        type: "A"
      },
      {
        id: "16b",
        text: "학생들의 행복과 정서적 안정",
        value: 2,
        type: "B"
      }
    ]
  },
  {
    id: 17,
    text: "학부모와 상담할 때?",
    dimension: MBTIDimension.TF,
    category: "상담 방식",
    options: [
      {
        id: "17a",
        text: "객관적 데이터와 분석적 내용을 전달한다",
        value: 2,
        type: "A"
      },
      {
        id: "17b",
        text: "학생에 대한 애정과 관심을 먼저 표현한다",
        value: 2,
        type: "B"
      }
    ]
  },
  {
    id: 18,
    text: "어려운 결정을 내려야 할 때?",
    dimension: MBTIDimension.TF,
    category: "의사결정",
    options: [
      {
        id: "18a",
        text: "논리적 분석과 합리적 판단을 우선한다",
        value: 2,
        type: "A"
      },
      {
        id: "18b",
        text: "관련된 사람들의 감정과 관계를 고려한다",
        value: 2,
        type: "B"
      }
    ]
  },

  // J/P 차원 (판단 vs 인식) - 6문항
  {
    id: 19,
    text: "학기 초 수업 계획을 세울 때?",
    dimension: MBTIDimension.JP,
    category: "계획 수립",
    options: [
      {
        id: "19a",
        text: "상세한 연간 계획을 미리 완성한다",
        value: 2,
        type: "A"
      },
      {
        id: "19b",
        text: "기본 틀만 잡고 상황에 따라 유연하게 조정한다",
        value: 2,
        type: "B"
      }
    ]
  },
  {
    id: 20,
    text: "수업 중 예상치 못한 상황이 발생했을 때?",
    dimension: MBTIDimension.JP,
    category: "상황 대처",
    options: [
      {
        id: "20a",
        text: "원래 계획대로 진행하려고 노력한다",
        value: 2,
        type: "A"
      },
      {
        id: "20b",
        text: "즉흥적으로 계획을 변경하여 대응한다",
        value: 2,
        type: "B"
      }
    ]
  },
  {
    id: 21,
    text: "과제와 업무 처리 방식은?",
    dimension: MBTIDimension.JP,
    category: "업무 처리",
    options: [
      {
        id: "21a",
        text: "미리미리 체계적으로 처리한다",
        value: 2,
        type: "A"
      },
      {
        id: "21b",
        text: "마감 직전에 집중해서 처리한다",
        value: 2,
        type: "B"
      }
    ]
  },
  {
    id: 22,
    text: "새로운 교육 정책이 도입되었을 때?",
    dimension: MBTIDimension.JP,
    category: "변화 적응",
    options: [
      {
        id: "22a",
        text: "기존 체계에 맞춰 안정적으로 도입한다",
        value: 2,
        type: "A"
      },
      {
        id: "22b",
        text: "새로운 방식으로 창의적으로 접근한다",
        value: 2,
        type: "B"
      }
    ]
  },
  {
    id: 23,
    text: "교실 환경을 구성할 때?",
    dimension: MBTIDimension.JP,
    category: "환경 구성",
    options: [
      {
        id: "23a",
        text: "체계적이고 정돈된 공간을 만든다",
        value: 2,
        type: "A"
      },
      {
        id: "23b",
        text: "자유롭고 유연한 공간을 만든다",
        value: 2,
        type: "B"
      }
    ]
  },
  {
    id: 24,
    text: "수업 시간 관리 방식은?",
    dimension: MBTIDimension.JP,
    category: "시간 관리",
    options: [
      {
        id: "24a",
        text: "정해진 시간 계획을 정확히 지킨다",
        value: 2,
        type: "A"
      },
      {
        id: "24b",
        text: "학생들의 반응에 따라 시간을 조절한다",
        value: 2,
        type: "B"
      }
    ]
  }
];

// 질문 총 개수
export const TOTAL_QUESTIONS = questions.length;

// 차원별 질문 개수 검증
export const questionCountByDimension = {
  [MBTIDimension.EI]: questions.filter(q => q.dimension === MBTIDimension.EI).length,
  [MBTIDimension.SN]: questions.filter(q => q.dimension === MBTIDimension.SN).length,
  [MBTIDimension.TF]: questions.filter(q => q.dimension === MBTIDimension.TF).length,
  [MBTIDimension.JP]: questions.filter(q => q.dimension === MBTIDimension.JP).length,
}; 