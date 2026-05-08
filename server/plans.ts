export type PlanId = 'trial' | 'expired' | 'greenhorn' | 'vigilante' | 'sentinel';

export const PLAN_LIMITS: Record<PlanId, { scansPerMonth: number; scansPerDay?: number; allowedPersonas: string[] }> = {
  trial:     { scansPerMonth: 3, scansPerDay: 1, allowedPersonas: ['green', 'blue'] },
  expired:   { scansPerMonth: 0, allowedPersonas: [] },
  greenhorn: { scansPerMonth: 30, allowedPersonas: ['green', 'blue', 'white'] },
  vigilante: { scansPerMonth: 150, allowedPersonas: ['white', 'black', 'grey', 'red', 'green', 'blue'] },
  sentinel:  { scansPerMonth: 500, allowedPersonas: ['white', 'black', 'grey', 'red', 'green', 'blue'] },
};

export const TRIAL_DAYS = 3;

export function planFromEnvOrFallback(plan: string | null | undefined): PlanId {
  if (plan === 'greenhorn' || plan === 'vigilante' || plan === 'sentinel') return plan;
  return 'trial';
}
