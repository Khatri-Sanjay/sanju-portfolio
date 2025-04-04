import {Component, OnInit} from '@angular/core';
import { NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Tool {
  id: number;
  name: string;
  shortDescription: string;
  description: string;
  icon: string;
  figureType: 'chart' | 'graph' | 'diagram' | 'stats';
  mainImage?: string;
  otherImages?: string[];
  code?: string;
  demo?: string;
  features: string[];
  technologies: string[];
  category: 'design' | 'development' | 'analytics' | 'other';
}

@Component({
  selector: 'app-tools',
  standalone: true,
  templateUrl: './tools.component.html',
  imports: [
    NgClass,
    FormsModule
  ],
  styleUrls: ['./tools.component.scss']
})
export class ToolsComponent implements OnInit {
  tools: Tool[] = [];
  filteredTools: Tool[] = [];
  selectedTool: Tool | null = null;
  searchQuery: string = '';
  activeCategory: 'all' | 'design' | 'development' | 'analytics' | 'other' = 'all';
  isLoading: boolean = true;

  currentImageIndex: number = 0;

  combinedImagesList: string[] = [];

  constructor() { }

  ngOnInit(): void {
    setTimeout(() => {
      this.tools = [
        {
          id: 1,
          name: 'Drawing Tools',
          shortDescription: 'This project is a versatile design tool offering multiple drawing modes,' +
            ' including Brush, Eraser, Shape, and Text tools. With customizable shapes, text, and background ' +
            'colors, it provides precise control with grid displays and undo/redo functionality. It also supports ' +
            'touch input and allows easy image export in various formats for sharing or further use.',
          description: 'This design tool provides a complete suite of features to enhance your creative workflow.' +
            ' It includes multiple drawing modes, offering flexibility with tools like Brush, Eraser, Shape, and Text. ' +
            'Users can easily create custom shapes such as lines, rectangles, circles, and triangles, each with editable ' +
            'fill options. The Text Insertion feature allows for fine-tuning font styles, sizes, and colors to suit specific ' +
            'design needs. To ensure precision, an adjustable grid is available, helping users align elements perfectly. ' +
            'Background Color Customization allows the canvas to be tailored to fit any project’s theme. ' +
            'The Undo/Redo Functionality ensures effortless corrections, while Touch Support provides a seamless ' +
            'experience on mobile devices. Lastly, the tool allows for easy image export in multiple formats, making ' +
            'sharing or further editing simple. Whether you’re creating a professional design or working on a personal project, ' +
            'this tool combines flexibility and precision to help bring your ideas to life.',
          icon: 'bi bi-palette',
          figureType: 'diagram',
          mainImage: 'assets/image/tools/drawing-tools.png',
          otherImages: [
            'assets/image/tools/drawing-tools-1.png',
            'assets/image/tools/drawing-tools-2.png',
            'assets/image/tools/drawing-tools-3.png',
            'assets/image/tools/drawing-tools-4.png',
          ],
          code: '/tools/drawing',
          demo: '/tools/drawing',
          features: [
            "<b>Multiple Drawing Modes:</b> Brush, Eraser, Shape, and Text tools for versatile design.",
            "<b>Shape Tools:</b> Create lines, rectangles, circles, and triangles with customizable fill options.",
            "<b>Text Insertion:</b> Customize font style, size, and color to suit your needs.",
            "<b>Grid Display:</b> Adjustable grid size for precision and alignment.",
            "<b>Background Color Customization:</b> Personalize your canvas background to fit your project.",
            "<b>Undo/Redo Functionality:</b> Quickly adjust your designs with keyboard shortcuts.",
            "<b>Touch Support:</b> Smooth drawing experience on mobile devices.",
            "<b>Image Export:</b> Export your creations in various formats for easy sharing or use."
          ],
          technologies: ['Canvas', 'SVG', 'Angular', 'TypeScript'],
          category: 'design'
        },
        {
          id: 2,
          name: 'To-Do Management App',
          shortDescription: 'A task management tool built with Angular and CDK, offering intuitive task organization by categories (To Do, In Progress, Done) and priorities (Low, Medium, High). It integrates with localStorage to persist data, so your tasks are always saved across sessions.',
          description: 'This To-Do Management App allows you to effectively organize your tasks with different categories like "To Do", "In Progress", and "Done". You can assign each task a priority level: "Low", "Medium", or "High". The app uses Angular and the Component Dev Kit (CDK) to provide a seamless, interactive experience. All data is stored in localStorage, ensuring that your tasks are available even after you refresh or restart the app. Features like drag-and-drop, task editing, and task creation make managing your workflow more efficient.',
          icon: 'bi bi-check-circle',
          figureType: 'graph',
          mainImage: 'assets/image/to-do/todo.png',
          otherImages: [
            'assets/image/to-do/todo-1.png',
            'assets/image/to-do/todo-2.png'
          ],
          code: '/tools/todo',
          demo: '/tools/todo',
          features: [
            "<b>Task Categories:</b> Organize tasks into 'To Do', 'In Progress', and 'Done'.",
            "<b>Priority Levels:</b> Assign tasks priorities like Low, Medium, or High.",
            "<b>Persistent Data Storage:</b> LocalStorage ensures your tasks are saved and available across sessions.",
            "<b>Task Creation and Editing:</b> Easily add, edit, and manage your tasks.",
            "<b>Drag-and-Drop:</b> Reorganize tasks by dragging and dropping between categories.",
            "<b>Filter by Priority:</b> Sort tasks by priority (Low, Medium, High).",
            "<b>Responsive Design:</b> Fully optimized for desktop and mobile use."
          ],
          technologies: ['Angular', 'CDK', 'TypeScript', 'LocalStorage'],
          category: 'other'
        },
        // {
        //   id: 2,
        //   name: 'Data Visualizer',
        //   shortDescription: 'Transform data into visual insights',
        //   description: 'Turn complex datasets into beautiful visualizations and gain actionable insights. Supports various chart types and data sources with easy customization options.',
        //   icon: 'bi bi-bar-chart',
        //   figureType: 'chart',
        //   features: [
        //     'Interactive charts and graphs',
        //     'Data filtering and sorting',
        //     'CSV/JSON import',
        //     'Dashboard creation'
        //   ],
        //   technologies: ['D3.js', 'Chart.js', 'Angular', 'RxJS'],
        //   code: 'https://github.com/yourusername/data-visualizer',
        //   demo: 'https://demo.yourdomain.com/data-visualizer',
        //   category: 'analytics'
        // },
        // {
        //   id: 3,
        //   name: 'Network Mapper',
        //   shortDescription: 'Map your network connections',
        //   description: 'Visualize network connections and identify performance bottlenecks with ease. Ideal for system administrators and DevOps professionals monitoring complex infrastructures.',
        //   icon: 'bi bi-diagram-3',
        //   figureType: 'diagram',
        //   mainImage: 'assets/images/tools/network-mapper.png',
        //   code: 'https://github.com/yourusername/network-mapper',
        //   demo: 'https://demo.yourdomain.com/network-mapper',
        //   features: [
        //     'Real-time network scanning',
        //     'Performance bottleneck detection',
        //     'Historical data tracking',
        //     'Alert system for issues'
        //   ],
        //   technologies: ['Angular', 'Node.js', 'Socket.io', 'D3.js'],
        //   category: 'development'
        // },
        // {
        //   id: 4,
        //   name: 'AI Assistant',
        //   shortDescription: 'Your intelligent coding companion',
        //   description: 'Get intelligent code suggestions and assistance powered by machine learning. Helps you write better code faster with context-aware recommendations.',
        //   icon: 'bi bi-robot',
        //   figureType: 'graph',
        //   code: 'https://github.com/yourusername/ai-assistant',
        //   demo: 'https://demo.yourdomain.com/ai-assistant',
        //   features: [
        //     'Code completion suggestions',
        //     'Bug detection',
        //     'Code refactoring recommendations',
        //     'Natural language to code conversion'
        //   ],
        //   technologies: ['TensorFlow.js', 'Angular', 'TypeScript', 'Web Workers'],
        //   category: 'development'
        // },
        // {
        //   id: 5,
        //   name: 'Security Scanner',
        //   shortDescription: 'Protect your applications',
        //   description: 'Detect vulnerabilities and potential security threats in your codebase. Regular scans help maintain security standards and prevent common attack vectors.',
        //   icon: 'bi bi-shield-check',
        //   figureType: 'stats',
        //   mainImage: 'assets/images/tools/security-scanner.png',
        //   code: 'https://github.com/yourusername/security-scanner',
        //   demo: 'https://demo.yourdomain.com/security-scanner',
        //   features: [
        //     'Vulnerability detection',
        //     'Dependency checking',
        //     'Security report generation',
        //     'Integration with CI/CD pipelines'
        //   ],
        //   technologies: ['Angular', 'Node.js', 'Express', 'MongoDB'],
        //   category: 'development'
        // },
        // {
        //   id: 6,
        //   name: 'UI Component Library',
        //   shortDescription: 'Ready-to-use UI components',
        //   description: 'A comprehensive library of beautiful UI components for modern web applications. Boost your development process with pre-built, customizable components.',
        //   icon: 'bi bi-grid-3x3-gap',
        //   figureType: 'diagram',
        //   code: 'https://github.com/yourusername/ui-components',
        //   demo: 'https://demo.yourdomain.com/ui-components',
        //   features: [
        //     'Responsive design',
        //     'Accessibility compliant',
        //     'Themeable components',
        //     'Comprehensive documentation'
        //   ],
        //   technologies: ['Angular', 'TypeScript', 'SCSS', 'Storybook'],
        //   category: 'design'
        // }
      ];

      this.filteredTools = [...this.tools];
      this.isLoading = false;
    }, 500);
  }

  hasValidImage(tool: Tool): boolean {
    return !!tool.mainImage && tool.mainImage.trim().length > 0;
  }

  searchTools(): void {
    this.applyFilters();
  }

  setCategory(category: 'all' | 'design' | 'development' | 'analytics' | 'other'): void {
    this.activeCategory = category;
    this.applyFilters();
  }

  private applyFilters(): void {
    this.filteredTools = this.tools.filter(tool => {
      const categoryMatch = this.activeCategory === 'all' || tool.category === this.activeCategory;

      const query = this.searchQuery.toLowerCase().trim();
      const searchMatch = query === '' ||
        tool.name.toLowerCase().includes(query) ||
        tool.shortDescription.toLowerCase().includes(query) ||
        tool.description.toLowerCase().includes(query);

      return categoryMatch && searchMatch;
    });
  }

  openToolDetails(tool: Tool): void {
    this.selectedTool = tool;
    this.currentImageIndex = 0;
    this.updateCombinedImages();
  }

  closeToolDetails(): void {
    this.selectedTool = null;
  }

  updateCombinedImages() {
    this.combinedImagesList = [
      this.selectedTool?.mainImage || '',
      ...(this.selectedTool?.otherImages || [])
    ];
  }

  prevImage() {
    if (this.currentImageIndex > 0) {
      this.currentImageIndex--;
    } else {
      this.currentImageIndex = this.combinedImagesList.length - 1;
    }
  }

  nextImage() {
    if (this.currentImageIndex < this.combinedImagesList.length - 1) {
      this.currentImageIndex++;
    } else {
      this.currentImageIndex = 0;
    }
  }

  navigateToDemo(url: string, event?: Event): void {
    if (event) {
      event.stopPropagation();
    }
    window.open(url, '_blank');
  }

}
