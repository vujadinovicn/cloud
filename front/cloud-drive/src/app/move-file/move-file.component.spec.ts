import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MoveFileComponent } from './move-file.component';

describe('MoveFileComponent', () => {
  let component: MoveFileComponent;
  let fixture: ComponentFixture<MoveFileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MoveFileComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MoveFileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
