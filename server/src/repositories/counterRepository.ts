import Counter from "../models/counter.model";

// types and interfaces
import { Transaction } from "sequelize";
export interface ICounterRepository {
    getByContext(context : string, transaction? : Transaction): Promise<Counter | null>
    createCounter(data : Partial<Counter>, transaction? : Transaction): Promise<Counter>
}


export class CounterRepository implements ICounterRepository {
    getByContext(context: string, transaction? : Transaction): Promise<Counter | null> {
        return Counter.findOne({
            where: { context: context },
            transaction
        });
    }
    createCounter(data: Partial<Counter>, transaction? : Transaction): Promise<Counter> {
        return Counter.create(data, { transaction });
    }
}