import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StoreRequestDialogComponent } from './store-request-dialog.component';

describe('StoreRequestDialogComponent', () => {
  let component: StoreRequestDialogComponent;
  let fixture: ComponentFixture<StoreRequestDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StoreRequestDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StoreRequestDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
