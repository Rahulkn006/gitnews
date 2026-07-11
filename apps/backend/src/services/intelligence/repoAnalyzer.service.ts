export class RepoAnalyzerService {
  static extractTechnologies(topics: string[], language: string) {
    const techSet = new Set(topics);
    if (language) techSet.add(language.toLowerCase());
    return Array.from(techSet);
  }
}
