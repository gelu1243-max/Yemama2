-- Create tables for yemama pregnancy and period tracker

-- Cycle logs table
CREATE TABLE IF NOT EXISTS cycle_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  phase TEXT CHECK (phase IN ('period', 'fertile', 'ovulation', 'luteal')),
  symptoms TEXT[],
  notes TEXT,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now(),
  UNIQUE(user_id, date)
);

-- Pregnancy data table
CREATE TABLE IF NOT EXISTS pregnancy_data (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  conception_date DATE NOT NULL,
  current_week INTEGER,
  baby_weight DECIMAL(5,2),
  baby_height DECIMAL(5,2),
  mother_condition TEXT,
  due_date DATE,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

-- Health metrics table
CREATE TABLE IF NOT EXISTS health_metrics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  metric_type TEXT CHECK (metric_type IN ('heart_rate', 'blood_pressure', 'glucose', 'steps', 'sleep')),
  value DECIMAL(10,2),
  unit TEXT,
  notes TEXT,
  created_at TIMESTAMP DEFAULT now(),
  UNIQUE(user_id, date, metric_type)
);

-- Symptoms table
CREATE TABLE IF NOT EXISTS symptoms (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  symptom_name TEXT NOT NULL,
  intensity INTEGER CHECK (intensity >= 1 AND intensity <= 5),
  notes TEXT,
  created_at TIMESTAMP DEFAULT now()
);

-- Educational content table
CREATE TABLE IF NOT EXISTS educational_content (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT,
  duration_minutes INTEGER,
  content TEXT,
  image_url TEXT,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

-- User profiles table extension
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  tracking_type TEXT CHECK (tracking_type IN ('period', 'pregnancy')),
  cycle_length INTEGER DEFAULT 28,
  period_length INTEGER DEFAULT 5,
  avatar_url TEXT,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

-- Enable RLS
ALTER TABLE cycle_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE pregnancy_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE health_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE symptoms ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own data" ON cycle_logs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own data" ON cycle_logs FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own data" ON cycle_logs FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can view their pregnancy data" ON pregnancy_data FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert pregnancy data" ON pregnancy_data FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update pregnancy data" ON pregnancy_data FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can view their health metrics" ON health_metrics FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert health metrics" ON health_metrics FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update health metrics" ON health_metrics FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can view their symptoms" ON symptoms FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert symptoms" ON symptoms FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their profile" ON user_profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update their profile" ON user_profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their profile" ON user_profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Educational content is public" ON educational_content FOR SELECT USING (true);

-- Create indexes for better query performance
CREATE INDEX idx_cycle_logs_user_date ON cycle_logs(user_id, date DESC);
CREATE INDEX idx_health_metrics_user_date ON health_metrics(user_id, date DESC);
CREATE INDEX idx_symptoms_user_date ON symptoms(user_id, date DESC);
