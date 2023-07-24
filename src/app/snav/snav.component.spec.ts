import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SnavComponent } from './snav.component';

describe('SnavComponent', () => {
  let component: SnavComponent;
  let fixture: ComponentFixture<SnavComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SnavComponent]
    });
    fixture = TestBed.createComponent(SnavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
