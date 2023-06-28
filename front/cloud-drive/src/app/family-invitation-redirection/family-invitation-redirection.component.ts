import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LambdaService } from '../services/lambda.service';

@Component({
  selector: 'app-family-invitation-redirection',
  templateUrl: './family-invitation-redirection.component.html',
  styleUrls: ['./family-invitation-redirection.component.css']
})
export class FamilyInvitationRedirectionComponent implements OnInit {

  constructor(private route: ActivatedRoute, private lambdaService: LambdaService) { }

  message: string = '';
  isAccepted: string = 'false';
  idDinamo: string = '';

  ngOnInit(): void {
    this.route.queryParams
      .subscribe(params => {
        this.idDinamo = params['id_dinamo'];
        this.isAccepted = params['approval'];
        this.lambdaService.sendFamilyInvitationAnswer(this.idDinamo, this.isAccepted).subscribe({
          next: (res) => {
           
          },
          error: (err) => {
            console.log(err)
          }        
        });
      });
      }
  }

  

