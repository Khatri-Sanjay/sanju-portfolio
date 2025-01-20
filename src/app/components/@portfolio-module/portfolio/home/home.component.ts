import {Component, inject} from '@angular/core';
import {ProjectComponent} from '../project/project.component';
import {ContactMeComponent} from '../contact-me/contact-me.component';
import {SkillsComponent} from '../skills/skills.component';
import {TypeWriterComponent} from '../type-writer/type-writer.component';
import {ChatWindowComponent} from '../chat-window/chat-window.component';
import {PersonalDetails} from '../../../../@core/data/personal-details';
import {ChatService} from '../../../../shared-service/chat.service';


@Component({
  selector: 'app-home',
  imports: [
    ProjectComponent,
    ContactMeComponent,
    SkillsComponent,
    TypeWriterComponent,
    ChatWindowComponent,
  ],
  templateUrl: './home.component.html',
  standalone: true,
  styleUrl: './home.component.scss'
})
export class HomeComponent {

  personalDetails = PersonalDetails;

  chatService: ChatService = inject(ChatService);

  openChat() {
    this.chatService.toggleChat();
  }
}
