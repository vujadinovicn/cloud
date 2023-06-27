import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FamilyInvitationRedirectionComponent } from './family-invitation-redirection.component';

describe('FamilyInvitationRedirectionComponent', () => {
  let component: FamilyInvitationRedirectionComponent;
  let fixture: ComponentFixture<FamilyInvitationRedirectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FamilyInvitationRedirectionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FamilyInvitationRedirectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
