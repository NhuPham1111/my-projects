import 'dotenv/config';
import { app } from './app.js';
import { env } from './config/env.js';

const PORT = env.PORT;

app.listen(PORT, () => {
  console.log(`\n🚀 Server is running on http://localhost:${PORT}`);
  console.log(`📝 Environment: ${env.NODE_ENV}`);
  console.log(`❤️  Health check: http://localhost:${PORT}/api/health\n`);
});
