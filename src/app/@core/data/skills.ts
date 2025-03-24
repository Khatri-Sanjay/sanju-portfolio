// Enum to define the detailed categories for skills
export enum DetailedSkillCategory {
  FrontendTechnologies = 'Frontend Technologies & Frameworks',
  BackendFrameworks = 'Backend & Spring Framework',
  Databases = 'Databases',
  APIsWebServices = 'API & Web Services',
  VersionControl = 'Version Control',
  ProjectManagementTools = 'Project Management Tools',
  IDEsDevelopmentTools = 'IDEs & Development Tools'
}

// Enum to define the original categories for skills
export enum OriginalSkillCategory {
  Framework = 'Framework',
  Frontend = 'Frontend',
  ProgrammingLanguage = 'Programming Language',
  Database = 'Database',
  VersionControl = 'Version Control',
  CMS = 'CMS',
  ManagementTool = 'Management Tool'
}

// Define a type for the Detailed Skill object
export interface DetailedSkill {
  title: string;
  details: string;
}

// Define a type for the Original Skill object
export interface OriginalSkill {
  category: string;
  skills: string[];
}

// Define the skills data with two separate formats
export const Skills = {
  // Get skills in a detailed format with descriptions
  getDetailedSkills(): DetailedSkill[] {
    return [
      {
        title: DetailedSkillCategory.FrontendTechnologies,
        details: 'Technologies and frameworks for building dynamic and responsive web applications including Angular, Angular Material, TypeScript, JavaScript, HTML5, CSS3, and Bootstrap. Proficiency in responsive design is also included.'
      },
      {
        title: DetailedSkillCategory.BackendFrameworks,
        details: 'Backend frameworks and programming languages used to develop and manage server-side applications and APIs such as Spring Boot (RESTful APIs), PHP, and C.'
      },
      {
        title: DetailedSkillCategory.Databases,
        details: 'Familiar with relational databases like MySQL, MSSQL, and Oracle, including database design, optimization, and integration.'
      },
      {
        title: DetailedSkillCategory.APIsWebServices,
        details: 'Experience in building and consuming RESTful APIs, working with JSON, and integrating third-party APIs using technologies like RestTemplate.'
      },
      {
        title: DetailedSkillCategory.VersionControl,
        details: 'Experience with version control systems such as Git, GitHub, GitLab, and Bitbucket for managing code repositories and collaboration.'
      },
      {
        title: DetailedSkillCategory.ProjectManagementTools,
        details: 'Utilized project management tools like Jira and Trello for tracking tasks, managing workflows, and collaborating with teams.'
      },
      {
        title: DetailedSkillCategory.IDEsDevelopmentTools,
        details: 'Familiarity with various Integrated Development Environments (IDEs) such as IntelliJ IDEA, Eclipse, and VS Code for code writing, debugging, and project management.'
      }
    ];
  },

  // Get skills in the original format with arrays of skills
  getOriginalSkills(): OriginalSkill[] {
    return [
      {
        category: OriginalSkillCategory.Framework,
        skills: ['Angular', 'SpringBoot']
      },
      {
        category: OriginalSkillCategory.Frontend,
        skills: ['HTML', 'CSS', 'Javascript', 'TypeScript', 'Bootstrap']
      },
      {
        category: OriginalSkillCategory.ProgrammingLanguage,
        skills: ['PHP', 'Java', 'C']
      },
      {
        category: OriginalSkillCategory.Database,
        skills: ['MySQL', 'MSSQL', 'Oracle']
      },
      {
        category: OriginalSkillCategory.VersionControl,
        skills: ['Git', 'GitHub', 'GitLab', 'Bitbucket']
      },
      {
        category: OriginalSkillCategory.CMS,
        skills: ['WordPress']
      },
      {
        category: OriginalSkillCategory.ManagementTool,
        skills: ['Jira', 'Slack']
      }
    ];
  },

  getAllSkills(): string[] {
    return [
      'Angular', 'SpringBoot', 'HTML', 'CSS', 'Javascript', 'TypeScript', 'Bootstrap', 'Responsive Design',
      'PHP', 'Java', 'C', 'MySQL', 'MSSQL', 'Oracle', 'RESTful APIs', 'JSON', 'Git', 'GitHub', 'GitLab', 'Bitbucket',
      'WordPress', 'Jira', 'Slack', 'IntelliJ IDEA', 'Eclipse', 'VS Code'
    ];
  }
};
