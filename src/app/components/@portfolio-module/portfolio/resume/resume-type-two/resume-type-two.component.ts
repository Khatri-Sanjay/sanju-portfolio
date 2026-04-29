import {Component, OnInit} from '@angular/core';
import {ResumeData, ResumeDataService} from '../resume-data.service';
import {NgForOf, NgIf} from '@angular/common';
import {NgxPrintDirective} from 'ngx-print';

@Component({
  selector: 'app-resume-type-two',
  imports: [
    NgForOf,
    NgIf,
    NgxPrintDirective
  ],
  templateUrl: './resume-type-two.component.html',
  standalone: true,
  styleUrl: './resume-type-two.component.scss'
})
export class ResumeTypeTwoComponent implements OnInit{
  resumeData!: ResumeData;

  constructor(private resumeDataService: ResumeDataService) {}

  ngOnInit(): void {
    this.resumeData = this.resumeDataService.getResumeData();
  }
}
