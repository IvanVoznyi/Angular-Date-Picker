import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';

export enum StartWeek {
  Mon,
  Sun,
}

enum GenerateDatePickerType {
  NextMonth,
  PreviousMonth,
}

@Component({
  selector: 'app-date-picker',
  templateUrl: './date-picker.component.html',
  styleUrls: ['./date-picker.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DatePickerComponent implements OnInit, OnChanges {
  protected days: Array<Date> | null = [];
  protected date = new Date();
  protected readonly currentDate = new Date();
  protected _selectedDate: Date | undefined;

  @Output()
  selectedDate: EventEmitter<Date> = new EventEmitter();

  @Input()
  startWeek: StartWeek = StartWeek.Sun;

  constructor() {}

  onSelectedDate(date: Date) {
    if (date.getMonth() === this.date.getMonth()) {
      this.selectedDate.emit(date);
      this._selectedDate = date;
    }
  }

  generateNewDatePickerData(generateDatePicker: GenerateDatePickerType) {
    const month =
      generateDatePicker === GenerateDatePickerType.NextMonth
        ? this.date.getMonth() + 1
        : this.date.getMonth() - 1;
    this.date = new Date(this.date.setMonth(month));
    this.days = this.generateCalendar(this.date, this.startWeek);
  }

  previousMonth() {
    this.generateNewDatePickerData(GenerateDatePickerType.PreviousMonth);
  }

  nextMonth() {
    this.generateNewDatePickerData(GenerateDatePickerType.NextMonth);
  }

  dateTrackBy(index: number, date: Date) {
    return date.getDay();
  }

  isCheckedDate(date: Date | undefined, day: Date): boolean {
    return !!(
      date &&
      date.getMonth() === this.date.getMonth() &&
      date.getDate() === day.getDate() &&
      date.getMonth() === day.getMonth() &&
      date.getFullYear() === day.getFullYear()
    );
  }

  generateCalendar = (date: Date, startWeek: StartWeek = StartWeek.Sun) => {
    const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    const lastDayInPreviousMonth = new Date(
      date.getFullYear(),
      date.getMonth(),
      0
    );
    const days = [];
    const maxDays = 42;

    const day =
      startWeek === StartWeek.Mon
        ? lastDayInPreviousMonth.getDay()
        : firstDay.getDay();

    for (let index = 1; index <= maxDays; index++) {
      days.push(
        new Date(
          new Date(lastDayInPreviousMonth).setDate(
            lastDayInPreviousMonth.getDate() - day + index
          )
        )
      );
    }

    return days;
  };

  ngOnInit(): void {
    this.days = this.generateCalendar(this.date);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!changes['startWeek'].firstChange) {
      this.days = this.generateCalendar(
        this.date,
        changes['startWeek'].currentValue
      );
    }
  }
}
