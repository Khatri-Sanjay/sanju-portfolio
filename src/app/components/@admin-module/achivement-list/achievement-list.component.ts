import { Component, OnInit, OnDestroy } from '@angular/core';
import {FormControl, FormGroup, Validators, ReactiveFormsModule, FormsModule} from '@angular/forms';
import {
  Firestore,
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  onSnapshot,
  DocumentData,
  DocumentReference
} from '@angular/fire/firestore';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatChipsModule } from '@angular/material/chips';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { Subscription } from 'rxjs';
import CryptoJS from 'crypto-js';
import {BaseChartDirective} from 'ng2-charts';

interface Achievement {
  id?: string;
  title: string;
  description: string;
  category: string;
  targetDate: Date;
  completed: boolean;
  progress: number;
  priority: string;
  milestones: Milestone[];
  createdAt: Date;
  updatedAt: Date;
}

interface Milestone {
  description: string;
  completed: boolean;
}

interface ChartData {
  labels: string[];
  datasets: {
    data: number[];
    backgroundColor: string[];
    hoverBackgroundColor: string[];
  }[];
}

interface MotivationalQuote {
  text: string;
  author: string;
}

@Component({
  selector: 'app-achievement-list',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatProgressBarModule,
    MatChipsModule,
    MatExpansionModule,
    MatSnackBarModule,
    MatDialogModule,
    MatCheckboxModule,
    MatButtonToggleModule,
    BaseChartDirective,
    FormsModule,
  ],
  templateUrl: 'achievement-list.component.html',
  styleUrl: 'achievement-list.component.scss'
})
export class LifeAchievementsComponent implements OnInit, OnDestroy {
  // Form group for adding achievements
  achievementForm = new FormGroup({
    title: new FormControl('', [Validators.required]),
    description: new FormControl(''),
    category: new FormControl('Personal', [Validators.required]),
    targetDate: new FormControl<Date>(new Date()),
    priority: new FormControl('medium', [Validators.required])
  });

  // Achievement data
  achievements: Achievement[] = [];
  filteredAchievements: Achievement[] = [];

  // Filter and sort options
  filterCategory: string = 'all';
  filterStatus: string = 'all';
  sortBy: string = 'createdAt';

  // Category list
  categories: string[] = [
    'Personal',
    'Career',
    'Health',
    'Education',
    'Finance',
    'Travel',
    'Family',
    'Hobbies'
  ];

  // Chart data
  categoryChartData: ChartData = {
    labels: [],
    datasets: [{
      data: [],
      backgroundColor: [
        '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0',
        '#9966FF', '#FF9F40', '#7CFC00', '#8A2BE2'
      ],
      hoverBackgroundColor: [
        '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0',
        '#9966FF', '#FF9F40', '#7CFC00', '#8A2BE2'
      ]
    }]
  };

  chartOptions = {
    responsive: true,
    maintainAspectRatio: false
  };

  // Motivational quotes
  motivationalQuotes: MotivationalQuote[] = [
    { text: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt" },
    { text: "The best way to predict the future is to create it.", author: "Peter Drucker" },
    { text: "Your time is limited, don't waste it living someone else's life.", author: "Steve Jobs" },
    { text: "It's not about how many times you get knocked down, it's about how many times you get back up.", author: "Vince Lombardi" },
    { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill" }
  ];

  currentQuote: MotivationalQuote = this.motivationalQuotes[0];

  // Stats
  completedCount: number = 0;
  completionRate: number = 0;

  // Firestore subscription
  private achievementsSubscription: Subscription | (() => void) | null = null;

  // Encryption secret (would ideally be stored securely)
  private encryptionSecret: string = 'your-secure-encryption-key';

  constructor(
    private firestore: Firestore,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadAchievements();
    this.changeQuote();
  }

  ngOnDestroy(): void {
    if (this.achievementsSubscription) {
      if (typeof this.achievementsSubscription === 'function') {
        // If it's an unsubscribe function, call it
        this.achievementsSubscription();
      } else {
        // If it's a Subscription object, unsubscribe from it
        this.achievementsSubscription.unsubscribe();
      }
    }
  }

// Updated method
  loadAchievements(): void {
    try {
      const achievementsCollection = collection(this.firestore, 'achievements');

      // Store the unsubscribe function
      const unsubscribe = onSnapshot(achievementsCollection, (snapshot) => {
        this.achievements = snapshot.docs.map(doc => {
          const data = doc.data() as Achievement;

          // Decrypt sensitive fields
          try {
            if (data.description) {
              data.description = this.decryptData(data.description);
            }
          } catch (error) {
            console.error('Decryption error:', error);
            // Keep encrypted value if decryption fails
          }

          return {
            ...data,
            id: doc.id
          };
        });

        this.updateStats();
        this.updateChartData();
        this.applyFilters();
      }, (error) => {
        console.error('Error loading achievements:', error);
        this.snackBar.open(`Error loading achievements: ${error.message}`, 'Close', {
          duration: 5000
        });
      });

      // Store the unsubscribe function
      this.achievementsSubscription = unsubscribe;
    } catch (error) {
      console.error('Error setting up achievements listener:', error);
      this.snackBar.open(`Error loading achievements: ${(error as Error).message}`, 'Close', {
        duration: 5000
      });
    }
  }

  // Add a new achievement
  addAchievement(): void {
    if (this.achievementForm.valid) {
      const formValue = this.achievementForm.value;

      const newAchievement: Achievement = {
        title: formValue.title || '',
        description: this.encryptData(formValue.description || ''),
        category: formValue.category || 'Personal',
        targetDate: formValue.targetDate || new Date(),
        completed: false,
        progress: 0,
        priority: formValue.priority || 'medium',
        milestones: [],
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const achievementsCollection = collection(this.firestore, 'achievements');
      addDoc(achievementsCollection, newAchievement)
        .then(() => {
          this.snackBar.open('Achievement added successfully!', 'Close', {
            duration: 3000
          });
          this.resetForm();
        })
        .catch(error => {
          this.snackBar.open(`Error adding achievement: ${error.message}`, 'Close', {
            duration: 5000
          });
        });
    }
  }

  // Update achievement status
  toggleComplete(achievement: Achievement): void {
    if (!achievement.id) return;

    const newStatus = !achievement.completed;
    const achievementRef = doc(this.firestore, 'achievements', achievement.id);

    updateDoc(achievementRef, {
      completed: newStatus,
      progress: newStatus ? 100 : this.calculateProgress(achievement.milestones),
      updatedAt: new Date()
    })
      .then(() => {
        this.snackBar.open(`Achievement marked as ${newStatus ? 'completed' : 'in progress'}`, 'Close', {
          duration: 2000
        });
      })
      .catch(error => {
        this.snackBar.open(`Error updating achievement: ${error.message}`, 'Close', {
          duration: 5000
        });
      });
  }

  // Delete an achievement
  deleteAchievement(achievement: Achievement): void {
    if (!achievement.id) return;

    if (confirm('Are you sure you want to delete this achievement?')) {
      const achievementRef = doc(this.firestore, 'achievements', achievement.id);

      deleteDoc(achievementRef)
        .then(() => {
          this.snackBar.open('Achievement deleted successfully', 'Close', {
            duration: 3000
          });
        })
        .catch(error => {
          this.snackBar.open(`Error deleting achievement: ${error.message}`, 'Close', {
            duration: 5000
          });
        });
    }
  }

  // Edit an achievement - would normally open a dialog
  editAchievement(achievement: Achievement): void {
    // In a real app, this would open a dialog with the achievement data
    this.snackBar.open('Edit functionality would open a dialog here', 'Close', {
      duration: 2000
    });
  }

  // Add a milestone to an achievement
  addMilestone(achievement: Achievement, milestoneDesc: string): void {
    if (!achievement.id || !milestoneDesc.trim()) return;

    const newMilestone: Milestone = {
      description: milestoneDesc,
      completed: false
    };

    const updatedMilestones = [...achievement.milestones, newMilestone];
    const achievementRef = doc(this.firestore, 'achievements', achievement.id);

    updateDoc(achievementRef, {
      milestones: updatedMilestones,
      progress: this.calculateProgress(updatedMilestones),
      updatedAt: new Date()
    })
      .then(() => {
        this.snackBar.open('Milestone added successfully', 'Close', {
          duration: 2000
        });
      })
      .catch(error => {
        this.snackBar.open(`Error adding milestone: ${error.message}`, 'Close', {
          duration: 5000
        });
      });
  }

  // Toggle milestone completion
  toggleMilestone(achievement: Achievement, index: number): void {
    if (!achievement.id) return;

    const updatedMilestones = [...achievement.milestones];
    updatedMilestones[index].completed = !updatedMilestones[index].completed;

    const progress = this.calculateProgress(updatedMilestones);
    const achievementRef = doc(this.firestore, 'achievements', achievement.id);

    updateDoc(achievementRef, {
      milestones: updatedMilestones,
      progress,
      updatedAt: new Date()
    })
      .then(() => {
        this.snackBar.open('Milestone updated', 'Close', {
          duration: 2000
        });
      })
      .catch(error => {
        this.snackBar.open(`Error updating milestone: ${error.message}`, 'Close', {
          duration: 5000
        });
      });
  }

  // Calculate progress based on milestones
  calculateProgress(milestones: Milestone[]): number {
    if (milestones.length === 0) return 0;

    const completedCount = milestones.filter(m => m.completed).length;
    return Math.round((completedCount / milestones.length) * 100);
  }

  // Change the motivational quote
  changeQuote(): void {
    const randomIndex = Math.floor(Math.random() * this.motivationalQuotes.length);
    this.currentQuote = this.motivationalQuotes[randomIndex];
  }

  // Reset the form
  resetForm(): void {
    this.achievementForm.reset({
      category: 'Personal',
      priority: 'medium'
    });
  }

  // Apply filters to achievements
  applyFilters(): void {
    let filtered = [...this.achievements];

    // Filter by category
    if (this.filterCategory !== 'all') {
      filtered = filtered.filter(a => a.category === this.filterCategory);
    }

    // Filter by status
    if (this.filterStatus === 'completed') {
      filtered = filtered.filter(a => a.completed);
    } else if (this.filterStatus === 'active') {
      filtered = filtered.filter(a => !a.completed);
    }

    // Sort achievements
    this.filteredAchievements = filtered;
    this.sortAchievements();
  }

  // Sort achievements
  sortAchievements(): void {
    switch (this.sortBy) {
      case 'createdAt':
        this.filteredAchievements.sort((a, b) =>
          b.createdAt.getTime() - a.createdAt.getTime());
        break;
      case 'targetDate':
        this.filteredAchievements.sort((a, b) => {
          if (!a.targetDate) return 1;
          if (!b.targetDate) return -1;
          return a.targetDate.getTime() - b.targetDate.getTime();
        });
        break;
      case 'priority':
        const priorityOrder: { [key: string]: number } = {
          'high': 0,
          'medium': 1,
          'low': 2
        };
        this.filteredAchievements.sort((a, b) =>
          priorityOrder[a.priority] - priorityOrder[b.priority]);
        break;
      case 'progress':
        this.filteredAchievements.sort((a, b) => b.progress - a.progress);
        break;
    }
  }

  // Update statistics
  updateStats(): void {
    this.completedCount = this.achievements.filter(a => a.completed).length;
    this.completionRate = this.achievements.length > 0
      ? Math.round((this.completedCount / this.achievements.length) * 100)
      : 0;
  }

  // Continuing from where the code was cut off

  // Update chart data
  updateChartData(): void {
    const categoryMap = new Map<string, number>();

    // Count achievements by category
    this.achievements.forEach(achievement => {
      const count = categoryMap.get(achievement.category) || 0;
      categoryMap.set(achievement.category, count + 1);
    });

    // Prepare chart data
    const labels: string[] = [];
    const data: number[] = [];

    categoryMap.forEach((count, category) => {
      labels.push(category);
      data.push(count);
    });

    this.categoryChartData = {
      labels,
      datasets: [{
        data,
        backgroundColor: [
          '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0',
          '#9966FF', '#FF9F40', '#7CFC00', '#8A2BE2'
        ],
        hoverBackgroundColor: [
          '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0',
          '#9966FF', '#FF9F40', '#7CFC00', '#8A2BE2'
        ]
      }]
    };
  }

  // Encrypt sensitive data
  encryptData(data: string): string {
    if (!data) return data;
    try {
      return CryptoJS.AES.encrypt(data, this.encryptionSecret).toString();
    } catch (error) {
      console.error('Encryption error:', error);
      return data; // Return original data if encryption fails
    }
  }

  // Decrypt sensitive data
  decryptData(encryptedData: string): string {
    if (!encryptedData) return encryptedData;
    try {
      const bytes = CryptoJS.AES.decrypt(encryptedData, this.encryptionSecret);
      return bytes.toString(CryptoJS.enc.Utf8);
    } catch (error) {
      console.error('Decryption error:', error);
      return encryptedData; // Return encrypted data if decryption fails
    }
  }

  // Export achievements data
  exportAchievements(): void {
    const exportData = JSON.stringify(this.achievements.map(achievement => {
      // Create a clean version of the achievement without Firestore metadata
      const { id, ...cleanAchievement } = achievement;
      return {
        ...cleanAchievement,
        id,
        // Convert Firestore timestamps to ISO strings for easier import later
        createdAt: achievement.createdAt.toISOString(),
        updatedAt: achievement.updatedAt.toISOString(),
        targetDate: achievement.targetDate ? achievement.targetDate.toISOString() : null
      };
    }), null, 2);

    // Create a blob and download link
    const blob = new Blob([exportData], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `life-achievements-export-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);

    this.snackBar.open('Achievements exported successfully', 'Close', {
      duration: 3000
    });
  }

  // Import achievements data
  importAchievements(event: Event): void {
    const fileInput = event.target as HTMLInputElement;
    if (!fileInput.files || fileInput.files.length === 0) return;

    const file = fileInput.files[0];
    const reader = new FileReader();

    reader.onload = (e: ProgressEvent<FileReader>) => {
      try {
        const importedData = JSON.parse(e.target?.result as string);

        if (!Array.isArray(importedData)) {
          throw new Error('Invalid import format');
        }

        // Process each achievement
        importedData.forEach(async (achievement) => {
          // Convert ISO strings back to Firestore timestamps
          const achievementToImport: Achievement = {
            ...achievement,
            createdAt: new Date(achievement.createdAt),
            updatedAt: new Date(achievement.updatedAt),
            targetDate: achievement.targetDate ? new Date(achievement.targetDate) : null,
            // Re-encrypt sensitive data
            description: this.encryptData(achievement.description)
          };

          // Remove id if present (will be generated by Firestore)
          delete achievementToImport.id;

          // Add to Firestore
          const achievementsCollection = collection(this.firestore, 'achievements');
          await addDoc(achievementsCollection, achievementToImport);
        });

        this.snackBar.open(`Imported ${importedData.length} achievements successfully`, 'Close', {
          duration: 3000
        });
      } catch (error) {
        console.error('Import error:', error);
        this.snackBar.open(`Error importing achievements: ${(error as Error).message}`, 'Close', {
          duration: 5000
        });
      }
    };

    reader.readAsText(file);
  }

  // Generate a backup of all data - includes encryption
  generateBackup(): void {
    const backup = {
      achievements: this.achievements,
      categories: this.categories,
      timestamp: new Date().toISOString()
    };

    // Encrypt the entire backup
    const encryptedBackup = this.encryptData(JSON.stringify(backup));

    // Create a blob and download link
    const blob = new Blob([encryptedBackup], { type: 'application/octet-stream' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `life-achievements-backup-${new Date().toISOString().split('T')[0]}.enc`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);

    this.snackBar.open('Encrypted backup created successfully', 'Close', {
      duration: 3000
    });
  }

  // Restore from backup - includes decryption
  restoreFromBackup(event: Event): void {
    const fileInput = event.target as HTMLInputElement;
    if (!fileInput.files || fileInput.files.length === 0) return;

    const file = fileInput.files[0];
    const reader = new FileReader();

    reader.onload = (e: ProgressEvent<FileReader>) => {
      try {
        // Decrypt the backup
        const decryptedData = this.decryptData(e.target?.result as string);
        const backupData = JSON.parse(decryptedData);

        if (!backupData.achievements || !Array.isArray(backupData.achievements)) {
          throw new Error('Invalid backup format');
        }

        // Confirm restoration with user
        if (confirm(`This will restore ${backupData.achievements.length} achievements from backup dated ${new Date(backupData.timestamp).toLocaleString()}. Continue?`)) {
          // Restore process would involve clearing current data and importing from backup
          // For safety, this is just a placeholder - in a real app you'd want more safeguards
          this.snackBar.open('Backup restoration initiated', 'Close', {
            duration: 3000
          });

          // Implementation would depend on your data structure and requirements
        }
      } catch (error) {
        console.error('Restore error:', error);
        this.snackBar.open(`Error restoring from backup: ${(error as Error).message}`, 'Close', {
          duration: 5000
        });
      }
    };

    reader.readAsText(file);
  }

  // Share achievement with others
  shareAchievement(achievement: Achievement): void {
    // Create a shareable URL or text
    const shareText = `Check out my achievement: ${achievement.title} - ${achievement.description}`;

    // Check if Web Share API is available
    if (navigator.share) {
      navigator.share({
        title: 'Shared Achievement',
        text: shareText,
        url: window.location.href
      })
        .then(() => {
          this.snackBar.open('Achievement shared successfully', 'Close', {
            duration: 2000
          });
        })
        .catch((error) => {
          console.error('Share error:', error);
          // Fallback to clipboard
          this.copyToClipboard(shareText);
        });
    } else {
      // Fallback for browsers that don't support Web Share API
      this.copyToClipboard(shareText);
    }
  }

  // Helper function to copy text to clipboard
  copyToClipboard(text: string): void {
    navigator.clipboard.writeText(text)
      .then(() => {
        this.snackBar.open('Share text copied to clipboard', 'Close', {
          duration: 2000
        });
      })
      .catch((error) => {
        console.error('Clipboard error:', error);
        this.snackBar.open('Unable to copy to clipboard', 'Close', {
          duration: 2000
        });
      });
  }
}
