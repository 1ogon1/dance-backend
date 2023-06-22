import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { BattlesService } from './battles.service';
import { Roles } from 'src/common/decorators';
import { EUserRoles } from 'src/common/enums';
import { JwtAuthGuard } from 'src/common/guards';
import { ParticipantsDto, ResetDto, WinnerDto } from './dto';
import { Event } from './battle.schema';
import { IBattle, IEvent, IParticipant } from './interfaces';
import { VoteDto } from './dto/Vote.dto';
import { IRequestWithUser } from 'src/common/interfaces';

@ApiTags('Battles')
@Controller('battles')
export class BattlesController {
  constructor(private battlesService: BattlesService) {}

  @Post('addParticipants')
  @Roles(EUserRoles.ADMIN)
  @UseGuards(JwtAuthGuard)
  public addParticipants(@Body() data: ParticipantsDto): Promise<Event> {
    return this.battlesService.registerParticipants(data);
  }

  @Get('event')
  public getEvent(): Promise<IEvent> {
    return this.battlesService.getEvent();
  }

  @Get('battle/:id')
  public getBattle(@Param('id') id: string): Promise<IBattle> {
    return this.battlesService.getBattleById(id);
  }

  @Get('participants')
  public getParticipants(): Promise<IParticipant[]> {
    return this.battlesService.getParticipants();
  }

  @Get('participant/:id')
  public getParticipant(@Param('id') id: string): Promise<IParticipant> {
    return this.battlesService.getParticipantById(id);
  }

  @Post('reset/:battleId')
  @Roles(EUserRoles.ADMIN)
  @UseGuards(JwtAuthGuard)
  public reset(
    @Body() data: ResetDto,
    @Param('battleId') battleId: string,
  ): Promise<IBattle> {
    return this.battlesService.reset(battleId, data);
  }

  @Post('activatePhoenix/:id')
  @Roles(EUserRoles.ADMIN)
  @UseGuards(JwtAuthGuard)
  public activatePhoenixPower(@Param('id') id: string): Promise<IParticipant> {
    return this.battlesService.activatePhoenixPower(id);
  }

  @Post('vote/:battleId/:participantId')
  @Roles(EUserRoles.JUDGE)
  @UseGuards(JwtAuthGuard)
  public vote(
    @Param('battleId') battleId: string,
    @Param('participantId') participantId: string,
    @Body() data: VoteDto,
    @Req() req: IRequestWithUser,
  ): Promise<IBattle> {
    if (!req.user) {
      throw new Error('user not found');
    }

    return this.battlesService.vote(battleId, participantId, data, req.user.id);
  }

  @Post('setWinner/:battleId')
  @Roles(EUserRoles.ADMIN)
  @UseGuards(JwtAuthGuard)
  public setWinner(
    @Param('battleId') battleId: string,
    @Body() data: WinnerDto,
  ): Promise<IBattle> {
    return this.battlesService.setWinner(battleId, data);
  }

  @Delete('all')
  @Roles(EUserRoles.ADMIN)
  @UseGuards(JwtAuthGuard)
  public deleteAll(): Promise<boolean> {
    return this.battlesService.deleteAll();
  }
}
