/// <reference lib="deno.ns" />

Deno.serve(async (req) => {
  const inboundUrl = new URL(req.url);
  let outboundUrl = `https://raw.githubusercontent.com/home-assistant/frontend/refs/heads/dev${inboundUrl.pathname}`;
  if (!outboundUrl.match(/\.(ts|json)$/)) {
    outboundUrl += '.ts';
  }
  return await fetch(outboundUrl.toString());
});
