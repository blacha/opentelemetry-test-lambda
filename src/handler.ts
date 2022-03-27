import { LambdaHttpResponse, LambdaHttpRequest, lf } from '@linzjs/lambda';
import { fsa } from '@chunkd/fs';

export const handler = lf.http();

handler.router.get('*', async (r: LambdaHttpRequest) => {
  return LambdaHttpResponse.json({ traceId: r.trace.toString(), path: r.path, method: r.method });
});

handler.router.post('*', async (r: LambdaHttpRequest) => {
  const body = r.body;
  return LambdaHttpResponse.json({ traceId: r.trace.toString(), path: r.path, method: r.method, body });
});
