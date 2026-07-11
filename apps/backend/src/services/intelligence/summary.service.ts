export class SummaryService {
  static generateDeveloperReport(repoData: any, aiAnalysis: any) {
    return {
      repo: repoData.fullName,
      shouldLearn: aiAnalysis.learningValue || "Yes, highly recommended.",
      difficulty: aiAnalysis.difficultyLevel || "Intermediate",
      verdict: "Strong community backing and solid engineering."
    };
  }
}
