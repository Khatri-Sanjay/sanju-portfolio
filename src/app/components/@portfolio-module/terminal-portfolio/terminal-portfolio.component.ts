import {
  Component,
  ElementRef,
  ViewChild,
  OnInit,
  AfterViewChecked,
  HostListener,
} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {DatePipe, KeyValuePipe, NgForOf, NgIf, NgStyle} from '@angular/common';
import {
  animate,
  style,
  transition,
  trigger,
  AnimationTriggerMetadata,
} from '@angular/animations';
import {LineBreakPipe} from '../../../@core/pipe/line-break.pipe';
import {LocalStorageUtil} from '../../../@core/utils/local-storage-utils';

// Interfaces and Types
interface ThemeConfig {
  background: string;
  text: string;
  promptColor: string;
  borderColor: string;
  accentColor: string;
}

enum OutputType {
  Output = 'output',
  Command = 'command',
  System = 'system',
  Error = 'error',
  Success = 'success',
}

interface OutputLine {
  text: string;
  type: OutputType;
  timestamp: Date;
  id: number;
}

// Animation Triggers
const animations: AnimationTriggerMetadata[] = [
  trigger('lineAnimation', [
    transition(':enter', [
      style({opacity: 0, transform: 'translateY(-10px)'}),
      animate('300ms ease-out', style({opacity: 1, transform: 'translateY(0)'})),
    ]),
  ]),
  trigger('slideDown', [
    transition(':enter', [
      style({opacity: 0, transform: 'translateY(-10px)'}),
      animate('200ms ease-out', style({opacity: 1, transform: 'translateY(0)'})),
    ]),
    transition(':leave', [
      animate('200ms ease-in', style({opacity: 0, transform: 'translateY(-10px)'})),
    ]),
  ]),
  trigger('slideUp', [
    transition(':enter', [
      style({opacity: 0, transform: 'translateY(10px)'}),
      animate('200ms ease-out', style({opacity: 1, transform: 'translateY(0)'})),
    ]),
    transition(':leave', [
      animate('200ms ease-in', style({opacity: 0, transform: 'translateY(10px)'})),
    ]),
  ]),
];

@Component({
  selector: 'app-terminal-portfolio',
  templateUrl: './terminal-portfolio.component.html',
  styleUrl: './terminal-portfolio.component.scss',
  standalone: true,
  imports: [FormsModule, NgForOf, NgStyle, NgIf, DatePipe, KeyValuePipe, LineBreakPipe],
  animations,
})
export class TerminalPortfolioComponent implements OnInit, AfterViewChecked {
  @ViewChild('outputContainer') private outputContainer!: ElementRef<HTMLDivElement>;
  @ViewChild('commandInput') private commandInput!: ElementRef<HTMLInputElement>;

  // Theme Configuration
  readonly themes: Record<string, ThemeConfig> = {
    dark: {
      background: '#1e1e1e',
      text: '#c5c8c6',
      promptColor: '#33cc33',
      borderColor: '#333',
      accentColor: '#0077cc',
    },
    synthwave: {
      background: '#2b213a',
      text: '#ff71ce',
      promptColor: '#05ffa1',
      borderColor: '#b967ff',
      accentColor: '#01cdfe',
    },
    github: {
      background: '#0d1117',
      text: '#c9d1d9',
      promptColor: '#58a6ff',
      borderColor: '#30363d',
      accentColor: '#238636',
    },
    monokai: {
      background: '#272822',
      text: '#f8f8f2',
      promptColor: '#a6e22e',
      borderColor: '#49483e',
      accentColor: '#fd971f',
    },
    light: {
      background: '#ffffff',
      text: '#333333',
      promptColor: '#0077cc',
      borderColor: '#cccccc',
      accentColor: '#28a745',
    },
  };

  // Component State
  username = 'guest';
  currentTheme = 'dark';
  currentInput = '';
  outputLines: OutputLine[] = [];
  commandHistory: string[] = [];
  historyIndex = -1;
  showThemeMenu = false;
  showSuggestions = false;
  suggestions: string[] = [];
  activeSuggestionIndex = -1;

  readonly commands = [
    'help',
    'about',
    'projects',
    'skills',
    'contact',
    'theme',
    'clear',
    'date',
    'whoami',
    'social',
    'education',
    'experience',
    'achievements',
  ] as const;

  ngOnInit(): void {
    this.initializeTerminal();
  }

  ngAfterViewChecked(): void {
    // this.scrollToBottom();
  }

  @HostListener('document:click', ['$event'])
  handleClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.theme-toggle')) {
      this.showThemeMenu = false;
    }
    this.focusInput();
  }

  @HostListener('document:keydown', ['$event'])
  handleGlobalKeydown(event: KeyboardEvent): void {
    if (event.ctrlKey && event.key === 'l') {
      event.preventDefault();
      this.clearOutput();
    }
  }

  handleKeydown(event: KeyboardEvent): void {
    switch (event.key) {
      case 'Enter':
        this.executeCommand();
        break;
      case 'ArrowUp':
        event.preventDefault();
        this.navigateHistory('up');
        break;
      case 'ArrowDown':
        event.preventDefault();
        this.navigateHistory('down');
        break;
      case 'Tab':
        event.preventDefault();
        this.handleTabCompletion();
        break;
      case 'Escape':
        this.showSuggestions = false;
        break;
      default:
        this.updateSuggestions();
    }
  }

  navigateHistory(direction: 'up' | 'down'): void {
    if (direction === 'up' && this.historyIndex < this.commandHistory.length - 1) {
      this.historyIndex++;
      this.currentInput = this.commandHistory[this.historyIndex];
    } else if (direction === 'down' && this.historyIndex > -1) {
      this.historyIndex--;
      this.currentInput = this.historyIndex === -1 ? '' : this.commandHistory[this.historyIndex];
    }
  }

  private handleTabCompletion(): void {
    if (this.suggestions.length === 1) {
      this.currentInput = this.suggestions[0];
      this.showSuggestions = false;
    } else if (this.suggestions.length > 1) {
      this.activeSuggestionIndex = (this.activeSuggestionIndex + 1) % this.suggestions.length;
      this.currentInput = this.suggestions[this.activeSuggestionIndex];
    }
  }

  private updateSuggestions(): void {
    if (!this.currentInput) {
      this.showSuggestions = false;
      return;
    }

    this.suggestions = this.commands.filter(cmd =>
      cmd.startsWith(this.currentInput.toLowerCase())
    );
    this.showSuggestions = this.suggestions.length > 0;
    this.activeSuggestionIndex = -1;
  }

  getThemeStyles(): Record<string, string> {
    const theme = this.themes[this.currentTheme];
    return {
      'background-color': theme.background,
      'color': theme.text,
      'border-color': theme.borderColor,
    };
  }

  getLineStyles(line: OutputLine): Record<string, string> {
    const theme = this.themes[this.currentTheme];
    switch (line.type) {
      case OutputType.Error:
        return {color: '#ff5f5f'};
      case OutputType.Command:
        return {color: theme.promptColor};
      case OutputType.System:
        return {color: theme.accentColor};
      case OutputType.Success:
        return {color: '#28a745'};
      default:
        return {color: theme.text};
    }
  }

  toggleThemeMenu(): void {
    this.showThemeMenu = !this.showThemeMenu;
  }

  changeTheme(theme: string): void {
    if (this.themes[theme]) {
      this.currentTheme = theme;
      this.saveTheme();
      this.addOutput(`Theme changed to ${theme}`, OutputType.Success);
      this.showThemeMenu = false;
    }
  }

  // Command Display Methods
  private displayHelp(): void {
    const helpText = `
      Available commands:
      ------------------
      help        : Show this help message
      about       : Display information about me
      projects    : View my project portfolio
      skills      : List my technical skills
      contact     : Show contact information
      social      : Display social media links
      education   : Show educational background
      experience  : Display work experience
      achievements: List notable achievements
      theme       : Change terminal theme (usage: theme <name>)
      clear       : Clear terminal screen
      date        : Show current date and time
      whoami      : Display current user info

      Tips:
      - Use Tab for command completion
      - Up/Down arrows for command history
      - Ctrl+L to clear screen`;
    this.addOutput(helpText, OutputType.Output);
  }

  private displayAbout(): void {
    const aboutText = `
      About Me:
      ---------
      I'm a Full Stack Developer passionate about creating innovative web solutions.
      Currently working on modern web applications using Angular, Java.

      Core strengths:
      • Frontend Development (Angular, TypeScript, Bootstrap)
      • Backend Development (Java)
      • Database Design (MySql, MSSQL, Oracle)

      Always learning and exploring new technologies to build better solutions!`;
    this.addOutput(aboutText, OutputType.Output);
  }

  private displayProjects(): void {
    const projectsText = `
      Project Portfolio:
      -----------------
      1. Terminal Portfolio Website
         • Interactive terminal-style portfolio built with Angular
         • Features: Theme switching, command history, tab completion
         • Technologies: Angular, TypeScript, CSS Animations

      2. E-Commerce Platform
         • Full-stack e-commerce solution with real-time inventory
         • Features: Admin dashboard, analytics
         • Technologies: HTML, CSS, JavaScript, PHP
    `;
    this.addOutput(projectsText, OutputType.Output);
  }

  private displaySkills(): void {
    const skillsText = `
      Technical Skills:
      ---------------
      Frontend:
      • Angular (2+ through latest)
      • TypeScript/JavaScript
      • HTML5/CSS3/SASS
      • Material Design/ Bootstrap

      Backend:
      • Java
      • Spring Boot
      • RESTful APIs

      Database:
      • MySql
      • MSSQL
      • Oracle
      • Firebase

      DevOps & Tools:
      • Git/GitHub/GitLab
      • Bitbucket
    `;
    this.addOutput(skillsText, OutputType.Output);
  }

  private displayContact(): void {
    const contactText = `
      Contact Information:
      ------------------
      📧 Email: khatrisanjay804@gmail.com
      🔗 LinkedIn: linkedin.com/in/khatri-sanjay/
      📱 Phone: +977-9861494803
      🌐 Website: khatrisanjay.com.np

      Feel free to reach out for collaborations or opportunities!
    `;
    this.addOutput(contactText, OutputType.Output);
  }

  private displaySocial(): void {
    const socialText = `
      Social Media Links:
      -----------------
      • GitHub: github.com/Khatri-Sanjay
      • LinkedIn: linkedin.com/in/khatri-sanjay
      • FaceBook: 'https://www.facebook.com/sanjaykhatri180410',
      • Instagram: 'https://www.instagram.com/_sanjay.khatri/',
    `;
    this.addOutput(socialText, OutputType.Output);
  }

  private displayEducation(): void {
    const educationText = `
      Education:
      ---------
      🎓 Bachelor in Computer Application
         • Tribhuvan University (TU)
         • Graduation Year: 2024
         • College: Aadim National College
         • Location: Chabahil, Kathmandu, Nepal

      🎓 Higher Secondary Education in Computer Science
         • National Education Board
         • Graduation Year: 2019
         • College: Nobel Academy Secondary School
         • Location: New-Baneshwor, Kathmandu, Nepal

      🎓 Secondary Education
         • Global Academy English School
         • Graduation Year: 2017
         • Location: Bhaktapur, Nepal
    `;
    this.addOutput(educationText, OutputType.Output);
  }

  private displayExperience(): void {
    const experienceText = `
      Work Experience:
      ----------------
      Software Developer | SB Solutions Pvt. Ltd. (Kathmandu, Nepal)
      Nov 2022 - Present
      • Engaged in the enhancement of the "Loan Management System," optimizing loan processes for various commercial banks.
      • Collaborated with cross-functional teams to enhance project efficiency and meet delivery timelines.
      • Possess proficiency in Angular, TypeScript, JavaScript, and the Java Spring Boot framework.
      • Applied diverse software development life cycle methodologies, with a particular emphasis on Agile Methodologies.
      • Specialized in manual testing, including the creation and execution of test cases.

      Software Developer Internship | Aadim Innovation (Chabahil, Kathmandu, Nepal)
      Nov 2022 - Present
      • Gained foundational knowledge in Angular, TypeScript, JavaScript, and various software development methodologies.
      • Integrated REST APIs to enhance data connectivity and communication.
      • Developed foundational skills in Angular, TypeScript, and JavaScript, providing a basis for practical application in development projects.
    `;
    this.addOutput(experienceText, OutputType.Output);
  }

  private displayAchievements(): void {
    const achievementsText = `
      Notable Achievements:
      ------------------
      • Coming Soon
    `;
    this.addOutput(achievementsText, OutputType.Output);
  }

  private displayDate(): void {
    const now = new Date();
    const dateText = now.toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZoneName: 'short'
    });
    this.addOutput(`Current date and time: ${dateText}`, OutputType.Output);
  }

  private displayWhoami(): void {
    this.addOutput(`Current user: ${this.username}`, OutputType.Output);
  }

  private handleThemeCommand(args: string[]): void {
    if (!args.length) {
      this.addOutput(
        `Available themes: ${Object.keys(this.themes).join(', ')}`,
        OutputType.Output
      );
      return;
    }

    const newTheme = args[0];
    if (this.themes[newTheme]) {
      this.currentTheme = newTheme;
      this.saveTheme();
      this.addOutput(`Theme changed to ${newTheme}`, OutputType.Success);
    } else {
      this.addOutput(
        `Theme '${newTheme}' not found. Available themes: ${Object.keys(this.themes).join(', ')}`,
        OutputType.Error
      );
    }
  }

  private initializeTerminal(): void {
    this.loadTheme();
    this.addOutput('Welcome to my Sanjay terminal portfolio! Type "help" to see available commands.', OutputType.System);
    this.focusInput();
    this.displayWelcome();
  }

  private displayWelcome(): void {
    const welcomeText = `
      <pre class="ascii-art" style="white-space: pre-wrap;">
        __        __   _                            _____
        \\ \\      / /__| | ___ ___  _ __ ___   ___  |_   _|__
         \\ \\ /\\ / / _ \\ |/ __/ _ \\| '_ \` _ \\ / _ \\   | |/ _ \\
          \\ V  V /  __/ | (_| (_) | | | | | |  __/   | | (_) |
         __\\_/\\_/ \\___|_|\\___\\___/|_| |_|_|_|\\___|   |_|\\___/ _             _
        / ___|  __ _ _ __  (_)_   _  |_   _|__ _ __ _ __ ___ (_)_ __   __ _| |
        \\___ \\ / _\` | '_ \\ | | | | |   | |/ _ \\ '__| '_ \` _ \\| | '_ \\ / _\` | |
         ___) | (_| | | | || | |_| |   | |  __/ |  | | | | | | | | | | (_| | |
        |____/ \\__,_|_| |_|/ |\\__,_|   |_|\\___|_|  |_| |_| |_|_|_| |_|\\__,_|_|
                         |__/

      </pre>
                      Welcome to Sanjay Khatri's Portfolio!
      ------------------------------------------------------------
      Type "help"     →  See available commands.
      Type "about"    →  Learn more about me.
      Type "projects" →  Explore my work.
      Type "skills"   →  Discover my expertise.
      ------------------------------------------------------------
    `;
    this.addOutput(welcomeText, OutputType.Output);
  }



  private executeCommand(): void {
    if (!this.currentInput.trim()) return;

    const command = this.currentInput.trim().toLowerCase();
    this.commandHistory.unshift(command);
    this.addOutput(this.currentInput, OutputType.Command);

    const [cmd, ...args] = command.split(' ');

    const commandHandler = this.getCommandHandler(cmd);
    if (commandHandler) {
      commandHandler(args);
    } else {
      this.addOutput(`Command not found: ${cmd}. Type "help" for available commands.`, OutputType.Error);
    }

    this.currentInput = '';
    this.historyIndex = -1;
    this.showSuggestions = false;
    this.focusInput();
    this.scrollToBottom();
  }

  private getCommandHandler(cmd: string): ((args: string[]) => void) | null {
    const handlers: Record<string, (args: string[]) => void> = {
      help: () => this.displayHelp(),
      about: () => this.displayAbout(),
      projects: () => this.displayProjects(),
      skills: () => this.displaySkills(),
      contact: () => this.displayContact(),
      theme: (args) => this.handleThemeCommand(args),
      clear: () => this.clearOutput(),
      date: () => this.displayDate(),
      whoami: () => this.displayWhoami(),
      social: () => this.displaySocial(),
      education: () => this.displayEducation(),
      experience: () => this.displayExperience(),
      achievements: () => this.displayAchievements(),
    };

    return handlers[cmd] || null;
  }

  private addOutput(text: string, type: OutputType): void {
    this.outputLines.push({
      text,
      type,
      timestamp: new Date(),
      id: this.outputLines.length,
    });
  }

  private clearOutput(): void {
    this.outputLines = [];
    this.addOutput('Terminal cleared.', OutputType.System);
  }

  protected focusInput(): void {
    if (this.commandInput) {
      this.commandInput.nativeElement.focus();
    }
  }

  private scrollToBottom(): void {
    if (this.outputContainer) {
      const element = this.outputContainer.nativeElement;
      element.scrollTop = element.scrollHeight;
    }
  }

  private loadTheme(): void {
    const savedTheme = LocalStorageUtil.getStorage().terminal_theme;
    if (savedTheme && this.themes[savedTheme]) {
      this.currentTheme = savedTheme;
    }
  }

  private saveTheme(): void {
    const storage =  LocalStorageUtil.getStorage();
    storage.terminal_theme = this.currentTheme;
    LocalStorageUtil.setStorage(storage);
  }
}
