interface Responsibility {
  title?: string;
  description?: string;
  details: string[];
}

interface Project {
  title: string;
  role: string;
  description?: string;
  responsibilities: Responsibility[];
}

interface Company {
  name: string;
  duration: string;
  role: string;
  description: string;
  projects: Project[];
}

export const Experience: { company: Company }[] = [
  {
    company: {
      name: 'F1Soft International Pvt. Ltd.',
      duration: '16th March 2025 – Present',
      role: 'Software Engineer',
      description: '',
      projects: []
    }
  },
  {
    company: {
      name: 'SB Solution Pvt Ltd',
      duration: '15th Nov 2022 - 12th Mar 2025',
      role: 'Software Developer',
      description:
        'Involved in the Loan Management System for commercial banks and microfinance institutions, ' +
        'improving efficiency and reliability. Collaborated with teams to ensure timely delivery while gaining ' +
        'expertise in Angular, TypeScript, JavaScript, and Spring Boot. Experienced in Agile methodologies and ' +
        'manual testing for quality assurance.',
      projects: [
        {
          title: 'Kumari Bank Project',
          role: 'Team Lead',
          description: 'Led a team in the development and enhancement of the Kumari Project.',
          responsibilities: [
            {
              title: 'Comprehensive Credit Administration System',
              description: 'Loan management and tracking.',
              details: [
                'Developed a system to manage and track loans effectively.',
                'Ensured the accuracy and timely updates of loan information.'
              ]
            },
            {
              title: 'CBS Integration for Customer Creation',
              description: 'Streamlined customer onboarding and data management.',
              details: [
                'Integrated customer creation module with CBS for seamless customer data management.',
                'Improved the efficiency of customer onboarding processes.'
              ]
            },
            {
              title: 'Role-Based Access Control (RBAC)',
              description: 'Role-based permissions for data security.',
              details: [
                'Implemented role-based permissions to secure sensitive data.',
                'Controlled access across different user types (Admin, RM, Legal).'
              ]
            },
            {
              title: 'Project Coordination',
              description: 'Ensured smooth delivery with cross-functional teams.',
              details: [
                'Coordinated with cross-functional teams to ensure timely project delivery.',
                'Met deadlines while maintaining high-quality standards.'
              ]
            }
          ]
        },
        {
          title: 'IME PAY',
          role: 'Developer',
          responsibilities: [
            {
              title: 'Loan Application Process',
              description: 'Developed a user-friendly loan application workflow.',
              details: [
                'Developed a loan application workflow with validation and error handling.',
                'Ensured seamless integration with backend services.'
              ]
            },
            {
              title: 'Admin Portal',
              description: 'Built an Admin Portal for loan management.',
              details: [
                'Developed an Admin Portal for loan management with role-based access control (RBAC).',
                'Implemented reporting features and real-time dashboards for monitoring loan status.'
              ]
            },
            {
              title: 'System Foundation',
              description: 'Core architecture with Angular.',
              details: [
                'Designed frontend with Angular 18, establishing the system’s core architecture.',
                'Integrated WebSocket for real-time updates and improved system responsiveness.',
                'Created responsive and dynamic dashboards using Angular Material and Bootstrap.'
              ]
            }
          ]
        },
        {
          title: 'Nabil Bank Project',
          role: 'Developer',
          responsibilities: [
            {
              title: 'Loan API Integration',
              description: 'Integrated Loan APIs with CBS.',
              details: [
                'Integrated Loan APIs using RestTemplate for seamless data exchange.',
                'Automated processes between the loan system and CBS.'
              ]
            },
            {
              title: 'Bug Fixing and Feature Enhancement',
              description: 'Enhanced functionality and stability.',
              details: [
                'Fixed critical bugs to improve system stability.',
                'Added new features to improve system functionality.'
              ]
            }
          ]
        },
        {
          title: 'Everest Bank Project',
          role: 'Developer',
          responsibilities: [
            {
              title: 'Document Indexing and Archiving',
              description: 'Fixed bugs for seamless document management.',
              details: [
                'Fixed bugs to ensure smooth document indexing and archiving.',
                'Ensured system reliability by fixing issues with document indexing.'
              ]
            },
            {
              title: 'Document Generation',
              description: 'Developed document generation module.',
              details: [
                'Developed a module for document generation.',
                'Ensured the accurate generation of necessary documents.'
              ]
            }
          ]
        }
      ]
    }
  },
  {
    company: {
      name: 'AADIM INNOVATION',
      duration: 'Apr 2022 – Oct 2022',
      role: 'Internship',
      description:
        'Gained hands-on experience in frontend technologies like Angular, TypeScript, and JavaScript. ' +
        'Learned and applied software development methodologies and techniques, which helped in building foundational skills in ' +
        'frontend development and debugging.',
      projects: [
        {
          title: 'Internship Projects',
          role: 'Intern',
          responsibilities: [
            {
              title: 'Frontend Development Experience',
              description: 'Gained hands-on experience with Angular, TypeScript, and JavaScript.',
              details: [
                'Worked with Angular, TypeScript, and JavaScript on real-world projects.',
                'Gained practical experience in frontend development and debugging.'
              ]
            },
            {
              title: 'Software Development Methodologies',
              description: 'Learned and applied development methodologies.',
              details: [
                'Learned agile methodologies and applied them to development tasks.',
                'Collaborated with team members to develop and deliver software features.'
              ]
            }
          ]
        }
      ]
    }
  }
];
