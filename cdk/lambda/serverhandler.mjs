import { IncomingMessage, ServerResponse } from 'http';
import createServer from 'next/dist/server/next.js';
import conf from './.next/required-server-files.json' with { type: 'json' };

process.env.NODE_ENV = 'production'

const currentPort = parseInt(process.env.PORT, 10) || 3000
const hostname = process.env.HOSTNAME || '0.0.0.0'

process.env.__NEXT_PRIVATE_STANDALONE_CONFIG = JSON.stringify(conf.config);

const server = createServer({
  dev: false,
  dir: import.meta.dirname || './',
  port: currentPort,
  hostname: hostname,
  customServer: false,
  conf: conf.config
});

const requestHandler = server.getRequestHandler();

export const handler = async (event) => {
  // console.log("Event:", JSON.stringify(event, null, 2));

  const { request } = event.Records[0].cf;
  const { uri, querystring, headers } = request;

  // Reconstruct URL
  const host = headers["host"][0].value;
  const url = `https://${host}${uri}${querystring ? `?${querystring}` : ""}`;

  // Simulate an HTTP request for Next.js to process
  const req = new IncomingMessage();
  req.method = request.method,
  req.url = url,
  req.headers = headers;
  const res = new ServerResponse(req);

  // Capture Next.js SSR response
  const result = await requestHandler(req, res);
  console.log('Result:', result);

  return {
    status: result?.renderOpts?.statusCode || 200,
    statusDescription: "OK",
    headers: {
      "content-type": [
        {
          key: "Content-Type",
          value: "text/html",
        },
      ],
    },
    bodyEncoding: "text",
    body: result?.body || 'No body generated.',
  };
};

