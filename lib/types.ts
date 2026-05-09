export interface User {
  id: string
  email: string
  full_name?: string
}

export interface UserProfile {
  id: string
  user_id: string
  full_name?: string
  tracking_type: 'period' | 'pregnancy'
  cycle_length: number
  period_length: number
  avatar_url?: string
  created_at: string
  updated_at: string
}

export interface CycleLog {
  id: string
  user_id: string
  date: string
  phase: 'period' | 'fertile' | 'ovulation' | 'luteal'
  symptoms?: string[]
  notes?: string
  created_at: string
  updated_at: string
}

export interface PregnancyData {
  id: string
  user_id: string
  conception_date: string
  current_week: number
  baby_weight?: number
  baby_height?: number
  mother_condition?: string
  due_date: string
  created_at: string
  updated_at: string
}

export interface HealthMetric {
  id: string
  user_id: string
  date: string
  metric_type: 'heart_rate' | 'blood_pressure' | 'glucose' | 'steps' | 'sleep'
  value: number
  unit?: string
  notes?: string
  created_at: string
}

export interface Symptom {
  id: string
  user_id: string
  date: string
  symptom_name: string
  intensity: 1 | 2 | 3 | 4 | 5
  notes?: string
  created_at: string
}

export interface EducationalContent {
  id: string
  title: string
  description?: string
  category?: string
  duration_minutes?: number
  content?: string
  image_url?: string
  created_at: string
  updated_at: string
}
