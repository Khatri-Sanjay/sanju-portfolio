import { Routes } from '@angular/router';

export const PortfolioRoutes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'terminal',
    loadComponent: () =>
      import('../@portfolio-module/terminal-portfolio/terminal-portfolio.component').then(
        (m) => m.TerminalPortfolioComponent
      ),
    data: {
      title: 'Terminal',
      description: 'Welcome to the Terminal Portfolio',
    },
  },
  {
    path: '',
    loadComponent: () =>
      import('../@portfolio-module/portfolio/portfolio.component').then(
        (m) => m.PortfolioComponent
      ),
    children: [
      {
        path: 'home',
        loadComponent: () =>
          import('../@portfolio-module/portfolio/home/home.component').then(
            (m) => m.HomeComponent
          ),
        data: {
          title: 'Home',
          description: 'Welcome to the Home page of my portfolio',
        },
      },
      {
        path: 'resume',
        loadComponent: () =>
          import('../@portfolio-module/portfolio/resume/resume.component').then(
            (m) => m.ResumeComponent
          ),
        data: {
          title: 'Resume',
          description: 'View my professional resume and career journey',
        },
      },
      {
        path: 'projects',
        loadComponent: () =>
          import('./portfolio/project/project.component').then(
            (m) => m.ProjectComponent
          ),
        data: {
          title: 'Projects',
          description: 'Explore my past and ongoing projects',
        },
      },
      {
        path: 'contact',
        loadComponent: () =>
          import('./portfolio/contact-me/contact-me.component').then(
            (m) => m.ContactMeComponent
          ),
        data: {
          title: 'Contact Me',
          description: 'Get in touch with me for collaborations or inquiries',
        },
      },
      {
        path: 'about',
        loadComponent: () =>
          import('./portfolio/about-me/about-me.component').then(
            (m) => m.AboutMeComponent
          ),
        data: {
          title: 'About Me',
          description: 'Learn more about me, my skills, and my background',
        },
      },
      {
        path: 'skills',
        loadComponent: () =>
          import('./portfolio/skills/skills.component').then(
            (m) => m.SkillsComponent
          ),
        data: {
          title: 'Skills',
          description: 'Discover my technical and professional skill set',
        },
      },
      {
        path: 'blogs',
        loadComponent: () =>
          import('./portfolio/blog-list/blog-list.component').then(
            (m) => m.BlogListComponent
          ),
        data: {
          title: 'Blogs',
          description: 'Read my blog posts on various topics',
        },
      },
      // {
      //   path: 'post/:postId',
      //   loadComponent: () =>
      //     import('./portfolio/blog-list/blog-post/blog-post.component').then(
      //       (m) => m.BlogPostComponent
      //     ),
      //   data: {
      //     title: 'Blog Post',
      //     description: 'View details of a specific blog post',
      //   },
      // },
    ],
  },
];
