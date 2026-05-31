import { Controller, Get, Head, HttpCode } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Public } from '../decorators/public.decorator';

@ApiTags('root')
@Controller()
export class RootController {
  @Public()
  @Get()
  @Head()
  @HttpCode(200)
  @ApiOperation({ summary: 'API root (Render health / browser)' })
  root() {
    return {
      status: 'ok',
      health: '/health',
      docs: '/api/docs',
      login: 'POST /api/auth/login',
      swagger: '/api/docs',
    };
  }
}
