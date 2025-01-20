import {Component, OnInit} from '@angular/core';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-dashboard',
  imports: [
    FormsModule,
  ],
  templateUrl: './dashboard.component.html',
  standalone: true,
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit{

  quickStats = [
    {
      label: 'Total Revenue',
      value: '$124,563',
      icon: 'fas fa-dollar-sign',
      bgColor: '#4CAF50',
      trend: 12.5
    },
    {
      label: 'Active Users',
      value: '2,845',
      icon: 'fas fa-users',
      bgColor: '#2196F3',
      trend: 8.2
    },
    {
      label: 'New Orders',
      value: '156',
      icon: 'fas fa-shopping-cart',
      bgColor: '#FF9800',
      trend: -3.8
    },
    {
      label: 'Conversion Rate',
      value: '3.24%',
      icon: 'fas fa-chart-line',
      bgColor: '#9C27B0',
      trend: 2.4
    }
  ];

  recentActivities = [
    {
      title: 'New Order #1234',
      description: 'Customer placed an order for $523',
      time: '2 hours ago',
      icon: 'fas fa-shopping-bag',
      color: '#4CAF50'
    },
    {
      title: 'User Registration',
      description: 'New user signed up via Google',
      time: '4 hours ago',
      icon: 'fas fa-user-plus',
      color: '#2196F3'
    },
    {
      title: 'System Update',
      description: 'Server maintenance completed',
      time: '6 hours ago',
      icon: 'fas fa-server',
      color: '#FF9800'
    }
  ];

  pendingTasks = [
    {
      id: 'task1',
      title: 'Review quarterly reports',
      priority: 'high',
      dueDate: 'Today',
      completed: false
    },
    {
      id: 'task2',
      title: 'Team meeting preparation',
      priority: 'medium',
      dueDate: 'Tomorrow',
      completed: false
    },
    {
      id: 'task3',
      title: 'Update documentation',
      priority: 'low',
      dueDate: 'Next week',
      completed: false
    }
  ];

  revenueData: any;
  activityData: any;
  chartOptions: any;

  ngOnInit() {
    this.initChartData();
  }

  private initChartData() {
    this.revenueData = {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      datasets: [{
        label: 'Revenue',
        data: [65, 59, 80, 81, 56, 55],
        fill: false,
        borderColor: '#4CAF50'
      }]
    };

    this.activityData = {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
      datasets: [{
        label: 'Active Users',
        data: [28, 48, 40, 19, 86],
        backgroundColor: '#2196F3'
      }]
    };

    this.chartOptions = {
      responsive: true,
      maintainAspectRatio: false
    };
  }


}
