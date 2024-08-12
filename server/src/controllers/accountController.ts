import { Request, Response } from 'express';


class AccountController {
    async getAccounts(req : Request, res : Response) {
        try {
            res.send("account routes");
        } catch(e) {
            res.send("something wrong")
        }
    }
}


export default new AccountController();