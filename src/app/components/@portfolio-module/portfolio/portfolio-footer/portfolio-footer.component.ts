import { Component } from '@angular/core';
import {PersonalDetails} from '../../../../@core/data/personal-details';

@Component({
  selector: 'app-portfolio-footer',
  imports: [],
  templateUrl: './portfolio-footer.component.html',
  standalone: true,
  styleUrl: './portfolio-footer.component.scss'
})
export class PortfolioFooterComponent {
  currentYear: number = new Date().getFullYear();

  personalDetails = PersonalDetails;
}
