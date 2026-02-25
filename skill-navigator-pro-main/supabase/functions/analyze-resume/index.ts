import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Comprehensive skill dictionary with improved aliases and variations
const SKILL_DICTIONARY: Record<string, string[]> = {
  // Programming Languages
  python: ["python", "py", "python3", "python 3", "python2", "python 2"],
  javascript: ["javascript", "js", "es6", "es2015", "ecmascript", "es5", "ecma"],
  typescript: ["typescript", "ts"],
  java: ["java", "jvm", "j2ee"],
  "c++": ["c\\+\\+", "cpp", "c plus plus"],
  c: ["\\bc\\b", "c programming", "c language"],
  "c#": ["c#", "csharp", "c sharp", "dotnet"],
  r: ["\\br\\b", "r programming", "r language", "rstudio"],
  go: ["golang", "go", "go programming"],
  rust: ["rust"],
  ruby: ["ruby", "rails", "ruby on rails"],
  php: ["php"],
  swift: ["swift", "ios development"],
  kotlin: ["kotlin"],
  scala: ["scala"],
  sql: ["sql", "mysql", "postgresql", "postgres", "sqlite", "tsql", "t\\-sql", "pl[\\/\\-]?sql", "oracle"],
  bash: ["bash", "shell", "sh", "zsh", "shell script", "scripting"],
  
  // Web Frameworks & Libraries
  html: ["html", "html5"],
  css: ["css", "css3", "scss", "sass", "less", "tailwind"],
  react: ["react", "reactjs", "react\\.js"],
  "node.js": ["node\\.js", "nodejs", "node"],
  "next.js": ["next\\.js", "nextjs"],
  angular: ["angular", "angularjs"],
  vue: ["vue", "vuejs", "vue\\.js"],
  "tailwind css": ["tailwind", "tailwindcss"],
  bootstrap: ["bootstrap"],
  express: ["express", "expressjs"],
  django: ["django"],
  flask: ["flask"],
  "rest api": ["rest", "restful", "rest api", "api development"],
  graphql: ["graphql"],
  webpack: ["webpack"],
  
  // Data & Analytics
  pandas: ["pandas"],
  numpy: ["numpy"],
  excel: ["excel", "spreadsheet", "xlsx", "vba"],
  tableau: ["tableau"],
  "power bi": ["power bi", "powerbi"],
  "data visualization": ["data visualization", "data viz", "visualization", "plotly", "matplotlib"],
  "data cleaning": ["data cleaning", "data wrangling", "data preprocessing", "etl"],
  "data modeling": ["data modeling", "data modelling"],
  statistics: ["statistics", "statistical analysis", "stat", "r programming"],
  "business intelligence": ["business intelligence", "bi", "analytics"],
  
  // AI/ML
  "machine learning": ["machine learning", "ml", "ai", "artificial intelligence"],
  "deep learning": ["deep learning", "dl", "neural network", "neural networks", "cnn", "rnn", "lstm"],
  tensorflow: ["tensorflow", "tf"],
  pytorch: ["pytorch", "torch"],
  nlp: ["nlp", "natural language", "text mining", "text processing"],
  "computer vision": ["computer vision", "cv", "image recognition", "object detection"],
  scikit: ["scikit", "sklearn"],
  
  // DevOps & Cloud
  docker: ["docker", "dockerfile", "container", "containerization"],
  kubernetes: ["kubernetes", "k8s"],
  aws: ["aws", "amazon web services", "ec2", "s3", "lambda", "rds", "dynamodb"],
  azure: ["azure", "microsoft azure", "cosmosdb", "app service"],
  gcp: ["gcp", "google cloud", "bigquery"],
  terraform: ["terraform", "iac", "infrastructure as code"],
  "ci/cd": ["ci[\\/\\-]?cd", "cicd", "continuous integration", "continuous deployment", "continuous delivery", "jenkins", "github actions", "gitlab ci"],
  git: ["git", "github", "gitlab", "version control", "bitbucket"],
  linux: ["linux", "ubuntu", "centos", "redhat", "rhel"],
  windows: ["windows server", "powershell"],
  
  // Databases
  mongodb: ["mongodb", "mongo"],
  postgresql: ["postgresql", "postgres"],
  mysql: ["mysql"],
  redis: ["redis"],
  elasticsearch: ["elasticsearch", "elastic"],
  cassandra: ["cassandra"],
  dynamodb: ["dynamodb"],
  firebase: ["firebase"],
  
  // Security & Networking
  security: ["security", "cybersecurity", "information security", "infosec"],
  firewalls: ["firewall", "firewalls"],
  siem: ["siem", "splunk"],
  "penetration testing": ["penetration testing", "pentesting", "ethical hacking"],
  "incident response": ["incident response", "ir"],
  cryptography: ["cryptography", "encryption", "ssl", "tls"],
  "risk assessment": ["risk assessment", "risk management"],
  compliance: ["compliance", "gdpr", "hipaa", "sox", "pci"],
  "vulnerability assessment": ["vulnerability assessment", "vulnerability scanning"],
  networking: ["networking", "tcp[\\/\\-]?ip", "dns", "dhcp", "vpn"],
  monitoring: ["monitoring", "prometheus", "grafana", "nagios"],
  jenkins: ["jenkins"],
  ansible: ["ansible"],
  
  // Soft Skills & Methodologies
  "problem solving": ["problem solving", "problem\\-solving", "analytical thinking"],
  communication: ["communication", "verbal communication", "written communication", "presentation"],
  "critical thinking": ["critical thinking"],
  teamwork: ["teamwork", "team player", "collaboration", "collaborative"],
  leadership: ["leadership", "team lead", "management", "mentor"],
  agile: ["agile", "scrum", "kanban", "sprint", "xp"],
  "project management": ["project management", "jira", "asana", "monday"],
  
  // Algorithms & Concepts
  "data structures": ["data structure", "data structures"],
  algorithms: ["algorithm", "algorithms", "algorithm design"],
  mathematics: ["mathematics", "math", "linear algebra", "calculus", "discrete math"],
};

function extractSkills(text: string): string[] {
  const lowerText = text.toLowerCase();
  const foundSkills: Set<string> = new Set();
  const matchedAliases: Map<string, string[]> = new Map(); // Track which aliases matched for skill grouping

  for (const [skill, aliases] of Object.entries(SKILL_DICTIONARY)) {
    for (const alias of aliases) {
      try {
        // Use word boundary matching for better accuracy
        // Escape special regex chars, then wrap in word boundaries
        const escapedAlias = alias
          .replace(/\\\//g, "/") // Handle escaped slashes
          .replace(/[\[\]]/g, "") // Clean up bracket escapes
          .replace(/\\-/g, "[\\-\\s]") // Handle hyphens as optional spaces
          .replace(/\\\+/g, "\\+"); // Restore escaped plus signs
        
        const regex = new RegExp(`(?:^|\\s|[/\\-])${escapedAlias}(?:\\s|[/\\-]|$)`, "i");
        
        if (regex.test(lowerText)) {
          foundSkills.add(skill);
          if (!matchedAliases.has(skill)) {
            matchedAliases.set(skill, []);
          }
          matchedAliases.get(skill)!.push(alias);
          break;
        }
      } catch (e) {
        // Skip if regex is invalid
        continue;
      }
    }
  }

  // Remove related skills if more specific ones are found (e.g., remove "Machine Learning" if "Deep Learning" is found)
  const skillsToPotentiallyRemove: Record<string, string[]> = {
    "machine learning": ["deep learning"],
    "communication": ["leadership", "teamwork"],
    "linux": ["ubuntu", "centos"],
    "security": ["penetration testing", "incident response"],
  };

  for (const [general, specific] of Object.entries(skillsToPotentiallyRemove)) {
    const hasSpecific = specific.some(s => foundSkills.has(s));
    if (hasSpecific && foundSkills.has(general)) {
      // Keep both - don't remove general skills as they add value
    }
  }

  return Array.from(foundSkills).sort(); // Return sorted for consistency
}

function cosineSimilarity(setA: string[], setB: string[]): number {
  // Improved similarity: normalize skills, handle different cases
  const normalizeSkill = (skill: string) => skill.toLowerCase().trim();
  const normalizedA = new Set(setA.map(normalizeSkill));
  const normalizedB = new Set(setB.map(normalizeSkill));
  
  // TF-IDF-like: treat each skill as a dimension, binary presence
  const allSkills = new Set([...normalizedA, ...normalizedB]);
  let dotProduct = 0;
  let magA = 0;
  let magB = 0;

  for (const skill of allSkills) {
    const a = normalizedA.has(skill) ? 1 : 0;
    const b = normalizedB.has(skill) ? 1 : 0;
    dotProduct += a * b;
    magA += a * a;
    magB += b * b;
  }

  if (magA === 0 || magB === 0) return 0;
  return dotProduct / (Math.sqrt(magA) * Math.sqrt(magB));
}

function normalizeSkillName(skill: string): string {
  return skill.toLowerCase().replace(/[\s\-\/]+/g, " ").trim();
}

function generateRecommendations(missingSkill: string) {
  const normalizedSkill = normalizeSkillName(missingSkill);
  
  const courseMap: Record<string, { name: string; platform: string; url: string }[]> = {
    python: [
      { name: "Python for Everybody", platform: "Coursera", url: "https://www.coursera.org/specializations/python" },
      { name: "Complete Python Bootcamp", platform: "Udemy", url: "https://www.udemy.com/course/complete-python-bootcamp/" },
      { name: "Python Programming", platform: "freeCodeCamp", url: "https://www.freecodecamp.org/learn/python-for-beginners/" },
    ],
    javascript: [
      { name: "The Complete JavaScript Course", platform: "Udemy", url: "https://www.udemy.com/course/the-complete-javascript-course/" },
      { name: "JavaScript Basics", platform: "Coding Train", url: "https://thecodingtrain.com/" },
      { name: "JavaScript Full Stack", platform: "freeCodeCamp", url: "https://www.freecodecamp.org/learn/javascript/" },
    ],
    typescript: [
      { name: "TypeScript: The Complete Developer's Guide", platform: "Udemy", url: "https://www.udemy.com/course/typescript-the-complete-developers-guide/" },
      { name: "TypeScript for JavaScript Programmers", platform: "TypeScript", url: "https://www.typescriptlang.org/docs/handbook/typescript-in-5-minutes.html" },
    ],
    "machine learning": [
      { name: "Machine Learning by Andrew Ng", platform: "Coursera", url: "https://www.coursera.org/learn/machine-learning" },
      { name: "Machine Learning Specialization", platform: "Coursera", url: "https://www.coursera.org/specializations/machine-learning-introduction" },
      { name: "ML with Python", platform: "freeCodeCamp", url: "https://www.freecodecamp.org/learn/machine-learning-with-python/" },
    ],
    "deep learning": [
      { name: "Deep Learning Specialization", platform: "Coursera", url: "https://www.coursera.org/specializations/deep-learning" },
      { name: "Fast.ai - Practical Deep Learning", platform: "Fast.ai", url: "https://www.fast.ai/" },
    ],
    sql: [
      { name: "SQL for Data Science", platform: "Coursera", url: "https://www.coursera.org/learn/sql-for-data-science" },
      { name: "The Complete SQL Bootcamp", platform: "Udemy", url: "https://www.udemy.com/course/the-complete-sql-bootcamp/" },
      { name: "SQL Basics", platform: "Khan Academy", url: "https://www.khanacademy.org/computing/computer-programming/sql" },
    ],
    react: [
      { name: "React - The Complete Guide", platform: "Udemy", url: "https://www.udemy.com/course/react-the-complete-guide/" },
      { name: "Full Stack Open", platform: "University of Helsinki", url: "https://fullstackopen.com/en/" },
      { name: "React Fundamentals", platform: "Egghead", url: "https://egghead.io/courses/react-fundamentals" },
    ],
    docker: [
      { name: "Docker Mastery", platform: "Udemy", url: "https://www.udemy.com/course/docker-mastery/" },
      { name: "Docker for Beginners", platform: "KodeKloud", url: "https://kodekloud.com/courses/docker-for-beginners/" },
      { name: "Docker Handbook", platform: "freeCodeCamp", url: "https://www.freecodecamp.org/news/docker-handbook/" },
    ],
    kubernetes: [
      { name: "Kubernetes for Beginners", platform: "KodeKloud", url: "https://kodekloud.com/courses/kubernetes-for-beginners/" },
      { name: "Kubernetes CKAD Exam", platform: "Linux Academy", url: "https://www.linuxacademy.com/courses/kubernetes-essentials" },
    ],
    aws: [
      { name: "AWS Certified Solutions Architect", platform: "A Cloud Guru", url: "https://acloudguru.com/course/aws-certified-solutions-architect-associate" },
      { name: "AWS Fundamentals", platform: "Coursera", url: "https://www.coursera.org/learn/aws-fundamentals" },
    ],
    git: [
      { name: "Git and GitHub", platform: "Udemy", url: "https://www.udemy.com/course/git-and-github-bootcamp/" },
      { name: "Git Basics", platform: "Atlassian", url: "https://www.atlassian.com/git/tutorials/what-is-git" },
    ],
  };

  const projectMap: Record<string, string[]> = {
    python: [
      "Build a CLI task manager with file persistence",
      "Create a web scraper with BeautifulSoup",
      "Develop a REST API with Flask or Django",
      "Build a data analysis project with Pandas",
    ],
    javascript: [
      "Build a weather app using Open Weather API",
      "Create an interactive quiz game",
      "Develop a calculator or todo app",
      "Build a JavaScript library or utility",
    ],
    typescript: [
      "Convert a JavaScript project to TypeScript",
      "Build a type-safe Node.js REST API",
      "Create a React component library in TypeScript",
    ],
    "machine learning": [
      "Build a sentiment analysis model on reviews",
      "Create a recommendation system for movies/products",
      "Develop a chatbot using NLP",
      "Build a predictive model on public datasets",
    ],
    sql: [
      "Design a library management database schema",
      "Build analytics queries for e-commerce data",
      "Create a data warehouse schema",
      "Develop a reporting dashboard with SQL",
    ],
    react: [
      "Build a task management app with state management",
      "Create a real-time chat application",
      "Develop a portfolio website",
      "Build a weather or movie search app",
    ],
    docker: [
      "Containerize a full-stack application",
      "Set up a multi-container app with Docker Compose",
      "Create a deployment pipeline with Docker",
    ],
    git: [
      "Contribute to an open-source project",
      "Set up a CI/CD pipeline with GitHub Actions",
      "Manage a team project with Git workflows",
    ],
  };

  const courses = courseMap[normalizedSkill] || [
    { name: `Learn ${missingSkill}`, platform: "Coursera", url: `https://www.coursera.org/search?query=${encodeURIComponent(missingSkill)}` },
    { name: `${missingSkill} Tutorial`, platform: "YouTube", url: `https://www.youtube.com/results?search_query=${encodeURIComponent(missingSkill)}+tutorial` },
  ];

  const projects = projectMap[normalizedSkill] || [
    `Build a portfolio project using ${missingSkill}`,
    `Contribute to an open-source ${missingSkill} project`,
  ];

  return { courses, projects };
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "No authorization header" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get user from token
    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);
    if (userError || !user) {
      return new Response(JSON.stringify({ error: "Invalid token" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { resumeText: rawResumeText, jobRoleId } = await req.json();

    if (!rawResumeText || !jobRoleId) {
      return new Response(JSON.stringify({ error: "resumeText and jobRoleId are required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Sanitize: strip non-printable/invalid Unicode, keep only readable text
    const resumeText = rawResumeText
      .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x9F]/g, "")
      .replace(/[^\x20-\x7E\xA0-\uFFFF\n\r\t]/g, " ")
      .replace(/\\u[0-9a-fA-F]{4}/g, " ")
      .replace(/\s+/g, " ")
      .trim();

    // Extract skills from resume
    const extractedSkills = extractSkills(resumeText);

    // Get job role
    const { data: jobRole, error: roleError } = await supabase
      .from("job_roles")
      .select("*")
      .eq("id", jobRoleId)
      .single();

    if (roleError || !jobRole) {
      return new Response(JSON.stringify({ error: "Job role not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const requiredSkills: string[] = jobRole.required_skills;
    
    // Normalize skills for accurate comparison
    const normalizedExtracted = extractedSkills.map(normalizeSkillName);
    const normalizedRequired = requiredSkills.map(normalizeSkillName);
    
    // Find matching skills (case-insensitive, normalized)
    const matchingSkills = extractedSkills.filter((skill) => {
      const normalized = normalizeSkillName(skill);
      return normalizedRequired.includes(normalized);
    });
    
    const missingSkills = requiredSkills.filter((skill) => {
      const normalized = normalizeSkillName(skill);
      return !normalizedExtracted.includes(normalized);
    });
    
    const matchPercentage = requiredSkills.length > 0
      ? (matchingSkills.length / requiredSkills.length) * 100
      : 0;
    const similarityScore = cosineSimilarity(extractedSkills, requiredSkills);

    // Save resume
    const { data: resume, error: resumeError } = await supabase
      .from("resumes")
      .insert({
        user_id: user.id,
        file_name: "uploaded_resume",
        file_path: "text_input",
        extracted_text: resumeText.substring(0, 10000),
        extracted_skills: extractedSkills,
      })
      .select()
      .single();

    if (resumeError) {
      return new Response(JSON.stringify({ error: "Failed to save resume", details: resumeError.message }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Save skill match
    const { data: skillMatch, error: matchError } = await supabase
      .from("skill_matches")
      .insert({
        user_id: user.id,
        resume_id: resume.id,
        job_role_id: jobRoleId,
        match_percentage: Math.round(matchPercentage * 100) / 100,
        matching_skills: matchingSkills,
        missing_skills: missingSkills,
        similarity_score: Math.round(similarityScore * 10000) / 10000,
      })
      .select()
      .single();

    if (matchError) {
      return new Response(JSON.stringify({ error: "Failed to save match", details: matchError.message }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Generate and save recommendations
    const recommendations = missingSkills.slice(0, 10).map((skill) => {
      const recs = generateRecommendations(skill);
      return {
        user_id: user.id,
        skill_match_id: skillMatch.id,
        missing_skill: skill,
        course_suggestions: recs.courses,
        project_suggestions: recs.projects,
        roadmap: {
          month1: `Learn fundamentals of ${skill}`,
          month2: `Build projects using ${skill}`,
          month3: `Apply ${skill} in real-world scenarios and contribute to open-source`,
        },
      };
    });

    if (recommendations.length > 0) {
      await supabase.from("recommendations").insert(recommendations);
    }

    // Use AI for a personalized summary
    let aiSummary = "";
    try {
      const apiKey = Deno.env.get("AI_API_KEY");
      const aiApiUrl = Deno.env.get("AI_API_URL") || "http://localhost:8081/v1/chat/completions";
      if (aiApiUrl) {
        const headers: Record<string, string> = { "Content-Type": "application/json" };
        if (apiKey) headers.Authorization = `Bearer ${apiKey}`;

        const aiResponse = await fetch(aiApiUrl, {
          method: "POST",
          headers,
          body: JSON.stringify({
            model: "google/gemini-2.5-flash-lite",
            messages: [
              {
                role: "system",
                content: "You are a career coach. Given a student's skill analysis, provide a brief 3-4 sentence personalized recommendation summary. Be encouraging but specific.",
              },
              {
                role: "user",
                content: `Role: ${jobRole.title}\nMatch: ${matchPercentage.toFixed(1)}%\nHave: ${matchingSkills.join(", ") || "none"}\nMissing: ${missingSkills.join(", ") || "none"}`,
              },
            ],
            max_tokens: 200,
          }),
        });
        const aiData = await aiResponse.json();
        aiSummary = aiData.choices?.[0]?.message?.content || "";
      }
    } catch {
      // AI summary is optional
    }

    return new Response(
      JSON.stringify({
        extractedSkills,
        matchPercentage: Math.round(matchPercentage * 100) / 100,
        matchingSkills,
        missingSkills,
        similarityScore: Math.round(similarityScore * 10000) / 10000,
        jobRole: jobRole.title,
        resumeId: resume.id,
        skillMatchId: skillMatch.id,
        aiSummary,
        recommendations: recommendations.map((r) => ({
          skill: r.missing_skill,
          courses: r.course_suggestions,
          projects: r.project_suggestions,
          roadmap: r.roadmap,
        })),
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: "Internal server error", details: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
