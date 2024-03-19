import {Injectable} from "@nestjs/common";
import {UserPointTable} from "../database/userpoint.table";
import {PointHistoryTable} from "../database/pointhistory.table";
import {UserPoint} from "./point.model";


@Injectable()
export class PointService {
    constructor(
        private readonly userDb: UserPointTable,
        private readonly historyDb: PointHistoryTable,
    ) {}

    getUserPoint(id: number): Promise<UserPoint> {
        this.isValidId(id)
        return this.userDb.selectById(id)
    }

    async getUserPointHistory(id: number) {
        this.isValidId(id)
        const userPointHistory = await this.historyDb.selectAllByUserId(id)
        userPointHistory.sort((a, b) => a.timeMillis - b.timeMillis);
        return userPointHistory
    }

    async usePoint(id: number, amount: number) {
        this.isValidId(id)
        this.isValidAmount(amount)
        const currentUserPoint = await this.userDb.selectById(id)
        if (currentUserPoint.point < amount) throw new Error("포인트가 부족합니다.")
        const updatedPoint = currentUserPoint.point - amount
        const updatedUserPoint = await this.userDb.insertOrUpdate(id, updatedPoint)
        await this.historyDb.insert(id, amount, 1, Date.now())
        return updatedUserPoint
    }

    async chargePoint(id: number, amount: number) {
        this.isValidId(id)
        this.isValidAmount(amount)
        const currentUserPoint = await this.userDb.selectById(id)
        const updatedPoint = currentUserPoint.point + amount
        const updatedUserPoint = await this.userDb.insertOrUpdate(id, updatedPoint)
        await this.historyDb.insert(id, amount, 0, Date.now())
        return updatedUserPoint
    }

    isValidId(id: number) {
        if (Number.isInteger(id) && id > 0) return
        throw new Error("올바르지 않은 ID 값 입니다.")
    }

    isValidAmount(amount: number) {
        if (Number.isInteger(amount) && amount > 0) return
        throw new Error("올바르지 않은 포인트 값 입니다.")
    }

}