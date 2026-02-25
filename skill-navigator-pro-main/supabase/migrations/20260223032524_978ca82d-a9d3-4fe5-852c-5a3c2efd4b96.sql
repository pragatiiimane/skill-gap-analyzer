
-- Add user_id column to job_roles for custom roles (nullable = system roles)
ALTER TABLE public.job_roles ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE DEFAULT NULL;

-- Allow users to insert their own custom roles
CREATE POLICY "Users can insert own job roles" ON public.job_roles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Allow users to delete their own custom roles
CREATE POLICY "Users can delete own job roles" ON public.job_roles FOR DELETE
  USING (auth.uid() = user_id);

-- Remove unique constraint on title to allow user-created duplicates
ALTER TABLE public.job_roles DROP CONSTRAINT IF EXISTS job_roles_title_key;

-- Add more predefined job roles
INSERT INTO public.job_roles (title, description, required_skills, category) VALUES
('Frontend Developer', 'Build responsive user interfaces and web experiences',
  ARRAY['javascript', 'typescript', 'react', 'html', 'css', 'tailwind css', 'git', 'rest api', 'next.js', 'problem solving', 'communication', 'agile'],
  'Engineering'),
('Backend Developer', 'Design server-side logic, databases, and APIs',
  ARRAY['python', 'node.js', 'sql', 'postgresql', 'rest api', 'docker', 'git', 'linux', 'redis', 'mongodb', 'problem solving', 'communication'],
  'Engineering'),
('Mobile App Developer', 'Build native and cross-platform mobile applications',
  ARRAY['javascript', 'typescript', 'react', 'swift', 'kotlin', 'rest api', 'git', 'agile', 'problem solving', 'communication'],
  'Engineering'),
('Data Scientist', 'Extract insights from data using statistical and ML methods',
  ARRAY['python', 'sql', 'machine learning', 'statistics', 'pandas', 'numpy', 'data visualization', 'deep learning', 'r', 'tensorflow', 'communication', 'critical thinking', 'problem solving'],
  'Data'),
('Data Engineer', 'Build and maintain data pipelines and infrastructure',
  ARRAY['python', 'sql', 'aws', 'docker', 'linux', 'postgresql', 'mongodb', 'redis', 'git', 'bash', 'data modeling', 'problem solving', 'communication'],
  'Data'),
('Machine Learning Engineer', 'Deploy and optimize ML models at scale',
  ARRAY['python', 'machine learning', 'deep learning', 'tensorflow', 'pytorch', 'docker', 'kubernetes', 'aws', 'sql', 'git', 'mathematics', 'data structures', 'algorithms', 'problem solving'],
  'AI/ML'),
('Cloud Architect', 'Design and manage cloud infrastructure solutions',
  ARRAY['aws', 'azure', 'gcp', 'docker', 'kubernetes', 'terraform', 'linux', 'networking', 'security', 'ci/cd', 'monitoring', 'problem solving', 'communication', 'leadership'],
  'Cloud'),
('UI/UX Designer', 'Design intuitive and beautiful user experiences',
  ARRAY['html', 'css', 'javascript', 'react', 'tailwind css', 'data visualization', 'communication', 'critical thinking', 'problem solving', 'teamwork', 'agile'],
  'Design'),
('QA Engineer', 'Ensure software quality through testing strategies',
  ARRAY['javascript', 'python', 'sql', 'git', 'ci/cd', 'linux', 'agile', 'problem solving', 'communication', 'critical thinking'],
  'Engineering'),
('Blockchain Developer', 'Build decentralized applications and smart contracts',
  ARRAY['javascript', 'typescript', 'python', 'sql', 'git', 'docker', 'cryptography', 'data structures', 'algorithms', 'problem solving', 'communication'],
  'Engineering'),
('Game Developer', 'Create interactive gaming experiences',
  ARRAY['c++', 'python', 'javascript', 'mathematics', 'data structures', 'algorithms', 'git', 'problem solving', 'teamwork', 'communication'],
  'Engineering'),
('Product Manager', 'Drive product strategy and delivery',
  ARRAY['agile', 'communication', 'leadership', 'critical thinking', 'problem solving', 'teamwork', 'data visualization', 'sql', 'excel'],
  'Management'),
('Site Reliability Engineer', 'Ensure system reliability and performance',
  ARRAY['linux', 'docker', 'kubernetes', 'aws', 'python', 'bash', 'monitoring', 'networking', 'ci/cd', 'terraform', 'git', 'problem solving', 'communication'],
  'Engineering'),
('NLP Engineer', 'Build natural language processing systems',
  ARRAY['python', 'nlp', 'machine learning', 'deep learning', 'tensorflow', 'pytorch', 'statistics', 'mathematics', 'sql', 'git', 'problem solving', 'communication'],
  'AI/ML'),
('Business Intelligence Analyst', 'Transform data into business insights',
  ARRAY['sql', 'excel', 'tableau', 'power bi', 'python', 'statistics', 'data visualization', 'data modeling', 'communication', 'critical thinking', 'problem solving'],
  'Data');
