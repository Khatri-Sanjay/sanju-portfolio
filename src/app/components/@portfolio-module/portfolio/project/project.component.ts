import {Component} from '@angular/core';
import {Projects} from '../../../../@core/data/projects';

interface Project {
  projectName: string;
  description: string;
  image: string;
  link: string;
  languageUsed: string[];
  demoLink?: string;
  completionDate?: string;
}

@Component({
  selector: 'app-project',
  imports: [],
  templateUrl: './project.component.html',
  standalone: true,
  styleUrl: './project.component.scss',
})
export class ProjectComponent {
  projects = Projects;

  filteredProjects: Project[] = this.projects;
  selectedTech: string = '';
  searchTerm: string = '';

  getTotalTechnologies(): number {
    const uniqueTech = new Set(this.projects.flatMap(p => p.languageUsed));
    return uniqueTech.size;
  }

  getAllTechnologies(): string[] {
    const uniqueTech = new Set(this.projects.flatMap(p => p.languageUsed));
    return Array.from(uniqueTech).sort();
  }

  filterProjects(event: Event): void {
    const searchTerm = (event.target as HTMLInputElement).value.toLowerCase();
    this.searchTerm = searchTerm;
    this.applyFilters();
  }

  filterByTechnology(tech: string): void {
    this.selectedTech = this.selectedTech === tech ? '' : tech;
    this.applyFilters();
  }

  private applyFilters(): void {
    this.filteredProjects = this.projects.filter(project => {
      const matchesSearch = project.projectName.toLowerCase().includes(this.searchTerm) ||
        project.description.toLowerCase().includes(this.searchTerm);
      const matchesTech = !this.selectedTech || project.languageUsed.includes(this.selectedTech);
      return matchesSearch && matchesTech;
    });
  }
}
