import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

interface User {
  id: string;
  login: string;
  password: string;
  version: number;
  createdAt: number;
  updatedAt: number;
}

export interface Artist {
  id: string;
  name: string;
  grammy: boolean;
}

export interface Track {
  id: string;
  name: string;
  artistId: string | null;
  albumId: string | null;
  duration: number;
}

export interface Album {
  id: string;
  name: string;
  year: number;
  artistId: string | null;
}

export interface Favorites {
  artists: string[];
  albums: string[];
  tracks: string[];
}

@Injectable()
export class AppService {
  private users: Record<string, User> = {};
  private artists: Record<string, Artist> = {};
  private tracks: Record<string, Track> = {};
  private albums: Record<string, Album> = {};
  private favorites: Favorites = { artists: [], albums: [], tracks: [] };

  createUser(data: { login: string; password: string }) {
    const id = uuidv4();
    const timestamp = Date.now();
    const user: User = {
      id,
      ...data,
      version: 1,
      createdAt: timestamp,
      updatedAt: timestamp,
    };
    this.users[id] = user;
    return { id: user.id, login: user.login, version: user.version };
  }

  getAllUsers() {
    return Object.values(this.users).map(({ password, ...user }) => user);
  }

  getUserById(id: string) {
    const user = this.users[id];
    if (!user) throw new NotFoundException('User not found');
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  updateUserPassword(id: string, oldPassword: string, newPassword: string) {
    const user = this.users[id];
    if (!user) throw new NotFoundException('User not found');
    if (user.password !== oldPassword) throw new ForbiddenException('Old password is incorrect');
    user.password = newPassword;
    user.version += 1;
    user.updatedAt = Date.now();
    return { id: user.id, login: user.login, version: user.version };
  }

  deleteUser(id: string) {
    if (!this.users[id]) throw new NotFoundException('User not found');
    delete this.users[id];
  }

  getAllArtists() {
    return Object.values(this.artists);
  }

  createArtist(data: { name: string; grammy: boolean }) {
    const artist: Artist = { id: uuidv4(), ...data };
    this.artists[artist.id] = artist;
    return artist;
  }

  deleteArtist(id: string) {
    if (!this.artists[id]) throw new NotFoundException('Artist not found');
    delete this.artists[id];
  }

  getAllTracks() {
    return Object.values(this.tracks);
  }

  createTrack(data: { name: string; artistId: string; albumId: string; duration: number }) {
    const track: Track = { id: uuidv4(), ...data };
    this.tracks[track.id] = track;
    return track;
  }

  deleteTrack(id: string) {
    if (!this.tracks[id]) throw new NotFoundException('Track not found');
    delete this.tracks[id];
  }

  getAllAlbums() {
    return Object.values(this.albums);
  }

  createAlbum(data: { name: string; year: number; artistId: string }) {
    const album: Album = { id: uuidv4(), ...data };
    this.albums[album.id] = album;
    return album;
  }

  deleteAlbum(id: string) {
    if (!this.albums[id]) throw new NotFoundException('Album not found');
    delete this.albums[id];
  }

  getFavorites() {
    return this.favorites;
  }

  addArtistToFavorites(artistId: string) {
    if (!this.artists[artistId]) throw new NotFoundException('Artist not found');
    this.favorites.artists.push(artistId);
  }

  removeArtistFromFavorites(artistId: string) {
    const index = this.favorites.artists.indexOf(artistId);
    if (index === -1) throw new NotFoundException('Artist not in favorites');
    this.favorites.artists.splice(index, 1);
  }
}