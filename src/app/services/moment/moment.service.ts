import { Injectable } from '@angular/core';
import * as moment from 'moment';

@Injectable({
    providedIn: 'root'
})
export class DCMomentService {

    get moment() {
        return moment;
    }

    M(inp?: moment.MomentInput, format?: moment.MomentFormatSpecification, language?: string, strict?: boolean): moment.Moment {
        return moment(inp, format, language, strict);
    }

    monthStr(inp?: moment.MomentInput): string {
        const month = moment(inp).month() + 1;
        if (month < 10)
            return '0' + month;
        else
            return '' + month;
    }

    startOf(date: moment.MomentInput, unitOfTime: moment.unitOfTime.StartOf): Date {
        if (!date) return null;
        return moment(date).startOf(unitOfTime).toDate();
    }

    endOf(date: moment.MomentInput, unitOfTime: moment.unitOfTime.StartOf): Date {
        if (!date) return null;
        return moment(date).endOf(unitOfTime).toDate();
    }

    constraintTime(date: Date, range: number[], type: 'hour' | 'minute' | 'second'): Date {
        if (!date) return null;
        const max = type === 'hour' ? 23 : 59;

        range = range.filter(o => o >= 0 && o <= max);
        range.sort((a, b) => a - b);
        if (!range.length)
            return date;

        const momDate = moment(date);
        const value = momDate[type + 's']();

        for (const item of range) {
            if (value <= item) {
                return momDate[type](item).toDate();
            }
        }

        momDate[type](range[0]);
        if (type === 'hour')
            momDate.add(1, 'days');
        if (type === 'minute')
            momDate.add(1, 'hour');
        if (type === 'second')
            momDate.add(1, 'minute');

        return momDate.toDate();
    }

    constraintTimeFor(dates: Date[], range: number[], type: 'hour' | 'minute' | 'second'): Date[] {
        const newArr: Date[] = [];
        for (const item of dates) {
            const newItem = this.constraintTime(item, range, type);
            newArr.push(newItem);
        }
        return newArr;
    }

    private notEmpty(val: any): boolean {
        if (val === null && val === undefined)
            return false;
        else
            return true;
    }

    setTime(date: Date, hours?: number, minutes?: number, seconds?: number, milSeconds?: number): Date {
        if (!date) return;
        const momDate = moment(date);

        if (this.notEmpty(hours))
            momDate.hour(hours);

        if (this.notEmpty(minutes))
            momDate.minute(minutes);

        if (this.notEmpty(seconds))
            momDate.second(seconds);

        if (this.notEmpty(milSeconds))
            momDate.millisecond(milSeconds);

        return momDate.toDate();
    }

    setTimeFor(dates: Date[], hours?: number, minutes?: number, seconds?: number, milSeconds?: number): Date[] {
        const newArr: Date[] = [];
        for (const item of dates) {
            const newItem = this.setTime(item, hours, minutes, seconds, milSeconds);
            newArr.push(newItem);
        }
        return newArr;
    }

    toISOString(date: Date) {
        if (!date)
            return date;
        return date.toISOString();
    }

    dateChanged(date: Date, date2: Date) {
        return moment(date).format('YYYY-MM-DD') !== moment(date2).format('YYYY-MM-DD');
    }

    contains(date: moment.MomentInput, dateCollection: moment.MomentInput[]): boolean {
        if (!date)
            return false;

        const m = moment(date);
        for (const item of dateCollection) {
            if (moment(item).isSame(m))
                return true;
        }

        return false;
    }

}
