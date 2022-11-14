import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { from } from 'rxjs';
import { StartWeek } from './date-picker/date-picker.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  date: Date | undefined
  startWeek: StartWeek = StartWeek.Sun;
  form = new FormGroup({
    startWeek: new FormControl<StartWeek>(StartWeek.Sun)
  });


  selectDate(date: Date) {
    this.date = date
  }

  ngOnInit(): void {
    this.form.valueChanges.subscribe(value => {
      this.startWeek = value.startWeek as StartWeek
    })
  }
}
