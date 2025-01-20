
import { Injectable } from '@angular/core';

export interface Skill {
  name: string;
  category?: string;
}

export interface Experience {
  title: string;
  company: string;
  location: string;
  period: string;
  description: string[];
  skillsDeveloped?: string[];
}

export interface ResumeData {
  personalInfo: {
    name: string;
    title: string;
    email: string;
    phone: string;
    location: string;
    linkedin: string;
    profileImage: string;
    summary: string;
  };
  skills: Skill[];
  experience: Experience[];
}

@Injectable({
  providedIn: 'root'
})
export class ResumeDataService {
  private resumeData: ResumeData = {
    personalInfo: {
      name: 'Sanjay Khatri',
      title: 'Software Developer',
      email: 'khatrisanjay804@gmail.com',
      phone: '9861494803',
      location: 'Kathmandu, Bāgmatī',
      linkedin: 'linkedin.com/in/khatri-sanjay',
      profileImage: 'https://media.licdn.com/dms/image/v2/D5603AQE6gzXAs0m3GA/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1708078794359?e=1740614400&v=beta&t=hk3W8ZLT1-QJrOKKBlwW2q_xbDwo83fONFeIzR6OOPU',
      summary: 'Namaste, I am Sanjay Khatri, a highly motivated and results-oriented developer with over one year of experience in Java and Angular. Eager to contribute my strong technical skills, problem-solving ability, and collaborative spirit to a dynamic team. I have a solid understanding of both front-end and back-end development, proficient in Angular for building interactive and user-friendly interfaces, and Java for constructing robust and scalable backend systems.'
    },
    skills: [
      {name: 'Angular CLI'},
      {name: 'Angular'},
      {name: 'Spring Boot'},
      {name: 'JavaScript'},
      {name: 'TypeScript'},
      {name: 'Git'},
      {name: 'HTML'},
      {name: 'CSS'},
      {name: 'PHP'},
      {name: 'C Programming'},
      {name: 'Core Java'},
      {name: 'Microsoft SQL Server'}
    ],
    experience: [
      {
        title: 'Software Developer',
        company: 'SB Solutions Pvt. Ltd.',
        location: 'Kathmandu, Nepal',
        period: 'Nov 2022 - Present',
        description: [
          'Engaged in the enhancement of the "Loan Management System," optimizing loan processes for various commercial banks.',
          'Collaborated with cross-functional teams to enhance project efficiency and meet delivery timelines.'
        ],
        skillsDeveloped: ['Angular', 'TypeScript', 'JavaScript', 'Java Spring Boot', 'Agile methodology', 'Testing', 'Debugging']
      },
      {
        title: 'Student Internship',
        company: 'Aadim Innovation',
        location: 'Kathmandu, Nepal',
        period: 'Apr 2022 - Oct 2022',
        description: [
          'During my internship at Aadim Innovation, I gained foundational knowledge in Angular, TypeScript, JavaScript, and various software development methodologies.'
        ],
        skillsDeveloped: ['Angular', 'JavaScript', 'Testing techniques']
      }
    ]
  };

  getResumeData(): ResumeData {
    return this.resumeData;
  }
}
