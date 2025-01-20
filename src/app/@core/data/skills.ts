// Enum to define the categories for skills
export enum SkillCategory {
  Framework = 'Framework',
  Frontend = 'Frontend',
  ProgrammingLanguage = 'Programming Language',
  Database = 'Database',
  VersionControl = 'Version Control',
  CMS = 'CMS',
  ManagementTool = 'Management Tool'
}

// Define a type for the Skill object
export interface Skill {
  category: SkillCategory;
  skills: string[];
}

export const skills = {
  // Return categorized skills
  getWithCategory(): Skill[] {
    return [
      {
        category: SkillCategory.Framework,
        skills: ['Angular', 'SpringBoot']
      },
      {
        category: SkillCategory.Frontend,
        skills: ['HTML', 'CSS', 'Javascript', 'TypeScript', 'Bootstrap']
      },
      {
        category: SkillCategory.ProgrammingLanguage,
        skills: ['PHP', 'Java', 'C']
      },
      {
        category: SkillCategory.Database,
        skills: ['MySQL', 'Oracle', 'MSSQL']
      },
      {
        category: SkillCategory.VersionControl,
        skills: ['Git', 'GitHub', 'GitLab', 'Bitbucket']
      },
      {
        category: SkillCategory.CMS,
        skills: ['WordPress']
      },
      {
        category: SkillCategory.ManagementTool,
        skills: ['Jira', 'Slack']
      }
    ];
  },

  // Return all skills without categories
  getWithOutCategory(): string[] {
    return [
      'Angular', 'SpringBoot', 'HTML', 'CSS', 'Javascript', 'TypeScript', 'Bootstrap',
      'PHP', 'Java', 'C', 'MySQL', 'Oracle', 'MSSQL', 'Git', 'GitHub', 'GitLab', 'Bitbucket',
      'WordPress', 'Jira', 'Slack'
    ];
  }
};
