import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnswersComponent } from './answers.component';
import {NO_ERRORS_SCHEMA} from "@angular/core";

describe('AnswersComponent', () => {
  let component: AnswersComponent;
  let fixture: ComponentFixture<AnswersComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AnswersComponent],
      schemas:[NO_ERRORS_SCHEMA]
    });
    fixture = TestBed.createComponent(AnswersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
