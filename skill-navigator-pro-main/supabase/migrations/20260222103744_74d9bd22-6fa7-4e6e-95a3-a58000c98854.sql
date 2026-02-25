
-- Profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  email TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email, full_name)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'full_name', ''));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Resumes table
CREATE TABLE public.resumes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  extracted_text TEXT,
  extracted_skills TEXT[] DEFAULT '{}',
  uploaded_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.resumes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own resumes" ON public.resumes FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own resumes" ON public.resumes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own resumes" ON public.resumes FOR DELETE USING (auth.uid() = user_id);

-- Job roles table (public read)
CREATE TABLE public.job_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL UNIQUE,
  description TEXT,
  required_skills TEXT[] NOT NULL DEFAULT '{}',
  category TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.job_roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view job roles" ON public.job_roles FOR SELECT USING (true);

-- Skill matches table
CREATE TABLE public.skill_matches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  resume_id UUID NOT NULL REFERENCES public.resumes(id) ON DELETE CASCADE,
  job_role_id UUID NOT NULL REFERENCES public.job_roles(id) ON DELETE CASCADE,
  match_percentage NUMERIC(5,2) NOT NULL DEFAULT 0,
  matching_skills TEXT[] DEFAULT '{}',
  missing_skills TEXT[] DEFAULT '{}',
  similarity_score NUMERIC(5,4) DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.skill_matches ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own matches" ON public.skill_matches FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own matches" ON public.skill_matches FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own matches" ON public.skill_matches FOR DELETE USING (auth.uid() = user_id);

-- Recommendations table
CREATE TABLE public.recommendations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  skill_match_id UUID NOT NULL REFERENCES public.skill_matches(id) ON DELETE CASCADE,
  missing_skill TEXT NOT NULL,
  course_suggestions JSONB DEFAULT '[]',
  project_suggestions JSONB DEFAULT '[]',
  roadmap JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.recommendations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own recommendations" ON public.recommendations FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own recommendations" ON public.recommendations FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Timestamp update function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Storage bucket for resumes
INSERT INTO storage.buckets (id, name, public) VALUES ('resumes', 'resumes', false);

CREATE POLICY "Users can upload own resumes" ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'resumes' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view own resumes" ON storage.objects FOR SELECT
  USING (bucket_id = 'resumes' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete own resumes" ON storage.objects FOR DELETE
  USING (bucket_id = 'resumes' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Seed job roles
INSERT INTO public.job_roles (title, description, required_skills, category) VALUES
('Data Analyst', 'Analyze data to extract insights and support decision-making', 
  ARRAY['python', 'sql', 'excel', 'tableau', 'power bi', 'statistics', 'data visualization', 'pandas', 'numpy', 'r', 'data cleaning', 'data modeling', 'critical thinking', 'communication', 'problem solving'],
  'Data'),
('AI Engineer', 'Design and build AI/ML systems and models',
  ARRAY['python', 'machine learning', 'deep learning', 'tensorflow', 'pytorch', 'nlp', 'computer vision', 'sql', 'docker', 'kubernetes', 'git', 'mathematics', 'statistics', 'data structures', 'algorithms', 'problem solving', 'communication'],
  'AI/ML'),
('Full Stack Developer', 'Build end-to-end web applications',
  ARRAY['javascript', 'typescript', 'react', 'node.js', 'html', 'css', 'sql', 'git', 'rest api', 'mongodb', 'postgresql', 'docker', 'agile', 'problem solving', 'communication', 'tailwind css', 'next.js'],
  'Engineering'),
('DevOps Engineer', 'Manage infrastructure, CI/CD, and deployment pipelines',
  ARRAY['linux', 'docker', 'kubernetes', 'aws', 'terraform', 'ci/cd', 'git', 'python', 'bash', 'monitoring', 'networking', 'security', 'jenkins', 'ansible', 'problem solving', 'communication'],
  'Engineering'),
('Cybersecurity Analyst', 'Protect systems and networks from security threats',
  ARRAY['networking', 'linux', 'security', 'firewalls', 'siem', 'penetration testing', 'incident response', 'python', 'cryptography', 'risk assessment', 'compliance', 'vulnerability assessment', 'communication', 'problem solving', 'critical thinking'],
  'Security');
