export type SocialSource = 'linkedin' | 'instagram';

export interface ProfileClaim {
  verified?: boolean;
  text: string;
  source: SocialSource;
  evidence: string;
}

export interface AgentProfile {
  id: string;
  name: string;
  avatarUrl: string;
  linkedinUrl: string;
  instagramUrl: string;
  archetype: string;
  headline: string;
  summary: string;
  communicationStyle: string;
  needs: ProfileClaim[];
  hobbies: ProfileClaim[];
  interests: ProfileClaim[];
  dealbreakers: ProfileClaim[];
  values: ProfileClaim[];
  qualities?: ProfileClaim[];
  datingStyle?: string;
  location?: string;
  stage?: string;
  sources?: { linkedin: boolean; instagram: boolean; igPosts: number };
  confidence: number;
  scrapedAt: string;
  isCustom?: boolean;
}

export interface DateTurn {
  turnIndex: number;
  speakerId: string;
  speakerName: string;
  dialogue: string;
  innerThought: string;
  topic?: string;
  cumulativeScore?: number;
  scoreDelta?: number;
  scoreReason?: string;
}

export interface AgentVerdict {
  interest: number;
  bestMoment: string;
  friction: string;
  again: boolean;
}

export interface DateResult {
  id: string;
  agentAId: string;
  agentBId: string;
  turns: DateTurn[];
  verdicts: Record<string, AgentVerdict>;
  mutualScore: number;
  chemistryRating: 'Electric' | 'High' | 'Balanced' | 'Friction' | 'Incompatible';
  valuesAlignment: number;
  lifestyleCadence: number;
  conversationalFlow: number;
  dealbreakerTriggered: boolean;
  timestamp: string;
}

export interface CandidateRanking {
  rank: number;
  candidate: AgentProfile;
  score: number;
  myAgentInterest: number;
  theirAgentInterest: number;
  mutualScore: number;
  synergy: string;
  friction: string;
  againConsensus: 'both_yes' | 'one_sided' | 'both_no';
  dateResult?: DateResult;
}
