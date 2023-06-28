import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InviteFamilyDialogComponent } from './invite-family-dialog.component';

describe('InviteFamilyDialogComponent', () => {
  let component: InviteFamilyDialogComponent;
  let fixture: ComponentFixture<InviteFamilyDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InviteFamilyDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InviteFamilyDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
