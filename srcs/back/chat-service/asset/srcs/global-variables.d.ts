export {};

declare global
{
  var activeConn: Map<number, i_user>;
  const chat_requests_total: client.Counter<"method">;
}
