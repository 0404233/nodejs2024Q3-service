import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  HttpCode,
  BadRequestException,
} from '@nestjs/common';
import { AppService } from './app.service';
import { validate as isUUID } from 'uuid';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('user')
  getAllUsers() {
    return this.appService.getAllUsers();
  }

  @Get('user/:id')
  getUserById(@Param('id') id: string) {
    if (!isUUID(id)) throw new BadRequestException('Invalid UUID');
    return this.appService.getUserById(id);
  }

  @Post('user')
  createUser(@Body() body: { login: string; password: string }) {
    const { login, password } = body;
    if (!login || !password) throw new BadRequestException('Missing required fields');
    return this.appService.createUser({ login, password });
  }

  @Put('user/:id')
  updateUserPassword(
    @Param('id') id: string,
    @Body() body: { oldPassword: string; newPassword: string },
  ) {
    if (!isUUID(id)) throw new BadRequestException('Invalid UUID');
    return this.appService.updateUserPassword(id, body.oldPassword, body.newPassword);
  }

  @Delete('user/:id')
  @HttpCode(204)
  deleteUser(@Param('id') id: string) {
    if (!isUUID(id)) throw new BadRequestException('Invalid UUID');
    this.appService.deleteUser(id);
  }

  @Get('artist')
  getAllArtists() {
    return this.appService.getAllArtists();
  }

  @Post('artist')
  createArtist(@Body() body: { name: string; grammy: boolean }) {
    return this.appService.createArtist(body);
  }

  @Delete('artist/:id')
  deleteArtist(@Param('id') id: string) {
    this.appService.deleteArtist(id);
  }

  @Get('track')
  getAllTracks() {
    return this.appService.getAllTracks();
  }

  @Post('track')
  createTrack(@Body() body: { name: string; artistId: string; albumId: string; duration: number }) {
    return this.appService.createTrack(body);
  }

  @Delete('track/:id')
  deleteTrack(@Param('id') id: string) {
    this.appService.deleteTrack(id);
  }

  @Get('album')
  getAllAlbums() {
    return this.appService.getAllAlbums();
  }

  @Post('album')
  createAlbum(@Body() body: { name: string; year: number; artistId: string }) {
    return this.appService.createAlbum(body);
  }

  @Delete('album/:id')
  deleteAlbum(@Param('id') id: string) {
    this.appService.deleteAlbum(id);
  }

  @Get('favorites')
  getFavorites() {
    return this.appService.getFavorites();
  }

  @Post('favorites/artist/:id')
  addArtistToFavorites(@Param('id') id: string) {
    this.appService.addArtistToFavorites(id);
  }

  @Delete('favorites/artist/:id')
  removeArtistFromFavorites(@Param('id') id: string) {
    this.appService.removeArtistFromFavorites(id);
  }
}