## test

### firstly deploy Tournament Factory on hardhat network

```sh
pnpx hardhat run srcs/scripts/deploy.ts
```

### run chai tests
```sh
pnpx hardhat test
```

## deploy smart contract on blochain

### on avalanche testnet
```sh
pnpx hardhat run srcs/scripts/deploy.ts --network fuji
```

### on avalanche main
```sh
pnpx hardhat run srcs/scripts/deploy.ts --network avalanche
```

