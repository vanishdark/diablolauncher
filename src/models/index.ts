import { HellTide } from "./helltide";
import { Legion } from "./legion";
import { WorldBoss } from "./worldboss";
import moment from "moment";
import 'flowbite';

class EventName {
    static helltide = 'helltide';
    static legion = 'legion';
    static worldboss = 'worldboss';
}

export class Timers {
    helltide: HellTide;
    legion: Legion;
    worldboss: WorldBoss;

    constructor() {
        this.initEvents();
        this.helltide = new HellTide();
        this.legion = new Legion();
        this.worldboss = new WorldBoss();
        this.helltide.initTimer();
        this.legion.initTimer();
        this.worldboss.initTimer();
    }

    initEvents() {
        this.closeEvents();
        document.addEventListener('helltide', (e) => this.helltideEvents(e));
        document.addEventListener('legion', (e) => this.legionEvents(e));
        document.addEventListener('worldboss', (e) => this.worldbossEvents(e));
    }
    closeEvents() {
        document.removeEventListener('helltide', this.helltideEvents);
        document.removeEventListener('legion', this.legionEvents);
        document.removeEventListener('worldboss', this.worldbossEvents);
    }
    private helltideEvents(e: any) {
        this.addToDocument(EventName.helltide, e.detail);
    }
    private legionEvents(e: any) {
        this.addToDocument(EventName.legion, e.detail);
    }
    private worldbossEvents(e: any) {
        this.addToDocument(EventName.worldboss, e.detail);
    }
    private addToDocument(eventName: EventName, eventDetail: any):void {
        const element = document.getElementById('debbug-' + eventName);
        if (element) {
            const li = document.createElement('li');
            li.classList.add('list-none')
            li.classList.add('text-white')
            li.classList.add('px-4')
            li.innerHTML = eventName.toString();
            element.appendChild(li);
            for (let key of Object.keys(eventDetail)) {
                const li = document.createElement('li');
                li.classList.add('list-none')
                li.classList.add('text-white')
                li.classList.add('px-4')
                if (typeof eventDetail[key] === 'number'){
                    li.innerHTML = key + ': ' + moment.tz(eventDetail[key], 'Europe/London').format('hh:mm A');
                } else if(key === 'nextFive'){
                    li.innerHTML = key + ': ' + eventDetail[key].map((e: any) => moment.tz(e, 'Europe/London').format('hh:mm A')).join(', ');
                } else {
                    li.innerHTML = key + ': ' + eventDetail[key];
                }
                element.appendChild(li);
            }
        }
    }
    
}