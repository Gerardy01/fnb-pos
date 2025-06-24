


// types and interfaces
export interface DomainEvent {
  type: string;
  payload: any;
  timestamp: Date;
}
export interface IEventPublisherProvider {
    subscribe(eventType : string, handler: (event: DomainEvent) => Promise<void>) : Promise<void>
    publish(event: DomainEvent): Promise<void>;
}



export class InMemoryEventPublisher implements IEventPublisherProvider {

    private subscribers: Map<string, ((event: DomainEvent) => Promise<void>)[]> = new Map();

    async subscribe(eventType: string, handler: (event: DomainEvent) => Promise<void>) : Promise<void> {
        if (!this.subscribers.has(eventType)) {
            this.subscribers.set(eventType, []);
        }
        this.subscribers.get(eventType)!.push(handler);
    }

    async publish(event: DomainEvent) {
        const handlers = this.subscribers.get(event.type) || [];
        await Promise.all(handlers.map(handler => handler(event)));
    }
}