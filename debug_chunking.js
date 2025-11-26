import { ChunkingService } from './extension/services/ChunkingService.js';

const service = new ChunkingService();

console.log('--- Test 1: Split text ---');
const text1 =
  'This is a long text that needs to be split into multiple chunks for processing.';
const chunkSize1 = 20;
const overlap1 = 5;
const chunks1 = service.chunkText(text1, chunkSize1, overlap1);
console.log('Chunks:', chunks1);

console.log('--- Test 2: Sentence boundary ---');
const text2 = 'First sentence. Second sentence is longer.';
const chunkSize2 = 25;
const chunks2 = service.chunkText(text2, chunkSize2, 0);
console.log('Chunks:', chunks2);
