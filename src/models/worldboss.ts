import moment from "moment";

export class WorldBoss {
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
        this.difference = (3 * 60 * 60 * 1000) + (30 * 60 * 1000);
        this.firstRecord = moment.tz('2023-10-24 13:30:00', 'Europe/London').valueOf();
        this.firstRecord = this.findLastWorldBoss();
        this.next = this.calculateNextWorldBoss();
        this.nextFive = this.calculateNextFiveWorldBosses();
        this.timeout = 1 * 1 * 60 * 1000;
        this.running = this.isRunning();
    }
    findLastWorldBoss(): number {
        const now = moment.tz('Europe/London').valueOf();
        let lastWorldBoss = moment.tz(this.firstRecord, 'Europe/London');
        while (lastWorldBoss.valueOf() <= now) {
            lastWorldBoss = lastWorldBoss.add(this.difference, 'milliseconds');
        }
        lastWorldBoss = lastWorldBoss.subtract(this.difference, 'milliseconds');
        return lastWorldBoss.valueOf();
    }
    calculateNextWorldBoss(): number {
        const now = moment.tz('Europe/London').valueOf();
        let nextWorldBoss = moment.tz(this.firstRecord, 'Europe/London');
        while (nextWorldBoss.valueOf() <= now) {
            nextWorldBoss = nextWorldBoss.add(this.difference, 'milliseconds');
        }
        return nextWorldBoss.valueOf();
    }
    calculateNextFiveWorldBosses(): number[] {
        const nextFiveWorldBosses: number[] = [];
        let nextWorldBoss = this.next;
        for (let i = 0; i < 5; i++) {
            nextFiveWorldBosses.push(nextWorldBoss);
            nextWorldBoss = moment.tz(nextWorldBoss, 'Europe/London').add(this.difference, 'milliseconds').valueOf();
        }
        return nextFiveWorldBosses;
    }
    isRunning(): boolean {
        const now = moment.tz('Europe/London').valueOf();
        const currentWorldBoss = this.firstRecord;
        const sum = currentWorldBoss + this.timeout;
        if (now >= currentWorldBoss && now <= sum) {
            return true;
        } else {
            return false;
        }
    }
    runTimeout(): any {
        return setInterval(() => {
            const element = document.getElementById('worldboss-countdown');
            if (element){
                const now = moment.tz('Europe/London').valueOf();
                const nextWorldBoss = this.firstRecord;
                const nextWorldBossEnd = nextWorldBoss + this.timeout;
                const difference = nextWorldBossEnd - now;
                const duration = moment.duration(difference, 'milliseconds');
                const hours = duration.hours();
                const minutes = duration.minutes();
                const seconds = duration.seconds();
                element.innerHTML = `${hours}h ${minutes}m ${seconds}s`;
                const nextElement = document.getElementById('next-worldboss');
                if (nextElement) {
                    nextElement.innerHTML = 'Today at ' + moment.tz(this.next, 'Europe/London').format('hh:mm A');
                }
                if (difference <0){
                    clearInterval(this.currentInterval);
                    this.firstRecord = this.next;
                    this.next = this.calculateNextWorldBoss();
                    this.nextFive = this.calculateNextFiveWorldBosses();
                    this.running = this.isRunning();
                    window.location.reload();
                }
            }
        }, 1000)
    }
    runSchedule(): any {
        return setInterval(() => {
            const element = document.getElementById('worldboss-countdown');
            if (element){
                const now = moment.tz('Europe/London').valueOf();
                const nextWorldBoss = this.next;
                const difference = nextWorldBoss - now;
                const duration = moment.duration(difference, 'milliseconds');
                const hours = duration.hours();
                const minutes = duration.minutes();
                const seconds = duration.seconds();
                element.innerHTML = `${hours > 0 ? hours + 'h' : ''} ${minutes}m ${seconds}s until start`;
                const nextElement = document.getElementById('next-worldboss');
                if (nextElement) {
                    nextElement.innerHTML = 'Today at ' + moment.tz(this.next, 'Europe/London').format('hh:mm A');
                }
                if (difference < 0){
                    window.location.reload();
                }
            }
        }, 1000)
       
    }
    initTimer(): void {
        if (this.running){
            document.dispatchEvent(new CustomEvent('worldboss', { detail: {
                running: this.running,
                firstRecord: this.firstRecord,
                next: this.next,
                nextFive: this.nextFive
            } })); // add all the values to the event
            if(this.currentInterval) {clearInterval(this.currentInterval); this.currentInterval = null;}
            this.currentInterval = this.runTimeout();
        } else {
            document.dispatchEvent(new CustomEvent('worldboss', { detail: {
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