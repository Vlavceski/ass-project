import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MultiCateDialogComponent } from './multi-cate-dialog.component';

describe('MultiCateDialogComponent', () => {
  let component: MultiCateDialogComponent;
  let fixture: ComponentFixture<MultiCateDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MultiCateDialogComponent]
    });
    fixture = TestBed.createComponent(MultiCateDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
