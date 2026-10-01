import { ListGroup, ListItem } from '../types/types-index';
import { MOVIES_100 } from './data-moviesData';

export const MOVIES_LIST_ID = 'list-movies-100';

export const MOVIES_100_LIST: ListGroup = {
  id: MOVIES_LIST_ID,
  title: 'Top 100 Movies of History',
  description: 'From 1900 to 2026: A visual journey through cinema',
  type: 'ranked',
  color: 'rose',
  icon: 'Film',
  favorite: true,
  sortOrder: 'rank',
  createdAt: new Date('2026-09-01').toISOString(),
  updatedAt: new Date().toISOString(),
  items: MOVIES_100.map((movie, index) => ({
    id: movie.id,
    title: movie.title,
    completed: false,
    priority: 'p4',
    tags: movie.genre,
    rank: index + 1,
    score: movie.imdbScore,
    notes: movie.plot,
    year: movie.year,
    director: movie.director,
    countryCode: movie.countryCode,
    runtime: movie.runtime,
    cast: movie.cast,
    genre: movie.genre,
    coverColor: movie.coverColor,
    createdAt: new Date('2026-09-01').toISOString(),
  }))
};