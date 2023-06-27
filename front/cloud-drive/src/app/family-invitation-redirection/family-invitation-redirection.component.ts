import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-family-invitation-redirection',
  templateUrl: './family-invitation-redirection.component.html',
  styleUrls: ['./family-invitation-redirection.component.css']
})
export class FamilyInvitationRedirectionComponent implements OnInit {

  constructor() { }
  message: string = '';
  isVerified: string = 'false';
  code: string = '';

  ngOnInit(): void {
  }

}
