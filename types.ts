export interface AnalysisResponse {
  factCheck: string;
  insultCheck: string;
  softWarCheck: string;
  sourceOrigin: string;
  argument: string;
  suggestedResponse: string;
  religiousQuote: string;
}

export enum AppState {
  IDLE = 'IDLE',
  ANALYZING = 'ANALYZING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
}
