import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowSplitDialogComponent } from './show-split-dialog.component';

describe('ShowSplitDialogComponent', () => {
  let component: ShowSplitDialogComponent;
  let fixture: ComponentFixture<ShowSplitDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ShowSplitDialogComponent]
    });
    fixture = TestBed.createComponent(ShowSplitDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
