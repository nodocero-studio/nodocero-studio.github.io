import { extract } from '@extractus/feed-extractor';
import { writeFile } from 'node:fs/promises';

const CHANNEL_ID = 'UCCfTfcbEAl-oXsskYTT1Zdg';
const RSS_URL = `https://www.youtube.com/feeds/videos.xml?channel_id=${CHANNEL_ID}`;

try {
  const data = await extract(RSS_URL);

  // YouTube solo devuelve los últimos 15 vídeos en el RSS, no todos.
  const videos = data.entries.map((entry) => {
    const videoId = entry.id.split(':').pop();
    return {
      id: videoId,
      title: entry.title,
      published: entry.published, // ya viene en ISO 8601
      badge: 'Original' // ← tendrás que personalizar esto manualmente o por reglas
    };
  });

  await writeFile('videos.json', JSON.stringify(videos, null, 2));
  console.log(`✅ ${videos.length} vídeos guardados en videos.json`);
} catch (error) {
  console.error('❌ Error al leer el feed RSS:', error.message);
  process.exit(1); // para que GitHub Actions marque el workflow como fallido
}
