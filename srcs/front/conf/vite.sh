if [ "$NODE_ENV" = "dev" ]; then
    sleep infinity
    # exec pnpm dev
else
    pnpm build
    sleep infinity
    exec pnpm preview;
fi