export class Menu {
    private selectorTimers: HTMLElement;
    private selectorFarm: HTMLElement;

    set SelectorTimers(value: HTMLElement) {
        this.selectorTimers = value;
    }
    get SelectorTimers(): HTMLElement {
        return this.selectorTimers;
    }
    set SelectorFarm(value: HTMLElement) {
        this.selectorFarm = value;
    }
    get SelectorFarm(): HTMLElement {
        return this.selectorFarm;
    }
    constructor() {
    
                // console.log('=== DOM CONTENT LOADED ===');
                this.SelectorTimers = document.getElementById("timersMenu");
                this.SelectorFarm = document.getElementById("farmMenu");
                // console.log('=== SELECTOR TIMERS ===')
                this.SelectorTimers.classList.add("tabone");
                this.initListeners();
        
    }
    initListeners() {
        // console.log('=== INIT LISTENERS ===');
        // console.log('=== SELECTOR TIMERS ===')
        // console.log(this.SelectorTimers);
        this.SelectorTimers.addEventListener("click", () => {
            // console.log('=== CLICK TIMERS ===')
            this.showTimers();
        });
        // console.log('=== SELECTOR FARM ===')
        // console.log(this.selectorFarm);
        this.SelectorFarm.addEventListener("click", () => {
            // console.log('=== CLICK FARM ===')
            this.showFarm();
        });
    }
    showTimers() {
        this.SelectorTimers.classList.add("tabone");
        this.SelectorFarm.classList.remove("tabone");
    }
    showFarm() {
        this.SelectorFarm.classList.add("tabone");
        this.SelectorTimers.classList.remove("tabone");
    }
}