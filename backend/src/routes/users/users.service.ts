import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Transaction } from 'sequelize';
import { User } from 'src/database/models/user.model';

export type UserInputData = {
    name: string;
    email: string;
};

@Injectable()
export class UsersService {
    constructor(
        @InjectModel(User)
        private readonly userModel: typeof User,
    ) { }

    async findUserByEmail(email: string, transaction?: Transaction): Promise<User> {
        return await this.userModel.findOne({ where: { email }, transaction });
    }

    async create(userData: UserInputData, transaction?: Transaction): Promise<User> {
        return await this.userModel.create(userData, { transaction });
    }

    async findUserById(id: ID, transaction?: Transaction): Promise<User> {
        return await this.userModel.findByPk(id, { transaction });
    }
}
