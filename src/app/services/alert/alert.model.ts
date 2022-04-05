export class Alert {
    public alertType!: string;
    public autoClose!: boolean;
    public id!: string;
    public message!: string;

    constructor(init?: Partial<Alert>) {
        Object.assign(this, init);
    }
}
