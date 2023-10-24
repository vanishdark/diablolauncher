import moment from 'moment-timezone';

export class Legion {
    private _difference: number; // 30 minutes between the current time and the next legion time (in milliseconds)
    private _firstRecord: number; // last time the legion was recorded
    private _next: number; // next legion time
    private _nextFive: number[]; // next five legion times
    private _timeout: number; // 5 minutes duration of the current Legion
    private _running: boolean; // is the current Legion running?
    private _currentInterval: any; // current interval
    private _warningSent: boolean; // is the warning sent?
    get running(): boolean {
        return this._running;
    }
    set running(value: boolean) {
        this._running = value;
    }
    get firstRecord(): number {
        return this._firstRecord;
    }
    set firstRecord(value: number) {
        this._firstRecord = value;
    }
    get difference(): number {
        return this._difference;
    }
    set difference(value: number) {
        this._difference = value;
    }
    get next(): number {
        return this._next;
    }
    set next(value: number) {
        this._next = value;
    }
    get nextFive(): number[] {
        return this._nextFive;
    }
    set nextFive(value: number[]) {
        this._nextFive = value;
    }
    get timeout(): number {
        return this._timeout;
    }
    set timeout(value: number) {
        this._timeout = value;
    }
    get currentInterval(): any {
        return this._currentInterval;
    }
    set currentInterval(value: any) {
        this._currentInterval = value;
    }
    get warningSent(): boolean {
        return this._warningSent;
    }
    set warningSent(value: boolean) {
        this._warningSent = value;
    }
    constructor() {
        this.difference = 25 * 60 * 1000;
        this.firstRecord = moment.tz('2023-10-24 12:50:00', 'Europe/London').valueOf();
        this.firstRecord = this.findLastLegion();
        this.next = this.calculateNextLegion();
        this.nextFive = this.calculateNextFiveLegions();
        this.timeout = 5 * 60 * 1000;
        this.warningSent = false;
        this.running = this.isRunning();
    }
    findLastLegion(): number {
        const now = moment.tz('Europe/London').valueOf();
        let lastLegion = moment.tz(this.firstRecord, 'Europe/London');
        while (lastLegion.valueOf() <= now) {
            lastLegion.add(this.difference, 'milliseconds');
        }
        lastLegion.subtract(this.difference, 'milliseconds');
        return lastLegion.valueOf();
    }

    calculateNextLegion(): number {
        const now = moment.tz('Europe/London').valueOf();
        let nextLegion = moment.tz(this.firstRecord, 'Europe/London');
        while (nextLegion.valueOf() <= now) {
            nextLegion.add(this.difference, 'milliseconds');
        }
        return nextLegion.valueOf();
    }
    calculateNextFiveLegions(): number[] {
        const nextFiveLegions: number[] = [];
        let nextLegion = moment.tz(this.next, 'Europe/London');
        for (let i = 0; i < 5; i++) {
            nextFiveLegions.push(nextLegion.valueOf());
            nextLegion.add(this.difference, 'milliseconds');
        }
        return nextFiveLegions;
    }
    isRunning() {
        const now = moment.tz('Europe/London').valueOf();
        const currentLegion = this.firstRecord;
        const sum = currentLegion + this.timeout;
        if (now >= currentLegion && now <= sum) {
            return true;
        }
        return false;
    }

    runTimetout() {
        return setInterval(() => {
            const element = document.getElementById('legion-countdown');
            if (element) {
                const now = moment.tz('Europe/London').valueOf();
                const nextLegion = this.firstRecord;
                const nextLegionEnd = nextLegion + this.timeout;
                const difference = nextLegionEnd - now;
                const duration = moment.duration(difference);
                const minutes = duration.minutes();
                const seconds = duration.seconds();
                element.innerHTML = minutes + "m " + seconds + "s ";
                const nextElement = document.getElementById('next-legion');
                if(nextElement){
                    nextElement.innerHTML = 'Today at ' + moment.tz(nextLegion, 'Europe/London').format('hh:mm A');
                }
                if (difference < 0) {
                    window.location.reload();
                }
            }
        }, 1000)
    }
    runSchedule() {
        return setInterval(() => {
            const element = document.getElementById('legion-countdown');
            if (element) {
                const now = moment.tz('Europe/London').valueOf();
                const nextLegion = this.next;
                const difference = nextLegion - now;
                const duration = moment.duration(difference);
                const minutes = duration.minutes();
                const seconds = duration.seconds();
                element.innerHTML = minutes + "m " + seconds + "s until start";
                const nextElement = document.getElementById('next-legion');
                if(nextElement) {
                    nextElement.innerHTML = 'Today at ' + moment.tz(nextLegion, 'Europe/London').format('hh:mm A');
                }
                if (difference < 300000 && this.warningSent === false) {
                    this.warningSent = true;
                    const NOTIFICATION_TITLE = 'Legion';
                    const NOTIFICATION_BODY = 'Legion is about to start!';
                    new Notification(NOTIFICATION_TITLE, { body: NOTIFICATION_BODY, icon: '../../images/64x64.png' });
                }
                if (difference < 0) {
                    window.location.reload();
                }
            }
        }, 1000);
    }

    initTimer() {
        if (this.running){
            document.dispatchEvent(new CustomEvent('legion', { detail: {
                running: this.running,
                firstRecord: this.firstRecord,
                next: this.next,
                nextFive: this.nextFive
            } })); // add all the values to the event
            if(this.currentInterval) {clearInterval(this.currentInterval); this.currentInterval = null;}
            this.currentInterval = this.runTimetout();
        } else {
            document.dispatchEvent(new CustomEvent('legion', { detail: {
                running: this.running,
                firstRecord: this.firstRecord,
                next: this.next,
                nextFive: this.nextFive
            } })); // add all the values to the event
            if(this.currentInterval) {clearInterval(this.currentInterval); this.currentInterval = null;}
            this.currentInterval = this.runSchedule();
        }
    }
}