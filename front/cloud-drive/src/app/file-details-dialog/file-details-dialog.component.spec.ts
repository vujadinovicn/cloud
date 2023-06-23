import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FileDetailsDialogComponent } from './file-details-dialog.component';

describe('FileDetailsDialogComponent', () => {
  let component: FileDetailsDialogComponent;
  let fixture: ComponentFixture<FileDetailsDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FileDetailsDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FileDetailsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
