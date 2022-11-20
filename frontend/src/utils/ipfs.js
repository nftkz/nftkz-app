import { create } from 'ipfs-http-client'

const IPFS_HOST = import.meta.env.VITE_IPFS_HOST
const IPFS_PORT = import.meta.env.VITE_IPFS_PORT || '5001'

const ipfs = create({
  host: IPFS_HOST,
  port: IPFS_PORT,
  protocol: 'http'
})

export default ipfs