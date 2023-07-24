import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PfmComponent } from './pfm.component';

describe('PfmComponent', () => {
  let component: PfmComponent;
  let fixture: ComponentFixture<PfmComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PfmComponent]
    });
    fixture = TestBed.createComponent(PfmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
