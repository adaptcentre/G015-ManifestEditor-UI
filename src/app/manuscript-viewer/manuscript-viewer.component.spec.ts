import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManuscriptViewerComponent } from './manuscript-viewer.component';

describe('ManuscriptViewerComponent', () => {
  let component: ManuscriptViewerComponent;
  let fixture: ComponentFixture<ManuscriptViewerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ManuscriptViewerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ManuscriptViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
