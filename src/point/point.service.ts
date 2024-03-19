import {Injectable} from "@nestjs/common";
import {UserPointTable} from "../database/userpoint.table";
import {PointHistoryTable} from "../database/pointhistory.table";


@Injectable()
export class PointService {
    constructor(
        private readonly userDb: UserPointTable,
        private readonly historyDb: PointHistoryTable,
    ) {}

    getUserPoint(id: number) {
    }

    getUserPointHistory(id: number) {}

    usePoint(id: number, amount: number) {}

    chargePoint(id: number, amount: number) {}

}