import { BadRequestException, Body, Controller, Post, Put, UseInterceptors } from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Transaction } from 'sequelize';
import { ValidateSchema } from 'src/common/validate.decorator';
import { SequelizeTransaction } from 'src/database/common/transaction.decorator';
import { TransactionInterceptor } from 'src/database/common/transaction.interceptor';
import { UsersService } from 'src/routes/users/users.service';
import { GoogleService } from 'src/services/google/google.service';
import { LoginGoogleInput } from './api/login_google.input';
import { RefreshSessionInput } from './api/refresh_session.input';
import { SessionOutput } from './api/session.output';
import { AuthService, JWT_TYPES } from './auth.service';
import { SessionDto } from './dtos/session.dto';
import { LoginGoogleSchema } from './schemas/login_google.schema';


@ApiTags('auth')
@Controller('auth')
@UseInterceptors(TransactionInterceptor)
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly usersService: UsersService,
        private readonly googleService: GoogleService,
    ) { }

    @Post('google')
    @ApiOperation({ summary: 'Create new session via Google' })
    @ApiCreatedResponse({ type: () => SessionOutput })
    @ValidateSchema(LoginGoogleSchema)
    async createSessionWithGoogle(
        @SequelizeTransaction() transaction: Transaction,
        @Body() body: LoginGoogleInput
    ): Promise<SessionDto> {
        const userData = await this.googleService.verifyToken(body.token);
        if (!userData) throw new BadRequestException('Wrong credentials');
        let user = await this.usersService.findUserByEmail(userData.email);
        console.log(userData);
        if (!user) user = await this.usersService.create(userData);
        const { accessToken, refreshToken } = this.authService.generateTokens(user.id);
        return new SessionDto(accessToken, refreshToken);
    }

    @Put()
    @ApiOperation({ summary: 'Prolong current session' })
    @ApiOkResponse({ type: () => SessionDto })
    async prolongSession(
        @SequelizeTransaction() transaction: Transaction,
        @Body() body: RefreshSessionInput
    ): Promise<SessionDto> {
        const tokenData = this.authService.verifyToken(body.refreshToken);
        if (!tokenData?.userId || !tokenData?.sessionToken || tokenData?.type !== JWT_TYPES.refresh) throw new BadRequestException('Invalid token');
        const user = await this.usersService.findUserById(tokenData.userId, transaction);
        const { accessToken, refreshToken } = this.authService.generateTokens(user.id);
        return new SessionDto(accessToken, refreshToken);
    }
}
