import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SplitDialogComponent } from './split-dialog.component';

describe('SplitDialogComponent', () => {
  let component: SplitDialogComponent;
  let fixture: ComponentFixture<SplitDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SplitDialogComponent]
    });
    fixture = TestBed.createComponent(SplitDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
