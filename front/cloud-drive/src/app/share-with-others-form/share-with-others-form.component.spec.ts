import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShareWithOthersFormComponent } from './share-with-others-form.component';

describe('ShareWithOthersFormComponent', () => {
  let component: ShareWithOthersFormComponent;
  let fixture: ComponentFixture<ShareWithOthersFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShareWithOthersFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShareWithOthersFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
