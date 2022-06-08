import {deadlineDate} from './app.js';

describe('deadline date calculation', () => {

    describe('general case', () => {

        it('before working hours', () => {
            expect(deadlineDate(10.5, new Date("January 03 2022 08:30:00"))).toStrictEqual({ "deadline": 1641288600, "deadline_date": "04/01/2022, 11:30:00" });
        })
        it('during working hours', () => {
            expect(deadlineDate(8, new Date("January 04 2022 14:45:00"))).toStrictEqual({ "deadline": 1641383100, "deadline_date": "05/01/2022, 13:45:00" });
        })
        it('during working hours, if task can be completed same day', () => {
            expect(deadlineDate(5.3, new Date("January 05 2022 10:10:00"))).toStrictEqual({ "deadline": 1641389280, "deadline_date": "05/01/2022, 15:28:00" });
        })
        it('after working hours', () => {
            expect(deadlineDate(15, new Date("January 06 2022 20:55:00"))).toStrictEqual({ "deadline": 1641823200, "deadline_date": "10/01/2022, 16:00:00" });
        })
        it('task for several weeks', () => {
            expect(deadlineDate(230.44, new Date("January 07 2022 01:55:00"))).toStrictEqual({ "deadline": 1644585960, "deadline_date": "11/02/2022, 15:26:00" });
        })
        it('less than hour before closing', () => {
            expect(deadlineDate(5.05, new Date("January 03 2022 18:23:00"))).toStrictEqual({ "deadline": 1641299160, "deadline_date": "04/01/2022, 14:26:00" });
        })
        it('less than hour to complete the task into next day', () => {
            expect(deadlineDate(3.66, new Date("January 04 2022 16:00:00"))).toStrictEqual({ "deadline": 1641371940, "deadline_date": "05/01/2022, 10:39:00" });
        })
    });
    describe('weekends case', () => {

        it('before working hours', () => {
            expect(deadlineDate(10.5, new Date("January 01 2022 08:30:00"))).toStrictEqual({ "deadline": 1641288600, "deadline_date": "04/01/2022, 11:30:00" });
        })
        it('during working hours', () => {
            expect(deadlineDate(8, new Date("January 02 2022 14:45:00"))).toStrictEqual({ "deadline": 1641225600, "deadline_date": "03/01/2022, 18:00:00" });
        })
        it('during working hours, if task can be completed same day', () => {
            expect(deadlineDate(5.3, new Date("January 01 2022 10:10:00"))).toStrictEqual({ "deadline": 1641215880, "deadline_date": "03/01/2022, 15:18:00" });
        })
        it('after working hours', () => {
            expect(deadlineDate(15, new Date("January 02 2022 20:55:00"))).toStrictEqual({ "deadline": 1641304800, "deadline_date": "04/01/2022, 16:00:00" });
        })
        it('across weekends', () => {
            expect(deadlineDate(53.75, new Date("January 02 2022 17:00:00"))).toStrictEqual({ "deadline": 1641833100, "deadline_date": "10/01/2022, 18:45:00" });
        })
        it('last working day of the week, after working hours', () => {
            expect(deadlineDate(10.9, new Date("January 07 2022 19:00:00"))).toStrictEqual({ "deadline": 1641894840, "deadline_date": "11/01/2022, 11:54:00" });
        })
        it('last working day of the week, during working hours', () => {
            expect(deadlineDate(10.9, new Date("January 07 2022 17:52:00"))).toStrictEqual({ "deadline": 1641890760, "deadline_date": "11/01/2022, 10:46:00" });
        })
        it('deadline on weekend, if hit during total days calculation', () => {
            expect(deadlineDate(88, new Date("January 11 2022 14:35:00"))).toStrictEqual({ "deadline": 1643106900, "deadline_date": "25/01/2022, 12:35:00" });
        })
        it('deadline on weekend, if hit Fri on last day calculation', () => {
            expect(deadlineDate(88, new Date("January 17 2022 14:35:00"))).toStrictEqual({ "deadline": 1643625300, "deadline_date": "31/01/2022, 12:35:00" });
        })
        it('start on weekend, deadline on weekend', () => {
            expect(deadlineDate(52, new Date("January 02 2022 17:35:00"))).toStrictEqual({ "deadline": 1641826800, "deadline_date": "10/01/2022, 17:00:00" });
        })
    });
})