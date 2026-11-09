// MOCK DATA: development only. Never served in production (see isMockMode).
// Shape mirrors resale_brands (id, name) and resale_questions (id, question) + resale_question_answers (id, answer)
// from wafi-service's migrations. Brand / question texts are DB content, so they are not translated.
// The wording is sample text marked "(MOCK)" so it is never mistaken for real backend data.

export function getResaleFormDataMock(): unknown {
  return {
    data: {
      brands: [
        { id: 9001, name: 'iPhone (MOCK)' },
        { id: 9002, name: 'Samsung (MOCK)' },
      ],
      questions: [
        { id: 9101, question: 'سؤال تجريبي (MOCK): ما سعة الذاكرة؟', answers: [] },
        { id: 9102, question: 'سؤال تجريبي (MOCK): ما لون الجهاز؟', answers: [] },
        { id: 9103, question: 'سؤال تجريبي (MOCK): هل الشاشة فيها خدوش؟', answers: [] },
      ],
    },
  };
}
