import { i } from '../../utils/shortcuts.js';
export const getPlayer = () => i('movie_player');
export const getCurrentTime = () => getPlayer()?.getCurrentTime?.() || 0;
export const getDuration = () => getPlayer()?.getDuration?.() || 0;
export const seekTo = s => getPlayer()?.seekTo?.(s);
