import { User as user } from "./../../entity/User";

declare global {
    namespace Express {
        interface User extends user {}
    }
}
