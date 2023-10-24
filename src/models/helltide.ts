import moment from "moment";

export class HellTide {
    private _difference: number; // 30 minutes between the current time and the next legion time (in milliseconds)
    private _firstRecord: number; // last time the legion was recorded
    private _next: number; // next legion time
    private _nextFive: number[]; // next five legion times
    private _timeout: number; // 5 minutes duration of the current Legion
    private _running: boolean; // is the current Legion running?
    private _currentInterval: any; // current interval

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
    constructor() {
        this.difference = (2 * 60 * 60 * 1000) + (15 * 60 * 1000);
        this.firstRecord = moment.tz('2023-10-24 11:00:00', 'Europe/London').valueOf();
        this.firstRecord = this.findLastHellTide();
        this.next = this.calculateNextHellTide();
        this.nextFive = this.calculateNextFiveHellTides();
        this.timeout = 1* 60 * 60 * 1000;
        this.running =this.isRunning();
    }

    findLastHellTide(): number {
        const now = moment.tz('Europe/London').valueOf();
        let firstHellTide = moment.tz(this.firstRecord, 'Europe/London');
        while (firstHellTide.valueOf() <= now) {
            firstHellTide.add(this.difference, 'milliseconds');
        }
        firstHellTide.subtract(this.difference, 'milliseconds');
        return firstHellTide.valueOf();
    }
    calculateNextHellTide(): number {
        const now = moment.tz('Europe/London').valueOf();
        let nextHellTide = moment.tz(this.firstRecord, 'Europe/London');
        while (nextHellTide.valueOf() <= now) {
            nextHellTide.add(this.difference, 'milliseconds');
        }
        return nextHellTide.valueOf();
    }
    calculateNextFiveHellTides(): number[] {
        const nextFiveHellTides: number[] = [];
        let nextHellTide = moment.tz(this.next, 'Europe/London');
        for (let i = 0; i < 5; i++) {
            nextFiveHellTides.push(nextHellTide.valueOf());
            nextHellTide.add(this.difference, 'milliseconds');
        }
        return nextFiveHellTides;
    }
    isRunning(): boolean {
        const now = moment.tz('Europe/London').valueOf();
        const currentHelltide = this.firstRecord;
        const sum = currentHelltide + this.timeout;
        if (now >= currentHelltide && now <= sum) {
            return true;
        }
        return false;
    }
    runTimeout(): any {
        return setInterval(() => {
            const element = document.getElementById('helltide-countdown');
            if (element) {
                const now = moment.tz('Europe/London').valueOf();
                const nextHellTide = this.firstRecord;
                const nextLegionEnd = nextHellTide + this.timeout;
                const difference = nextLegionEnd - now;
                const duration = moment.duration(difference, 'milliseconds');
                const hours = duration.hours();
                const minutes = duration.minutes();
                const seconds = duration.seconds();
                element.innerHTML = `${minutes}m ${seconds}s`;
                const nextElement = document.getElementById('next-helltide');
                if (nextElement) { 
                    nextElement.innerHTML = 'Today at ' + moment.tz(this.next, 'Europe/London').format('hh:mm A');
                }
                if(difference < 0) {
                    window.location.reload();
                }
            }
        }, 1000)
    }
    runSchedule(): any {
        return setInterval(() => {
            const element = document.getElementById('helltide-countdown');
            if(element){
                const now = moment.tz('Europe/London').valueOf();
                const nextHellTide = this.next;
                const difference = nextHellTide - now;
                console.log(difference);
                const duration = moment.duration(difference, 'milliseconds');
                const hours = duration.hours();
                const minutes = duration.minutes();
                const seconds = duration.seconds();
                element.innerHTML = `${hours ? hours + 'h' : ''} ${minutes}m ${seconds}s until start`;
                const nextElement = document.getElementById('next-helltide');
                if(nextElement){
                    nextElement.innerHTML = 'Today at ' + moment.tz(this.next, 'Europe/London').format('hh:mm A');
                }
                if(difference < 0) {
                    window.location.reload();
                }
            }
        }, 1000)
    }
    initTimer(): void {
        if (this.running){
            document.dispatchEvent(new CustomEvent('helltide', { detail: {
                running: this.running,
                firstRecord: this.firstRecord,
                next: this.next,
                nextFive: this.nextFive
            } })); // add all the values to the event
            if(this.currentInterval) {clearInterval(this.currentInterval); this.currentInterval = null;}
            this.currentInterval = this.runTimeout();
        } else {
            document.dispatchEvent(new CustomEvent('helltide', { detail: {
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
