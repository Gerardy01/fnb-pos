
// types and interfaces
import { ICounterRepository } from "../repositories/counterRepository"
import { CounterDataReturn } from "../interfaces/ICounter";
import { Transaction } from "sequelize";
export interface ICounterService {
    updateOrCreateCounter(context : string, transaction? : Transaction) : Promise<CounterDataReturn>
}

export class CounterService implements ICounterService {
    constructor(
        private counterRepository : ICounterRepository
    ) {}

    async updateOrCreateCounter(context: string, transaction? : Transaction): Promise<CounterDataReturn> {

        let counter = await this.counterRepository.getByContext(context, transaction);

        if (!counter) {
            const newCounter = await this.counterRepository.createCounter({
                context: context
            }, transaction);
            counter = newCounter;
        } else {
            counter.count += 1;
            counter.save({ transaction });
        }

        return {
            counterId : counter.counter_id,
            context : counter.context,
            count : counter.count,
        }
    }
}